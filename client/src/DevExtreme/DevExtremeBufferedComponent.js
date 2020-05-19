import {
  initialize, startTimer, endTimer, sendIt,
  createBufferView
  } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class DevExtremeBufferedComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "DevExtreme";
    this.testname = "buffered";
    this.name = "DevExtreme Buffered Test";
    this.startPage = 0;
    this.startRow = 0;

    this.summary = `
    This test will display performance of the DevExtreme Buffered Renderer.
        `;
    initialize(this);
    this.cleartest.addEventListener("click", (event) => {
      this.gridToTest.dispose();
      document.getElementById('pageSize').value = '20';
      this.gridToTest = null;
      document.getElementById("isPreload").disabled = false;
    });
    this.starttest.addEventListener("click", (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
      document.getElementById("isPreload").disabled = true;
      }
    });
    createBufferView(this.parent);
    this.parent.append(document.createElement('br'));

    var container = document.createElement('div');
    container.setAttribute('style', 'display: inline;');
    var preloadCheck = document.createElement("INPUT");
    preloadCheck.setAttribute('type', 'checkbox');
    preloadCheck.setAttribute('checked', true);
    preloadCheck.setAttribute('id', 'isPreload');
    preloadCheck.setAttribute('style', 'height:20px;');

    var label = document.createElement('label')
    label.htmlFor = 'isPreload';
    label.appendChild(document.createTextNode('Is Preload:'));

    container.append(label);
    container.append(preloadCheck);
    this.parent.append(container);
  }

  runGridTest() {
    var container3 = document.createElement('div');
    container3.setAttribute('id', 'target');
    this.parent.append(container3);

    var me = this;
    me.gridToTest = me.gridToTest ? me.gridToTest.dispose() : null;
    let pagePerRow = document.getElementById("pageSize")
      ? parseFloat(document.getElementById("pageSize").value): 100;
    me.startPage = 1;
    me.startRow = 0;

    if (this.gridToTest == null) {
      let gridDataSource = new DevExpress.data.DataSource({
        load: function (loadOptions) {
          let d = $.Deferred();
          const pageNumber = me.gridToTest.getDataSource()._pageIndex;
          const start = me.gridToTest.getDataSource()._pageIndex * parseInt(document.getElementById('pageSize').value);

          $.getJSON(
            `${baseURL}api/rawData/getPageData?tableName=${window.tableName}&page=${pageNumber}&start=${start}&limit=${pagePerRow}`
          ).done(function (result) {
            d.resolve(result.users, {
              totalCount: result.totalCount,
            });
            if (pageNumber === 1) { // calculate time performance
              me.calcTimer();
            }
          });
          return d.promise();
        },
      });
     
      var dataGridObj = {
        dataSource: gridDataSource,
        showBorders: true,
        remoteOperations: {
          paging: true,
        },
        scrolling: {
          mode: "virtual",
          rowRenderingMode: "virtual",
          showScrollbar: "always",
          preloadEnabled: document.getElementById("isPreload").checked,
        },
        paging: {
          pageSize: pagePerRow,
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

  calcTimer() {
    let me = this;
    let milliseconds = endTimer(me);
    let testJSON = {
      product: me.product,
      testname: me.testname,
      milliseconds: milliseconds,
    };
    sendIt(me.product, me.testname, testJSON, milliseconds);
  }

  disconnectedCallback() {
    if(this.gridToTest){
      this.gridToTest.dispose();
      this.gridToTest = null;
    }
  }
}
customElements.define("z-devextreme-buffered", DevExtremeBufferedComponent);
