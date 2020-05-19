import { initialize } from "../util/ComponentHelper.js";
import { startTimer, endTimer, sendIt,createBufferView } from "../util/ComponentHelper.js";
import { baseURL } from '../util/config.js';
class agGridBufferedComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "aggrid";
    this.testname = "buffered";
    this.name = "ag-Grid Buffered Test";
    this.startPage = 1;
    this.totalPage = 1;
    this.gridTotalRecord = 1;
    this.defaultPageSize = 20;
    this.summary = `
    This test will display performance of the ag-Grid Buffered Renderer.
        `;
    initialize(this);
    this.cleartest.addEventListener("click", (event) => {
      this.clearTestGrid();
    });
    this.starttest.addEventListener("click", (event) => {
      this.runGridTest();
    });
    this.parent.style.width = "100%";
    this.parent.style.height = "440px";
    createBufferView(this.parent);
  }

  clearTestGrid() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }

    this.gridToTest = null;
    document.getElementById("pageSize").value = this.defaultPageSize;
  }

  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
      let pageSize = document.getElementById("pageSize").value;
      pageSize= pageSize ? parseFloat(pageSize): 200;
      me.startPage = 1;
      this.gridOptions = {
        columnDefs: [
          { headerName: "Id", field: "id", suppressMenu: true,width:60 },
          { headerName: "First Name", field: "firstname", suppressMenu: true,width:120 },
          { headerName: "Last Name", field: "lastname", suppressMenu: true,width:120 },
          { headerName: "Title", field: "title", suppressMenu: true,width:120 },
          { headerName: "Address", field: "address", suppressMenu: true,width:140 },
          { headerName: "Organization", field: "company", suppressMenu: true },
        ],
        rowModelType: "serverSide",
        cacheBlockSize: pageSize,
      };
      me.gridToTest = new agGrid.Grid(me.parent, me.gridOptions);
      startTimer(this);
      var datasource = me.serverSideDatasource();
      me.gridOptions.api.setServerSideDatasource(datasource);
    }
  }

  serverSideDatasource() {
    return {
      getRows: (params) => {
        let me = this;
        let page = me.startPage;
        let tableName = window.tableName ? window.tableName : "mega_1000000";
        let pageSize = document.getElementById("pageSize").value;
        me.gridTotalRecord = (page - 1) * parseFloat(pageSize);
        let apiUrl = `${baseURL}api/rawData/getPageData?tableName=${tableName}&page=${page}&start=${me.gridTotalRecord}&limit=${pageSize}`;
        agGrid.simpleHttpRequest({ url: apiUrl }).then((rowData) => {
          if (rowData.users.length > 0) {
            let totalPage = Math.ceil(rowData.totalCount / parseFloat(pageSize));
            let lastRow = () => {
              if (totalPage <= 1) return rowData.totalCount;
              else if (page <= totalPage - 2) return -1;
              else return rowData.totalCount;
            };
            me.startPage = page + 1;
            params.successCallback(rowData.users, lastRow());
            if(me.startPage ===2){
              me.calcTimer();
            }
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
customElements.define("z-aggrid-buffered", agGridBufferedComponent);
