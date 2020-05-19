import {
  initialize, startTimer, endTimer, sendIt,
  createBufferView
} from '../util/ComponentHelper.js'

import { baseURL } from '../util/config.js';

class SyncFusionBufferComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = 'hide';
    this.product = 'syncFusion';
    this.testname = 'buffered';
    this.name = 'SyncFusion Buffer Test'
    this.summary = ` This test will display performance of the sync Fusion Filtering.`
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.parent.removeChild(document.getElementById("target"));
      this.gridToTest = null;
      document.getElementById("pageSize").value = 200;
    });
    this.starttest.addEventListener('click', (event) => {
      if (!this.gridToTest) {
        this.runGridTest();
      }
    });
    
    createBufferView(this.parent);
  }

  runGridTest() {
    var container2 = document.createElement('div');
    container2.setAttribute('id', 'target');
    this.parent.append(container2);

    var me = this;
    
    if (me.gridToTest) {
      var totalCount = JSON.parse(JSON.stringify(me.parent.childElementCount));
      for (var index = totalCount-1; index > 1; index-- ) {
        me.parent.removeChild(me.parent.childNodes[index]);
      }
      
      me.gridToTest = null;
    }

    startTimer(this);
    this.gridToTest = $("#target").ejGrid({
        dataSource: ej.DataManager({
          url: `${baseURL}api/rawData/getData?tableName=${window.tableName}`,
          crossDomain: true,
          adaptor: new ej.UrlAdaptor(),
          enableCaching: true,
          cachingPageSize: 200,
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
          var milliseconds = endTimer(me)
          var testJSON = {
            product: me.product,
            testname: me.testname,
            milliseconds: milliseconds,
            pageSize: document.getElementById("pageSize").value,
          }
          sendIt(me.product, me.testname, testJSON, milliseconds)
        }
    });
  }
}
customElements.define('sync-fusion-buffer', SyncFusionBufferComponent);