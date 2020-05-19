import { initialize } from "../util/ComponentHelper.js";
import { startTimer, endTimer, sendIt,createScrollView } from "../util/ComponentHelper.js";
import { baseURL } from '../util/config.js';
class agGridScrollComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "aggrid";
    this.testname = "scroll";
    this.name = "ag-Grid Scroll Test";
    this.startPage = 1;
    this.totalRecords = 1;
    this.gridTotalRecord = 1;
    this.totalPage = 1;
    this.startScrollingFlag = false;
    this.lastPageScrollingFlag = false;
    this.summary = `
    This test will display performance of the ag-Grid Scroll Renderer.
        `;
    initialize(this);
    this.cleartest.addEventListener("click", (event) => {
      this.clearTestGrid();
    });
    this.starttest.addEventListener("click", (event) => {
      this.runGridTest();
    });
    this.parent.style.width = "100%";
    this.parent.style.height = "360px";
    createScrollView(this.parent, this.startScrollingBtn.bind(this),this.scrollToEnd.bind(this))
  }

  clearTestGrid() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    this.startScrollingFlag = false;
    this.lastPageScrollingFlag = false;
    document.getElementById("scrollUpVal").value = "";
    document.getElementById("scrollDownVal").value = "";
    document.getElementById('scrollDownContainer').setAttribute('style', 'display: none');
    document.getElementById('scrollUpContainer').setAttribute('style', 'display: none');
    document.getElementById('startScrollBtn').setAttribute('style', 'display: none');
    document.getElementById("scrollToEndBtn").style.display = "none";
  }

  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
      me.startPage = 1;
      let pageSize = document.getElementById("pageSize").value;
      pageSize = pageSize ? parseFloat(pageSize) : 200;
      me.startScrollingFlag = false;
      me.lastPageScrollingFlag = false;
      this.gridOptions = {
        columnDefs: [
          { headerName: "Id", field: "id", suppressMenu: true, width: 60 },
          {
            headerName: "First Name",
            field: "firstname",
            suppressMenu: true,
            width: 120,
          },
          {
            headerName: "Last Name",
            field: "lastname",
            suppressMenu: true,
            width: 120,
          },
          {
            headerName: "Title",
            field: "title",
            suppressMenu: true,
            width: 120,
          },
          {
            headerName: "Address",
            field: "address",
            suppressMenu: true,
            width: 140,
          },
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

  serverSideDatasource() {
      return {
        getRows: (params) => {
          let me = this;
          let page = me.startPage;
          let tableName = window.tableName ? window.tableName : "mega_1000000";
          let pageSize = parseFloat(
            document.getElementById("pageSize").value
          );
          me.gridTotalRecord = (page - 1) * parseFloat(pageSize);
          let apiUrl = `${baseURL}api/rawData/getPageData?tableName=${tableName}&page=${page}&start=${me.gridTotalRecord}&limit=${pageSize}`;
          agGrid.simpleHttpRequest({ url: apiUrl }).then((rowData) => {
            if (rowData.users.length > 0) {
              let totalPage = Math.ceil(rowData.totalCount / parseFloat(pageSize)); //Calculate Total Page.
              me.totalPage = totalPage;
              me.totalRecords = rowData.totalCount -1;
              let lastRow = () => {
                if (totalPage <= 1) return rowData.totalCount;
                else if (me.startPage <= totalPage - 2) return -1;
                else return rowData.totalCount;
              };
              me.startPage = page + 1;
              if (me.startScrollingFlag) {
                params.successCallback(rowData.users, lastRow());
                me.startScrolling();
              } else if (me.lastPageScrollingFlag) {
                params.successCallback(rowData.users, lastRow());
                me.lastPageScrolling();
              } else {
                params.successCallback(rowData.users, lastRow());
              }
              me.showFilterInput();
            } else {
              params.successCallback(
                [{ columnNameField: "No results found" }],
                1
              );
            }
          });
      }
    }
  }

  showFilterInput() {
    document.getElementById('scrollDownContainer').setAttribute('style', 'display: inline-flex');
    document.getElementById('scrollUpContainer').setAttribute('style', 'display: inline-flex');
    document.getElementById('startScrollBtn').setAttribute('style', 'display: inline-flex');
    document.getElementById('scrollToEndBtn').setAttribute('style', 'display: inline-flex');
    document.getElementById("scrollToEndBtn").style.display = "inline-flex";
  }

  startScrollingBtn() {
    let scrollDownValValue = document.getElementById("scrollDownVal").value;
    let scrollUpValValue = document.getElementById("scrollUpVal").value;
    scrollDownValValue = scrollDownValValue ? parseFloat(scrollDownValValue, 10) : null;
    scrollUpValValue = scrollUpValValue ? parseFloat(scrollUpValValue, 10) : null;
    if (scrollDownValValue > scrollUpValValue) {
      startTimer(this);
      this.startScrolling();
    }
  }

  scrollToEnd() {
    if (this.startPage <= this.totalPage) {
      startTimer(this);
      this.lastPageScrolling();
    }
  }

  lastPageScrolling() {
    let me = this;
    me.lastPageScrollingFlag = true;
    let pageSize = parseFloat(document.getElementById("pageSize").value);
    me.gridTotalRecord = (me.startPage - 1) * parseFloat(pageSize) + 1;
    if (me.startPage <= me.totalPage) {
      me.gridOptions.api.ensureIndexVisible(me.gridTotalRecord - 1);
    } else {
      me.gridOptions.api.ensureIndexVisible(me.totalRecords);
      me.lastPageScrollingFlag = false;
      me.calcTimer(true);
    }
  }

  startScrolling() {
    let scrollDownVal = document.getElementById("scrollDownVal").value;
    let scrollUpVal = document.getElementById("scrollUpVal").value;
    let pageSize = parseFloat(document.getElementById("pageSize").value);
    scrollUpVal = parseFloat(scrollUpVal);
    scrollDownVal = parseFloat(scrollDownVal);
    this.startScrollingFlag = true;
    this.gridTotalRecord = (this.startPage - 1) * parseFloat(pageSize) + 1;
    if (this.startPage <= scrollDownVal) {
      this.gridOptions.api.ensureIndexVisible(this.gridTotalRecord - 1);
    } else if (this.startPage > scrollDownVal) {
      this.startScrollingFlag = false;
      // let up = (scrollDownVal - scrollUpVal) * parseFloat(pageSize);
      let upScroll = scrollUpVal * parseFloat(pageSize);
      this.calcTimer(false);
      this.gridOptions.api.ensureIndexVisible(upScroll + 1);
    }
  }

  calcTimer(isScrollEnd) {
    let me = this;
    let milliseconds = endTimer(me);
    let testName = isScrollEnd ? 'Scroll End' : me.testname;
    let testJSON = {
      product: me.product,
      testname: testName,
      milliseconds: milliseconds,
    };
    sendIt(me.product, testName, testJSON, milliseconds);
  }

  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
  }
}
customElements.define("z-aggrid-scroll", agGridScrollComponent);
