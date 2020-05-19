import {
    initialize, startTimer, endTimer, sendIt,
    createScrollView
  } from '../util/ComponentHelper.js'
  
  import { baseURL } from '../util/config.js';
  
  class SyncFusionScrollComponent extends HTMLElement {
    connectedCallback() {
      this.formstate = 'hide';
      this.product = 'syncFusion';
      this.testname = 'scroll';
      this.name = 'SyncFusion Scroll Test'
      this.summary = ` This test will display performance of the sync Fusion Scrolling.`
      this.startIndex = 2;
      this.isScrolling = false;

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
        this.isScrolling = false;
        this.startIndex = 2;
      });
      this.starttest.addEventListener('click', (event) => {
        if (!this.gridToTest) {
          this.runGridTest();
        }
      });
      
      createScrollView(this.parent, this.startScrollingBtn.bind(this), this.startScrollingEnd.bind(this));
    }

    startScrollingBtn() {
        startTimer(this);
        this.startScrolling();
    }

    startScrolling() {
        let grid = $("#target").ejGrid("instance");
        let rowsCount = grid.getRows().length - 1;
        const pageSize = parseInt(document.getElementById("pageSize").value, 10);
        let totalTargetScrollDownPage = parseInt(document.getElementById("scrollDownVal").value,0);
        
        if (this.scrollEnd) {
            totalTargetScrollDownPage = window.tableSize/pageSize;
        }

        if (this.startIndex <= totalTargetScrollDownPage) {
            for (let pageCounter = this.startIndex; pageCounter <= totalTargetScrollDownPage; pageCounter++) {
                if (rowsCount < pageCounter * pageSize) {
                    grid.gotoPage(pageCounter);
                    this.isScrolling = true;
                    break;
                }
            }
        } else {
            let testName = this.testname;

            if (this.scrollEnd) {
                testName = 'Scroll End';
            } else {
                let totalTargetScrollUpPage = parseInt(document.getElementById("scrollUpVal").value,0);
                grid.getScrollObject().scrollY((grid.getRowHeight() * pageSize * totalTargetScrollUpPage), false);
            }

            this.isScrolling = false;
            const milliseconds = endTimer(this);
            const testJSON = {
              product: this.product,
              testname: testName,
              milliseconds: milliseconds,
            }
            sendIt(this.product, testName, testJSON, milliseconds)
        }
    }

    startScrollingEnd() {
        this.scrollEnd = true;
        startTimer(this);
        this.startScrolling();
    }
  
    runGridTest() {
      var container2 = document.createElement('div');
      container2.setAttribute('id', 'target');
      this.parent.append(container2);
      var me = this;

      startTimer(this);
      this.gridToTest = $("#target").ejGrid({
          dataSource: ej.DataManager({
            url: `${baseURL}api/rawData/getData?tableName=${window.tableName}`,
            crossDomain: true,
            adaptor: new ej.UrlAdaptor(),
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
            console.log(1);
            document.getElementById('startScrollBtn').style.display = 'inline';
            document.getElementById('scrollToEndBtn').style.display = 'inline';
            document.getElementById('scrollDownContainer').style.display = 'inline';
            document.getElementById('scrollUpContainer').style.display = 'inline';
            
          },
          actionComplete: function(args) {
            if (args.requestType === 'virtualscroll' && me.isScrolling) {
                me.startIndex++;
                me.isScrolling = false;
                var grid = $("#target").ejGrid("instance")
                grid.getScrollObject().scrollY((grid.getRowHeight() * args.endIndex), false);
                me.startScrolling();
            }
        }
      });
    }
  }
  customElements.define('sync-fusion-scroll', SyncFusionScrollComponent);