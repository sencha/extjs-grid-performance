import {
  startTimer, endTimer, sendIt, initialize,
  createBufferView
} from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class WebixBufferedComponent extends HTMLElement {
  connectedCallback() {
    let gridToTest = null;
    this.formstate = "hide";
    this.product = "webix";
    this.testname = "buffered";
    this.name = "Webix Buffer Test"
    this.summary = `This test will display performance of the Webix Buffer Renderering.`;
    this.isInitial = true;
    this.callCount = 0;
    this.callCountCheck = 1;
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

    createBufferView(this.parent);
    this.parent.append(document.createElement('br'));
    const container1 = document.createElement('span');
    const filterRowInput = document.createElement('INPUT');
    filterRowInput.setAttribute('type', 'number');
    filterRowInput.setAttribute('id', 'loadAhead');
    filterRowInput.setAttribute('min', 1);
    filterRowInput.setAttribute('max', 1000);
    filterRowInput.setAttribute('value', 20);
    filterRowInput.setAttribute('style', 'width: 150px');
    const filterRowLabel = document.createElement('label');
    filterRowLabel.innerHTML = 'Load Ahead Size:&nbsp;'
    container1.append(filterRowLabel);
    container1.append(filterRowInput);  
    this.parent.append(container1);
  }

  runGridTest() {
    const container2 = document.createElement('div');
    container2.setAttribute('id', 'target');
    this.parent.append(container2);

    if (document.getElementById("loadAhead").value) {
      this.callCountCheck = 2;
    }

    if (this.gridToTest == null) {
      let me = this;
      if (this.isInitial) {
        startTimer(this);
      }

      this.gridToTest = new webix.ui({
        container: document.getElementById("target"),
        view: "datatable",
        columns: [
            { id: 'id', header: 'Id', width: 120 },
            { id: 'firstname', header: 'First Name', width: 80 },
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
      this.gridToTest.resize();

      this.gridToTest.attachEvent("onAfterLoad", this.afterLoad.bind(this));
    }
  }

  afterLoad() {
    this.callCount ++;
    if (this.isInitial && this.callCount === this.callCountCheck) {
      const milliseconds = endTimer(this)
      const testJSON = {
        product: this.product,
        testname: this.testname,
        milliseconds: milliseconds,
        pageSize: document.getElementById("pageSize").value,
      }
      sendIt(this.product, this.testname, testJSON, milliseconds);
      this.isInitial = false
    }
  }
  
  disconnectedCallback() {
      this.gridToTest = null;
  }
}
customElements.define("z-webix-buffered", WebixBufferedComponent);