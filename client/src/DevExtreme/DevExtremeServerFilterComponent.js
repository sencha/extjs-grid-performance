import {
  initialize, startTimer, endTimer, sendIt,
  createServerSideFilterView
  } from '../util/ComponentHelper.js'  
import { baseURL } from '../util/config.js';

class DevExtremeServerFilterComponent extends HTMLElement {

  connectedCallback() {
    this.formstate = "hide";
    this.product = "DevExtreme";
    this.testname = "server filter";
    this.name = "DevExtreme DataGrid Server Filter Test"
    this.isStartedFlag = false;
    this.startPage = 0;
    this.startRow = 0;
    // this.totalCount = 1000000;
    this.summary = `
    This test will display performance of the DevExtreme DataGrid Server Filter Renderer.
        `
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      // this.gridToTest.destroy()
      this.gridToTest.dispose();
      document.getElementById('startFilterBtn').style.display = 'none';
      document.getElementById('clearFilterBtn').style.display = 'none';
      document.getElementById('pageSize').value = '200';
      inputFilterVal.setAttribute('style', 'width: 150px; display: none ');
      filterValueLabel.setAttribute('style', 'width: 150px; display: none ');
      this.gridToTest = null;
      document.getElementById("isPreload").disabled = false;
    });
    this.starttest.addEventListener('click', (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
        document.getElementById("isPreload").disabled = true;
      }
    });
    createServerSideFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
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

  startFiltering() {
    this.isStartFilter = true;
    this.isStartedFlag = true;
    this.startRow = 0;
    this.startPage = 1;
    startTimer(this);
    this.gridToTest.filter(['firstname', '=', document.getElementById('inputFilterVal').value]);
  }
  
  clearFiltering() {
    this.isStarted = false;
    this.startRow = 0;
    this.startPage = 1;
    document.getElementById('inputFilterVal').value = '';
    this.gridToTest.clearFilter();
  }

  calcTimer() {
    var milliseconds = endTimer(this)
    var testJSON = {
      product: this.product,
      testname: this.testname,
      milliseconds: milliseconds
    }
    sendIt(this.product, this.testname, testJSON, milliseconds)
  }

  runGridTest() {
    var container3 = document.createElement('div');
    container3.setAttribute('id', 'target');
    this.parent.append(container3);

    var me = this;
    me.gridToTest = me.gridToTest ? me.gridToTest.dispose() : null;
    let pagePerRow = document.getElementById("pageSize") ? parseInt(document.getElementById("pageSize").value, 10): 100;
    me.startPage = 1;
    me.startRow = 0;
    let gridDataSource = new DevExpress.data.DataSource({
      load: function (loadOptions) {
        let defer = $.Deferred();
        const pageNumber = me.gridToTest.getDataSource()._pageIndex;
        const start = me.gridToTest.getDataSource()._pageIndex * parseInt(document.getElementById('pageSize').value);

        $.getJSON(`${baseURL}api/rawData/getDevExtremeData?tableName=${window.tableName}&page=${pageNumber}&start=${start}&limit=${pagePerRow}`,{
            filter: loadOptions.filter ? JSON.stringify(loadOptions.filter) : "",
        })
        .done(function (data) {
          defer.resolve(data.result, { totalCount: data.totalCount });
          if(me.isStartedFlag && pageNumber === 1) {
            me.calcTimer();
            me.isStartedFlag = false;
          }
        })
      return defer.promise();
      },
      onChanged: function() {
        document.getElementById('startFilterBtn').style.display = 'inline-block';
        document.getElementById('clearFilterBtn').style.display = 'inline-block';
        document.getElementById('inputFilterVal').style.display = 'inline-block';
        document.getElementById('filterValueLabel').style.display = 'inline-block';
      }
    });
      
    var dataGridObj = {
      dataSource: gridDataSource,
      showBorders: true,
      remoteOperations: true,
      scrolling: {
        mode: "virtual",
        rowRenderingMode: "virtual",
        showScrollbar: "always",
        preloadEnabled: document.getElementById("isPreload").checked,
      },
      paging: {
        pageSize: pagePerRow,
      },
      filterRow: {
        visible: false,
        applyFilter: "auto"
      },
      // headerFilter: { visible: true },
      columns: [{
          dataField: "id",
          dataType: "number"
      }, {
          dataField: "firstname",
          dataType: "string"
      }, {
          dataField: "lastname",
          dataType: "string"
      }, {
          dataField: "address",
          dataType: "string"
      }, {
          dataField: "title",
          dataType: "string"
      }, {
          dataField: "company",
          dataType: "string"
      }],
      height: "400px",
    }
    me.gridToTest = new DevExpress.ui.dxDataGrid(document.getElementById("target"), dataGridObj);
  }
  disconnectedCallback() {
    if(this.gridToTest){
      this.gridToTest.dispose();
    }
    this.gridToTest = null;
  }
}
customElements.define("z-devextreme-server-filter", DevExtremeServerFilterComponent);