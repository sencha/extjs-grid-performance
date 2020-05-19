import {
  initialize, startTimer, endTimer, sendIt,
  createFilterView
  } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class DevExtremeClientFilterComponent extends HTMLElement {

  connectedCallback() {
    this.formstate = "hide";
    this.product = "DevExtreme";
    this.testname = "client filter";
    this.name = "DevExtreme DataGrid Client Filter Test"
    this.summary = `
    This test will display performance of the DevExtreme DataGrid Client Filter Renderer.
        `
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      // this.gridToTest.destroy()
      this.gridToTest.dispose();
      document.getElementById('startFilterBtn').style.display = 'none';
      document.getElementById('clearFilterBtn').style.display = 'none';
      inputFilterVal.setAttribute('style', 'width: 150px; display: none ');
      filterValueLabel.setAttribute('style', 'width: 200px; display: none ');
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
    startTimer(this);
    this.gridToTest.filter(['firstname', '=', document.getElementById('inputFilterVal').value]);
    this.isStartFilter = true;
  }
  
  clearFiltering() {
    this.isStarted = false;
    this.isStartFilter = false;
    document.getElementById('inputFilterVal').value = '';
    this.gridToTest.clearFilter();
  }

  runGridTest() {
    var container3 = document.createElement('div');
    container3.setAttribute('id', 'target');
    this.parent.append(container3);

    var me = this;

    let url = `${baseURL}api/rawData/getAllData?tableName=${window.tableName}`;
    let gridDataSource = new DevExpress.data.DataSource({
      load: function (loadOptions) {
          let d = $.Deferred();
          $.getJSON(url)
            .done(function (result) {
                  d.resolve(result.users, { 
                      totalCount: result.users.length,
                  });
              });
          return d.promise();
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
      height: "400px",
      filterRow: {
        visible: false,
        applyFilter: "auto"
      },
      paging: false,
      onContentReady: function() {
        if (me.isStartFilter) {
          var milliseconds = endTimer(me)
          var testJSON = {
            product: me.product,
            testname: me.testname,
            milliseconds: milliseconds,
          }
      
          sendIt(me.product, me.testname, testJSON, milliseconds)
        }
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
      }]
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
customElements.define("z-devextreme-client-filter", DevExtremeClientFilterComponent);