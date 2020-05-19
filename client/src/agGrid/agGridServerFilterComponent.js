import { initialize } from "../util/ComponentHelper.js";
import { startTimer, endTimer, sendIt,createServerSideFilterView } from "../util/ComponentHelper.js";
import { baseURL } from '../util/config.js';
class agGridServerFilterComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "aggrid";
    this.testname = "server filter";
    this.name = "ag-Grid Basic Test";
    this.startPage = 1;
    this.totalPage = 1;
    this.gridTotalRecord = 0;
    this.defaultPageSize = 20;
    this.filter = "";
    this.serverFilterFlag = false;
    this.summary = `This test will display performance of the ag-Grid Basic Renderer.`;
    initialize(this);
    this.cleartest.addEventListener("click", (event) => {
      this.clearTestGrid();
    });
    this.starttest.addEventListener("click", (event) => {
      this.runGridTest();
    });
    this.parent.style.width = "100%";
    this.parent.style.height = "440px";
    createServerSideFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }

  clearTestGrid() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }

    this.gridToTest = null;
    this.filter = "";
    this.serverFilterFlag = false;

    document.getElementById('startFilterBtn').style.display = 'none';
    document.getElementById('clearFilterBtn').style.display = 'none';
    document.getElementById('inputFilterVal').style.display='none';
    document.getElementById('filterValueLabel').style.display='none';
    document.getElementById("pageSize").value = this.defaultPageSize;
    document.getElementById('inputFilterVal').value = '';
  }

  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
      me.startPage = 1;
      let pageSize = document.getElementById("pageSize").value;
      pageSize = pageSize ? parseFloat(pageSize) : 200;
      this.gridOptions = {
        columnDefs: [
          { headerName: "Id", field: "id", suppressMenu: true,width:60 },
          { headerName: "First Name", field: "firstname", suppressMenu: true,width:120 },
          { headerName: "Last Name", field: "lastname", suppressMenu: true,width:120 },
          { headerName: "Title", field: "title", suppressMenu: true ,width:120},
          { headerName: "Address", field: "address", suppressMenu: true ,width:140},
          { headerName: "Organization", field: "company", suppressMenu: true },
        ],
        rowModelType: "serverSide",
        cacheBlockSize: pageSize,
      };
      me.gridToTest = new agGrid.Grid(me.parent, me.gridOptions);
      var datasource = me.serverSideDatasource();
      me.gridOptions.api.setServerSideDatasource(datasource);
    }
  }

  showFilterInput(){
      document.getElementById("inputFilterVal").style.display = "inline-block";
      document.getElementById("startFilterBtn").style.display = "inline-block";
      document.getElementById("clearFilterBtn").style.display = "inline-block";
      document.getElementById('filterValueLabel').style.display = 'inline-block';
  }

  serverSideDatasource() {
    return {
      getRows: (params) => {
        let me = this;
        let page = me.startPage;
        let tableName = window.tableName ? window.tableName : "mega_1000000";
        let pageSize = document.getElementById("pageSize").value;
        me.gridTotalRecord = (page - 1) * parseFloat(pageSize);
        let apiUrl = `${baseURL}api/rawData/getPageData?tableName=${tableName}&page=${page}&start=${me.gridTotalRecord}&limit=${pageSize}&filter=${me.filter}`;
        agGrid.simpleHttpRequest({ url: apiUrl }).then((rowData) => {
          if (rowData.users.length > 0) {
            let totalPage = Math.ceil(
              rowData.totalCount / parseFloat(pageSize)
            );
            let lastRow = () => {
              if (totalPage <= 1) return rowData.totalCount;
              else if (page <= totalPage - 2) return -1;
              else return rowData.totalCount;
            };
            me.startPage = page + 1;
            params.successCallback(rowData.users, lastRow());
            if (me.serverFilterFlag) {
              me.calcTimer();
              me.serverFilterFlag = false;
            }
            me.showFilterInput()
          } else {
            params.successCallback(
              [{ columnNameField: "No results found" }],
              1
            );
          }
        });
      },
    };
  }

  startFiltering() {
    startTimer(this);
    var inputFilterVal = document.getElementById("inputFilterVal").value
      ? document.getElementById("inputFilterVal").value
      : "";
    this.filter = JSON.stringify([
      { property: "firstname", value: inputFilterVal },
    ]);
    this.serverFilterFlag = true;
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    this.runGridTest();
  }

  clearFiltering() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    this.filter = "";
    this.serverFilterFlag = false;
    document.getElementById("inputFilterVal").value = "";
    this.runGridTest();
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
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
  }
}
customElements.define("z-aggrid-server-filter", agGridServerFilterComponent);
