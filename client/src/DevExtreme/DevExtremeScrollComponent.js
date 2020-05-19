import {
  initialize, startTimer, endTimer, sendIt,
  createScrollView
  } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class DevExtremeScrollComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "DevExtreme";
    this.testname = "scroll";
    this.name = "DevExtreme Scroll Test";
    this.startPage = 0;
    this.startRow = 1;
    this.startIndex = 1;
    this.isScrollWorking = false;
    this.summary = `This test will display performance of the DevExtreme Scroll Renderer.`;
    this.isScrollToEnd = false;
    this.pageToCheckForEnd = 3;
    this.downPageCheck = 2;
    this.upPageCheck = 2;

    initialize(this);

    this.cleartest.addEventListener("click", (event) => {
      this.gridToTest.dispose();
      document.getElementById('startScrollBtn').style.display = 'none';
      document.getElementById('scrollToEndBtn').style.display = 'none';
      document.getElementById('pageSize').value = '20';
      scrollDownLabel.setAttribute('style', 'width: 110px; display: none ');
      scrollUpLabel.setAttribute('style', 'width: 110px; display: none ');
      scrollDownVal.setAttribute('style', 'width: 80px; display: none ');
      scrollUpVal.setAttribute('style', 'width: 80px; display: none ');
      scrollDownContainer.setAttribute('style', 'display: none ');
      scrollUpContainer.setAttribute('style', 'display: none ');
      document.getElementById('scrollDownVal').value = 1;
      document.getElementById('scrollUpVal').value = 1;
      this.scrollDownStart = false;
      this.isScrollToEnd = false;
      this.scrollUpStart = false;
      this.gridToTest = null;
      document.getElementById("isPreload").disabled = false;
    });

    this.starttest.addEventListener("click", (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
        document.getElementById("isPreload").disabled = true;
      }
    });

    createScrollView(this.parent, this.startScrollingDown.bind(this), this.scrollToEnd.bind(this));
    this.parent.append(document.createElement('br'));

    var container = document.createElement('div');
    container.setAttribute('style', 'display: inline;');
    var preloadCheck = document.createElement("INPUT");
    preloadCheck.setAttribute('type', 'checkbox');
    preloadCheck.setAttribute('checked', true);
    preloadCheck.setAttribute('id', 'isPreload');
    preloadCheck.setAttribute('style', 'height:20px;');
    preloadCheck.addEventListener('change', this.preloadChange.bind(this));

    var label = document.createElement('label')
    label.htmlFor = 'isPreload';
    label.appendChild(document.createTextNode('Is Preload:'));

    container.append(label);
    container.append(preloadCheck);
    this.parent.append(container);
  }

  preloadChange(event) {
    if (event.target.checked) {
      this.pageToCheckForEnd = 3;
      this.downPageCheck = 2;
      this.upPageCheck = 2;
    } else {
      this.pageToCheckForEnd = 2;
      this.downPageCheck = 1;
      this.upPageCheck = 1;
    }
  }

  scrollToEnd() {
    this.isScrollToEnd = true;
    this.startScrollingDown();
  }

  startScrollingDown() {
    const pageSize = parseInt(document.getElementById("pageSize").value,0);
    let totalTargetScrollDownPage = parseInt(document.getElementById("scrollDownVal").value,0);
    const totalTargetScrollUpPage = parseInt(document.getElementById("scrollUpVal").value,0);

    if (this.isScrollToEnd) {
      startTimer(this);
      this.gridToTest.pageIndex((window.tableSize/pageSize) - 1);
    } else {
      this.scrollDownStart = true;
      this.downPage = totalTargetScrollDownPage;
      this.upPage = totalTargetScrollUpPage;
      startTimer(this);
      this.gridToTest.pageIndex(totalTargetScrollDownPage);
    }
  }

  runGridTest() {
    var container3 = document.createElement('div');
    container3.setAttribute('id', 'target');
    this.parent.append(container3);

    var me = this;
    me.gridToTest = me.gridToTest ? me.gridToTest.dispose() : null;
    let pageSize = document.getElementById("pageSize") ? parseInt(document.getElementById("pageSize").value): 20;
    me.startPage = 1;
    me.startRow = 0;

    if (this.gridToTest == null) {
      let gridDataSource = new DevExpress.data.DataSource({
        key: 'id',
        load: function (loadOptions) {
          let defer = $.Deferred();
          const pageNumber = me.gridToTest.getDataSource()._pageIndex;
          const start = me.gridToTest.getDataSource()._pageIndex * parseInt(document.getElementById('pageSize').value);
          $.getJSON( `${baseURL}api/rawData/getPageData?tableName=${window.tableName}&page=${pageNumber}&start=${start}&limit=${pageSize}`)
          .done(function (result) {
            if (me.isScrollToEnd && pageNumber === ((window.tableSize/pageSize)-me.pageToCheckForEnd)) {
              const milliseconds = endTimer(me);
              const testName = 'Scroll End'
              const testJSON = {
                product: me.product,
                testname: testName,
                milliseconds: milliseconds,
                pageSize: pageSize
              }
              sendIt(me.product, testName, testJSON, milliseconds);
              me.isScrollToEnd = false;
            }

            if (me.scrollDownStart && pageNumber === (me.downPage + me.downPageCheck )) {
              me.scrollUpStart = true;
              me.scrollDownStart = false;
              me.gridToTest.pageIndex(me.upPage);
            }

            if (me.scrollUpStart && pageNumber === (me.upPage + me.upPageCheck )) {
              const milliseconds = endTimer(me);
              const testName = 'scroll'
              const testJSON = {
                product: me.product,
                testname: testName,
                milliseconds: milliseconds,
                pageSize: pageSize
              }
              sendIt(me.product, testName, testJSON, milliseconds);
              me.scrollUpStart = false;
            }

            defer.resolve(result.users, { totalCount: result.totalCount });
            document.getElementById('startScrollBtn').style.display = 'inline-block';
            document.getElementById('scrollUpLabel').style.display = 'inline-block';
            document.getElementById('scrollUpVal').style.display = 'inline-block';
            document.getElementById('scrollDownLabel').style.display = 'inline-block';
            document.getElementById('scrollDownVal').style.display = 'inline-block';
            document.getElementById('scrollDownContainer').style.display = 'inline-block';
            document.getElementById('scrollUpContainer').style.display = 'inline-block';
            document.getElementById('scrollToEndBtn').style.display = 'inline-block';
          })

          return defer.promise();
        },
      });
     
      var dataGridObj = {
        dataSource: gridDataSource,
        showBorders: true,
        remoteOperations: true,
        scrolling: {
          mode: "virtual",
          rowRenderingMode: "virtual",
          preloadEnabled: document.getElementById("isPreload").checked,
          scrollByContent: true,
          showScrollbar: "always"
        },
        paging: {
          pageSize: pageSize,
        },
        columns: [
          {
            dataField: "id",
            dataType: "number",
          },
          {
            dataField: "firstname",
            dataType: "string",
          },
          {
            dataField: "lastname",
            dataType: "string",
          },
          {
            dataField: "address",
            dataType: "string",
          },
          {
            dataField: "title",
            dataType: "string",
          },
          {
            dataField: "company",
            dataType: "string",
          },
        ],
        height: "400px",
      };
    }
    me.gridToTest = new DevExpress.ui.dxDataGrid(document.getElementById("target"), dataGridObj);
    startTimer(this);
  }

  disconnectedCallback() {
    if(this.gridToTest){
      this.gridToTest.dispose();
      this.gridToTest = null;
    }
  }
}
customElements.define("z-devextreme-scroll", DevExtremeScrollComponent);


