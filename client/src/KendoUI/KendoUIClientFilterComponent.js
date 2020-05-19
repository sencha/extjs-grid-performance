import {
  initialize, startTimer, endTimer, sendIt,
  createFilterView,
} from '../util/ComponentHelper.js';

import { baseURL } from '../util/config.js';

class KendoUIClientFilterComponent extends HTMLElement {

  connectedCallback() {
    this.formstate = "hide";
    this.product = "KendoUI";
    this.testname = "client filter";
    this.name = "KendoUI Grid Client Filter Test"
    this.summary = `
    This test will display performance of the KendoUI Grid Client Filter Renderer.
        `
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      // this.gridToTest.destroy();
      // this.gridToTest.dispose();
      this.parent.removeChild(document.getElementById("target"));
      document.getElementById('startFilterBtn').style.display = 'none';
      document.getElementById('clearFilterBtn').style.display = 'none';
      document.getElementById('inputFilterVal').style.display = 'none';
      document.getElementById('filterValueLabel').style.display = 'none';
      this.gridToTest = null;
    });
    this.starttest.addEventListener('click', (event) => {
      if (this.gridToTest == null) {
        this.runGridTest();
      }
    });

    createFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }

  startFiltering() {
    this.isStarted = true;
    startTimer(this);
    this.gridToTest.dataSource.filter({
      field: "firstname",
      operator: "eq",
      value: document.getElementById('inputFilterVal').value
    });
    var milliseconds = endTimer(this)
    var testJSON = {
      product: this.product,
      testname: this.testname,
      milliseconds: milliseconds,
    }
    sendIt(this.product, this.testname, testJSON, milliseconds)
    // this.gridToTest.filterSettings = {columns: [{ field: 'firstName', operator: 'equal', value: 'Asher' }]};
  }
  
  clearFiltering() {
    this.isStarted = false;
    this.gridToTest.dataSource.filter({});
    document.getElementById('inputFilterVal').value = '';
    // this.gridToTest.clearFiltering();
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
      transport: {
        read: {
          url: `${baseURL}api/rawData/getAllData?tableName=${window.tableName}`,
          dataType: "json",
          crossDomain: true,
        }
      },
      schema: {
          data: "users"
      }
    });

    me.gridToTest = new kendo.ui.Grid(document.getElementById("target"),
      {
        dataSource: dataSource,
        height: 550,
        sortable: true,
        filterable: false,
        dataBound: function(e) {
          document.getElementById('startFilterBtn').style.display = 'inline-block';
          document.getElementById('clearFilterBtn').style.display = 'inline-block';
          document.getElementById('inputFilterVal').style.display = 'inline-block';
          document.getElementById('filterValueLabel').style.display = 'inline-block';
        },
        // filterMenuInit: initializedFilterMenu,
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
customElements.define("z-kendoui-client-filter", KendoUIClientFilterComponent);
