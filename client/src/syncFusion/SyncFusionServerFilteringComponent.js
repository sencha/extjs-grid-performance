import {
  initialize, startTimer, endTimer, sendIt,
  createServerSideFilterView
} from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class syncFusionServerFilteringComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = 'hide';
    this.product = 'syncFusion';
    this.testname = 'server filter';
    this.name = 'SyncFusion Server Side Filter Test'
    this.summary = ` This test will display performance of the sync Fusion Filtering.`
    initialize(this);
    
    this.cleartest.addEventListener('click', (event) => {
      var totalCount = JSON.parse(JSON.stringify(this.parent.childElementCount));
      document.getElementById('startFilterBtn').style.display = 'none';
      document.getElementById('clearFilterBtn').style.display = 'none';
      document.getElementById('inputFilterVal').style.display='none';
      document.getElementById('filterValueLabel').style.display='none';
      this.parent.removeChild(document.getElementById("target"));
      this.gridToTest = null;
      document.getElementById('pageSize').value = 20;
      document.getElementById('inputFilterVal').value = '';
    });

    this.starttest.addEventListener('click', (event) => {
      if (!this.gridToTest) {
        this.runGridTest();
      }
    });
    
    createServerSideFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }
  
  startFiltering() {
    var gridObj = $("#target").ejGrid("instance");
    this.isStarted = true;
    startTimer(this);
    gridObj.filterColumn([{ field: 'firstname', operator: 'contains', value: document.getElementById('inputFilterVal').value }]);
  }
  
  clearFiltering() {
    this.isStarted = false;
    $("#target").ejGrid("instance").clearFiltering();
    document.getElementById('inputFilterVal').value = '';
  }

  runGridTest() {
    var container2 = document.createElement('div');
    container2.setAttribute('id', 'target');
    this.parent.append(container2);
    var me = this;

    me.gridToTest = $("#target").ejGrid({
      dataSource: ej.DataManager({
        url: `${baseURL}api/rawData/getData?tableName=${window.tableName}`,
        crossDomain: true,
        adaptor: new ej.UrlAdaptor(),
        enableCaching: true,
        cachingPageSize: parseInt(document.getElementById("pageSize").value, 10),
        timeTillExpiration: 120000,
      }),
      allowScrolling: true,
      allowVirtualScrolling: true,
      allowResizeToFit: true,
      filterSettings: {
          filterType: "menu"
      },
      allowFiltering: true,
      scrollSettings: { width: "auto", height: 300, allowVirtualScrolling: true, virtualScrollMode: ej.Grid.VirtualScrollMode.Continuous },
      pageSettings: { enableQueryString: true, pageSize: parseInt(document.getElementById("pageSize").value, 10) },
      columns: [
          { field: 'id', width: 40, headerText: 'Index', type: 'Number' },
          { field: 'firstname', width: 80, headerText: 'First Name', type: 'string' },
          { field: 'lastname', width: 80, headerText: 'Last Name', type: 'string' },
          { field: 'address', width: 140, headerText: 'Address', type: 'string' },
          { field: 'title', width: 60, headerText: 'Title', type: 'string' },
          { field: 'company', width: 120, headerText: 'Company', type: 'string' },
      ],
      dataBound: function (args) {
        document.getElementById('startFilterBtn').style.display = 'inline-block';
        document.getElementById('clearFilterBtn').style.display = 'inline-block';
        document.getElementById('inputFilterVal').style.display = 'inline-block';
        document.getElementById('filterValueLabel').style.display = 'inline-block';
      },
      actionComplete: function (args) {
        if (args.requestType === 'filtering' && me.isStarted) {
          var milliseconds = endTimer(me)
          var testJSON = {
            product: me.product,
            testname: me.testname,
            milliseconds: milliseconds,
            pageSize: parseInt(document.getElementById("pageSize").value, 10),
          }
          sendIt(me.product, me.testname, testJSON, milliseconds);
          me.isStarted = false;
        }
      },
    });
  }
  
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy()
    }
    
    this.gridToTest = null;
  }
}

customElements.define('sync-fusion-server-filtering', syncFusionServerFilteringComponent);