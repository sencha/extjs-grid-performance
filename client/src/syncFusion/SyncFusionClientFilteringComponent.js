import {
  initialize, startTimer, endTimer, sendIt,
  createFilterView
} from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class syncFusionClientFilteringComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = 'hide';
    this.product = 'syncFusion';
    this.testname = 'client filter';
    this.name = 'SyncFusion Client Side Filter Test'
    this.summary = ` This test will display performance of the sync Fusion Filtering.`
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      document.getElementById('startFilterBtn').style.display = 'none';
      document.getElementById('clearFilterBtn').style.display = 'none';
      document.getElementById('inputFilterVal').style.display = 'none';
      document.getElementById('filterValueLabel').style.display = 'none';
      this.parent.removeChild(document.getElementById("target"));
      this.gridToTest = null;
    });
    this.starttest.addEventListener('click', (event) => {
      if (!this.gridToTest) {
        this.runGridTest();
      }
    });
    
    createFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }
  
  startFiltering() {
    this.isStarted = true;
    startTimer(this);
    var gridObj = $("#target").ejGrid("instance");
    gridObj.filterColumn([{ field: 'firstname', operator: 'contains', value: document.getElementById('inputFilterVal').value }]);
  }
  
  clearFiltering() {
    this.isStarted = false;
    $("#target").ejGrid("instance").clearFiltering();
    document.getElementById('inputFilterVal').value = '';
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
    
    var dataManager = new ej.DataManager({
      url: `${baseURL}api/rawData/getAllData?tableName=${window.tableName}`,
      crossDomain: true
    });
    
    var query = new ej.Query();
    var promise = dataManager.executeQuery(query);
    promise.then(function (e) {
      me.gridToTest = $("#target").ejGrid({
        dataSource: e.result.users,
        height: 315,
        allowFiltering: true,
        columns: [
          { field: 'id', width: 40, headerText: 'Index', type: 'Number' },
          { field: 'firstname', width: 80, headerText: 'First Name', type: 'string' },
          { field: 'lastname', width: 80, headerText: 'Last Name', type: 'string' },
          { field: 'address', width: 140, headerText: 'Address', type: 'string' },
          { field: 'title', width: 60, headerText: 'Title', type: 'string' },
          { field: 'company', width: 120, headerText: 'Company', type: 'string' },
        ],
        create: function () { 
          document.getElementById('startFilterBtn').style.display = 'inline-block';
          document.getElementById('clearFilterBtn').style.display = 'inline-block';
          document.getElementById('inputFilterVal').style.display = 'inline-block';
          document.getElementById('filterValueLabel').style.display = 'inline-block';
         },
        actionComplete: function(args) {
          if (args.requestType === 'filtering' && me.isStarted)  {
            var milliseconds = endTimer(me)
            var testJSON = {
              product: me.product,
              testname: me.testname,
              milliseconds: milliseconds,
            }
            sendIt(me.product, me.testname, testJSON, milliseconds)
            me.isStarted = false;
          }
        }
      });
    });
  }
  
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    
    this.gridToTest = null;
  }
}
customElements.define('sync-fusion-client-filtering', syncFusionClientFilteringComponent);