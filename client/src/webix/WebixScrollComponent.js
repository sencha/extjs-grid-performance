import {
    startTimer, endTimer, sendIt, initialize,
    createScrollView
  } from '../util/ComponentHelper.js';
  import { baseURL } from '../util/config.js';
  
  class WebixScrollComponent extends HTMLElement {
    connectedCallback() {
      let gridToTest = null;
      this.formstate = "hide";
      this.product = "webix";
      this.totalHeight = 0;
      this.testname = "scroll";
      this.name = "Webix scroll Test"
      this.summary = `This test will display performance of the Webix scroll Renderering.`;
      this.callCount = 0;
      this.callCountCheck = 1;
      this.scrollDownStart = false;
      this.scrollToEnd = false;
      this.scrollUpStart = false;

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
        this.callCount = 0;
        this.callCountCheck = 1;
        this.scrollDownStart = false;
        this.scrollToEnd = false;
        this.scrollUpStart = false;
        document.getElementById('scrollDownContainer').style.display = 'none';
        document.getElementById('scrollUpContainer').style.display = 'none';
        document.getElementById('scrollToEndBtn').style.display = 'none';
        document.getElementById('startScrollBtn').style.display = 'none';
      });
      this.starttest.addEventListener('click', (event) => {
        if (!this.gridToTest) {
          this.runGridTest()
        }
      });

      createScrollView(this.parent,this.startScrollDown.bind(this), this.scrollToEndHandle.bind(this));
      this.parent.append(document.createElement('br'));
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
  
    startScrollDown() {
      const rowHeight = this.gridToTest.config.rowHeight;
      const state = this.gridToTest.getScrollState();
      const pageSize = parseInt(document.getElementById("pageSize").value, 10);
      const pageDownVal = parseInt(document.getElementById("scrollDownVal").value, 10);
      var height = rowHeight * pageSize * pageDownVal;
      this.totalHeight = height;
      this.scrollDownStart = true;
      this.callCount = 0;
      
      if (document.getElementById("loadAhead").value) {
        this.callCountCheck = 2;
      } else {
        this.callCountCheck = 1;
      }

      startTimer(this);
      this.gridToTest.scrollTo(state.x, height);
    }

    startScrollUp() {
      const rowHeight = this.gridToTest.config.rowHeight;
      const state = this.gridToTest.getScrollState();
      const pageSize = parseInt(document.getElementById("pageSize").value, 10);
      const pageUpVal = parseInt(document.getElementById("scrollUpVal").value, 10);
      var height = rowHeight * pageSize * pageUpVal;
      this.totalHeight = height;
      this.scrollUpStart = true;
      this.callCount = 0;
      if (document.getElementById("loadAhead").value) {
        this.callCountCheck = 2;
      } else {
        this.callCountCheck = 1;
      }
      this.gridToTest.scrollTo(state.x, height);
    }

    scrollToEndHandle() {
      this.scrollToEnd = true;
      const rowHeight = this.gridToTest.config.rowHeight;
      const state = this.gridToTest.getScrollState();
      var height = rowHeight * this.gridToTest.count();
      this.totalHeight = height;
      this.callCount = 0;
      if (document.getElementById("loadAhead").value) {
        this.callCountCheck = 2;
      } else {
        this.callCountCheck = 1;
      }
      startTimer(this);
      this.gridToTest.scrollTo(state.x, height);
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
              { id: 'firstname', header: 'First Name', width: 80 },
              { id: 'lastname', header: 'Last Name', width: 80 },
              { id: 'address', header: 'Address', width: 130 },
              { id: 'company', header: 'Company', width: 120 },
              { id: 'title', header: 'Title', width: 120 }
          ],
          scroll: true,
          scrollAlignY:false,
          datafetch: parseInt(document.getElementById("pageSize").value, 10),//default
          loadahead: parseInt(document.getElementById("loadAhead").value, 10),
          url:`${baseURL}api/rawData/getNewWebixGridBufferedData?tableName=${window.tableName}`,
          height: 400,
          width: 660,
        });
        this.gridToTest.resize();
        document.getElementById('scrollDownContainer').style.display = 'inline';
        document.getElementById('scrollUpContainer').style.display = 'inline';
        document.getElementById('scrollToEndBtn').style.display = 'inline';
        document.getElementById('startScrollBtn').style.display = 'inline';
        this.gridToTest.attachEvent("onAfterLoad", this.afterLoad.bind(this));
      }
    }
  
    afterLoad() {
      if (this.scrollToEnd) {
        this.callCount++;

        if (this.callCount === 1) {
          let milliseconds = endTimer(this);
          let testJSON = {
            product: this.product,
            testname: 'Scroll End',
            milliseconds: milliseconds,
          };
          sendIt(this.product, 'Scroll End', testJSON, milliseconds);
          this.scrollToEnd = false;
          this.callCount = 0;
        }
      }

      if (this.scrollDownStart) {
        this.callCount++;

        if (this.callCount === this.callCountCheck) {
          this.scrollDownStart = false;
          this.startScrollUp();
        }
      }

      if (this.scrollUpStart) {
        this.callCount++;

        if (this.callCount === this.callCountCheck) {
          let milliseconds = endTimer(this);
          let testJSON = {
            product: this.product,
            testname: this.testname,
            milliseconds: milliseconds,
          };
          sendIt(this.product, this.testname, testJSON, milliseconds);
          this.scrollUpStart = false;
          this.callCount = 0;
        }
      }
    }
    
    disconnectedCallback() {
        this.gridToTest = null;
    }
  }
  customElements.define("z-webix-scroll", WebixScrollComponent);