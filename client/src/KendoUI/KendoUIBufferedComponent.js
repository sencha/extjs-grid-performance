import { initialize, startTimer, endTimer, sendIt, createBufferView } from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class KendoUIBufferedComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "KendoUI";
    this.testname = "buffered";
    this.name = "KendoUI Grid Buffered Test"
    this.summary = `This test will display performance of the KendoUI Grid Buffered Renderer.`;
    this.isFirstTime = true;
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.gridToTest = null;
      this.parent.removeChild(document.getElementById("target"));
      this.isFirstTime = true;
    });
    this.starttest.addEventListener('click', (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
      }
    });

    createBufferView(this.parent);
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
          url: `${baseURL}api/rawData/getKendoUIData?tableName=${window.tableName}`
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

    startTimer(this);

    me.gridToTest = new kendo.ui.Grid(document.getElementById("target"),
      {
        dataSource: dataSource,
        height: 450,
        sortable: true,
        scrollable: {
          virtual: true,
          endless: true
        },
        pageable: {
          numeric: false,
          previousNext: false
        },
        dataBound: function(args) {
          if (me.isFirstTime) {
            var milliseconds = endTimer(me)
            var testJSON = {
              product: me.product,
              testname: me.testname,
              milliseconds: milliseconds,
              pageSize: parseInt(document.getElementById('pageSize').value, 10)
            }
            sendIt(me.product, me.testname, testJSON, milliseconds);

            me.isFirstTime = false;
          }
        },      
        columns:[{
          field: "id",
          title: "Id"
        },{
          field: "firstname",
          title: "First Name"
        }, {
          field: "lastname",
          title: "Last Name"
        }, {
            field: "address",
            title: "Address"
        }, {
            field: "company",
            title: "Company"
        }, {
            field: "title",
            title: "Title"
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
customElements.define("z-kendoui-buffered", KendoUIBufferedComponent);