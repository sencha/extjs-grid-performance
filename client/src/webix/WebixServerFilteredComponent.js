import {
  startTimer, endTimer, sendIt, initialize,
  createServerSideFilterView
} from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class WebixServerFilterComponent extends HTMLElement {
  connectedCallback() {
    let gridToTest = null;
    this.formstate = "hide";
    this.product = "webix";
    this.testname = "server filter";
    this.name = "Webix Server Filter Test"
    this.summary = `This test will display performance of the Webix Server Filter Renderering.`;
    this.isInitial = true;

    initialize(this);

    this.cleartest.addEventListener('click', (event) => {
      if (document.getElementById("target")) {
        this.parent.removeChild(document.getElementById("target"));
      }
      if (this.gridToTest) {
        this.gridToTest.destructor();
      }
      this.gridToTest = null;
      document.getElementById("pageSize").value = 20;
      document.getElementById("loadAhead").value = 20;
      this.isInitial = true;
    });
    
    this.starttest.addEventListener('click', (event) => {
      if (!this.gridToTest) {
        this.runGridTest()
      }
    });
    
    createServerSideFilterView(this.parent);
    var container1 = document.createElement('span');
    var filterRowInput = document.createElement('INPUT');
    filterRowInput.setAttribute('type', 'number');
    filterRowInput.setAttribute('id', 'loadAhead');
    filterRowInput.setAttribute('min', 1);
    filterRowInput.setAttribute('max', 1000);
    filterRowInput.setAttribute('value', 20);
    filterRowInput.setAttribute('style', 'width: 150px');
    var filterRowLabel = document.createElement('label');
    filterRowLabel.innerHTML = 'Load Ahead Size:&nbsp;'
    container1.append(filterRowLabel);
    container1.append(filterRowInput);  
    this.parent.append(container1);
  }

  runGridTest() {
    const container2 = document.createElement('div');
    container2.setAttribute('id', 'target');
    this.parent.append(container2);

    if (this.gridToTest == null) {
      let me = this;

      this.gridToTest = new webix.ui({
        container: document.getElementById("target"),
        view: "datatable",
        columns: [
            { id: 'id', header: 'Id', width: 120 },
            { id: 'firstname', header: ['First Name', { content:"serverFilter" } ], width: 80 },
            { id: 'lastname', header: 'Last Name', width: 80 },
            { id: 'address', header: 'Address', width: 130 },
            { id: 'company', header: 'Company', width: 120 },
            { id: 'title', header: 'Title', width: 120 }
        ],
        scroll: true,
        scrollAlignY:false,
        datafetch: parseInt(document.getElementById("pageSize").value, 10),
        loadahead: parseInt(document.getElementById("loadAhead").value, 10),
        url:`${baseURL}api/rawData/getNewWebixGridBufferedData?tableName=${window.tableName}`,
        height: 400,
        width: 660,
      });

      this.gridToTest.attachEvent("onBeforeFilter", this.onBeforeFilter.bind(this));
      this.gridToTest.attachEvent("onAfterFilter", this.afterFilter.bind(this));
      this.gridToTest.resize();
    }
  }

  onBeforeFilter() {
    startTimer(this);
  }

  afterFilter() {
    if (document.getElementsByClassName("webix_ss_filter")[0].children[0].value) {
      const milliseconds = endTimer(this)
      const testJSON = {
          product: this.product,
          testname: this.testname,
          milliseconds: milliseconds,
      }
      sendIt(this.product, this.testname, testJSON, milliseconds);
      this.isOnFilterClick = false;
    }
  }

  disconnectedCallback() {
      this.gridToTest = null;
  }
}
customElements.define("z-webix-server-filter", WebixServerFilterComponent);