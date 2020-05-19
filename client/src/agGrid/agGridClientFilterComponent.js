import { initialize } from "../util/ComponentHelper.js";
import { startTimer, endTimer, sendIt,createFilterView } from "../util/ComponentHelper.js";
import { baseURL } from '../util/config.js';
class agGridClientFilterComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "aggrid";
    this.testname = "client filter";
    this.name = "ag-Grid Client Filter Test";
    this.startPage = 1;
    this.startRow = 0;
    this.summary = `This test will display performance of the ag-Grid Client Filter Renderer.`;
    initialize(this);

    this.cleartest.addEventListener("click", (event) => {
      this.clearTestGrid();
    });
    this.starttest.addEventListener("click", (event) => {
      this.runGridTest();
    });
    this.parent.style.height = "360px";

    createFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }

  clearTestGrid() {
    var totalCount = JSON.parse(
      JSON.stringify(this.parent.childElementCount)
    );
    for (var index = totalCount - 1; index > 1; index--) {
      this.parent.removeChild(this.parent.childNodes[index]);
    }
    this.gridToTest = null;
    this.filter = "";
    this.serverFilterFlag = false;
    document.getElementById("inputFilterVal").value = "";
    document.getElementById("filterValueLabel").style.display ="none";
    document.getElementById("inputFilterVal").style.display ="none";
    document.getElementById("startFilterBtn").style.display ="none";
    document.getElementById("clearFilterBtn").style.display ="none";
  }

  startFiltering() {
    startTimer(this);
    var filterInstance = this.gridOptions.api.getFilterInstance("firstName");
    var inputFilterVal = document.getElementById("inputFilterVal").value
      ? document.getElementById("inputFilterVal").value
      : "";
    var model = { type: "set", values: [inputFilterVal] };
     filterInstance.setModel(model);
    this.gridOptions.api.onFilterChanged();
    this.calcTimer();
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

  clearFiltering() {
    document.getElementById("inputFilterVal").value = "";
    this.gridOptions.api.setFilterModel(null);
  }

  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
      let tableName = window.tableName ? window.tableName : "mega_1000000";
      this.gridOptions = {
        columnDefs: [
          { headerName: "Id", field: "id", suppressMenu: true,width:60 },
          { headerName: "First Name", field: "firstname", colId: "firstName", suppressMenu: true,width:120 },
          { headerName: "Last Name", field: "lastname", colId: "lastName", suppressMenu: true,width:120 },
          { headerName: "Title", field: "title", colId: "title" , suppressMenu: true,width:120 },
          { headerName: "Address", field: "address", colId: "address" , suppressMenu: true,width:140 },
          { headerName: "Organization", field: "company" , suppressMenu: true},
        ],
      };
      let apiUrl = `${baseURL}api/rawData/getAllData?tableName=${tableName}&page=${me.startPage}&start=${me.startRow}`;
      agGrid.simpleHttpRequest({ url: apiUrl }).then(function (data) {
        if (data) {
          me.gridOptions.api.setRowData(data.users);
          document.getElementById("inputFilterVal").style.display =
            "inline-block";
            document.getElementById("filterValueLabel").style.display =
            "inline-block";
          document.getElementById("startFilterBtn").style.display =
            "inline-block";
          document.getElementById("clearFilterBtn").style.display =
            "inline-block";
        }
      });
      me.gridToTest = new agGrid.Grid(me.parent, me.gridOptions);
    }
  }
  
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
  }
}
customElements.define("z-aggrid-client-filter", agGridClientFilterComponent);
