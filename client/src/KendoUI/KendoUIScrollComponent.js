import { initialize, startTimer, endTimer, sendIt, createScrollView } from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class KendoUIScrollComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "KendoUI";
    this.testname = "scroll";
    this.name = "KendoUI Grid Scroll Test";
    this.isInitialCall = true;
    this.isScrollWorking = false;
    this.startIndex = 1;
    this.summary = `This test will display performance of the KendoUI Grid Scroll Renderer.`
    this.isScrollToEnd = false;
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.parent.removeChild(document.getElementById("target"));
      this.gridToTest = null;

      document.getElementById('startScrollBtn').style.display = 'none';
      document.getElementById('scrollToEndBtn').style.display = 'none';
      document.getElementById('scrollDownContainer').style.display = 'none';
      document.getElementById('scrollUpContainer').style.display = 'none';
      document.getElementById('pageSize').value = 20;
      document.getElementById('scrollDownVal').value = 1;
      document.getElementById('scrollUpVal').value = 1;
      this.isScrollWorking = false;
      this.isScrollToEnd = false;
    });
    this.starttest.addEventListener('click', (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
      }
    });
    
    createScrollView(this.parent, this.startScrolling.bind(this), this.scrollToEnd.bind(this))
  }

  startScrolling() {
    startTimer(this);
    this.startScrollingDown();
  }

  scrollToEnd() {
    this.isScrollToEnd = true;
    this.startScrollingDown();
  }

  startScrollingDown() {
    const rowHeight = this.gridToTest.table.find("tr").height();
    const pageSize = parseInt(document.getElementById("pageSize").value,0);

    let totalTargetScrollDownPage = parseInt(document.getElementById("scrollDownVal").value,0);

    if (this.isScrollToEnd) {
      totalTargetScrollDownPage = window.tableSize/pageSize;
    }

    const totalTargetScrollUpPage = parseInt(document.getElementById("scrollUpVal").value,0);
    const currentHeightOfTBody = this.gridToTest.table.find("tbody").height();

    for (let pageCounter = this.startIndex; pageCounter <= totalTargetScrollDownPage; pageCounter++) {
      const scrollHeightTarget = pageCounter * rowHeight * pageSize;
      if (currentHeightOfTBody >= scrollHeightTarget) {
        document.getElementsByClassName("k-grid-content")[0].scroll(0,scrollHeightTarget);
        this.startIndex++;
      } else {
        this.isScrollWorking = true;
        document.getElementsByClassName("k-grid-content")[0].scroll(0,scrollHeightTarget);
        break;
      }
    }

    if (this.startIndex > totalTargetScrollDownPage || (this.isScrollToEnd && this.startIndex === totalTargetScrollDownPage)) {
      let testName = this.testname;

      if(!this.isScrollToEnd) {
        const scrollHeightTarget = totalTargetScrollUpPage * rowHeight * pageSize;
        document.getElementsByClassName("k-grid-content")[0].scroll(0, scrollHeightTarget);
      } else {
        this.isScrollToEnd = false;
        testName = "Scroll End"
      }

      var milliseconds = endTimer(this)
        var testJSON = {
          product: this.product,
          testname: testName,
          milliseconds: milliseconds,
          pageDown: totalTargetScrollDownPage,
          pageUp: totalTargetScrollUpPage,
          pageSize: pageSize
        }
      sendIt(this.product, testName, testJSON, milliseconds);
      this.isScrollWorking = false;
    }
  }

  runGridTest() {
    var container3 = document.createElement('div');
    container3.setAttribute('id', 'target');
    this.parent.append(container3);

    var me = this;
    if (me.gridToTest) {
      var totalCount = JSON.parse(JSON.stringify(me.parent.childElementCount));
      for (var index = totalCount-1; index > 1; index-- ) {
        me.parent.removeChild(me.parent.childNodes[index]);
      }
      me.gridToTest = null;
    }
    var dataSource = new kendo.data.DataSource({
      serverPaging: true,
      serverSorting: true,
      transport: {
        read: {
          url: `${baseURL}api/rawData/getKendoUIData?tableName=${window.tableName}`,
        }
      },
      pageSize: parseInt(document.getElementById('pageSize').value, 10),
      schema: {
        data: function (response) {
          return response.users ? response.users: response;
        },
        total: function (response) {
            return response.totalCount ? response.totalCount: response;
        },
      },
    });
    me.gridToTest = new kendo.ui.Grid(document.getElementById("target"),
      {
        dataSource: dataSource,
        dataBound: function(e) {
          document.getElementById('startScrollBtn').style.display = 'inline';
          document.getElementById('scrollToEndBtn').style.display = 'inline';
          document.getElementById('scrollDownContainer').style.display = 'inline';
          document.getElementById('scrollUpContainer').style.display = 'inline';

          if (!me.isInitialCall && me.isScrollWorking) {
            me.startIndex++;
            me.startScrollingDown();
          }

          if (me.isInitialCall) {
            me.isInitialCall = false;
          }
        },
        height: 450,
        sortable: true,
        scrollable: {
          virtual: false,
          endless: true
        },
        pageable: {
          numeric: false,
          previousNext: false
        }, 
        columns:[{
          field: "id",
          title: "Id",
          width: 50,
        },{
          field: "firstname",
          title: "First Name",
          width: 80,
        }, {
          field: "lastname",
          title: "Last Name",
          width: 80,
        }, {
            field: "address",
            title: "Address"
        }, {
            field: "company",
            title: "Company"
        }, {
            field: "title",
            title: "Title",
            width: 90,
        }]
      }
    );
  }
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    
    this.gridToTest = null;
  }
}
customElements.define("z-kendoui-scroll", KendoUIScrollComponent);