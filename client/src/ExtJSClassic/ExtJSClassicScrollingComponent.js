/**
 * Grid Scroll check: In this, the Grid will be performing
 * both client and server-side buffering(already done in an example) will be done,
 * along with that user will be provided with two textboxes extra of down scroll number (x) and
 * up scroll number (y). On click of the start test, the user will be scrolled down to x number of pages
 * and then scrolled up to y number of pages and then the time should be evaluated it took for
 * the complete cycle. Scroll up will only start after scroll down when the complete data is loaded.
 */

import { initialize, startTimer, endTimer, sendIt } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class ExtJSClassicScrollingComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "show";
    this.product = "extjsclassic";
    this.testName = "scroll";
    this.name = "Ext JS Classic Buffered Grid Scrolling Test";
    this.summary = "Scrolling down & up in ExtJS of Classic Toolkit.<br/>You can set different values for:";

    initialize(this);

    this.cleartest.addEventListener('click', (event) => {
      this.clearGridRefs();
    });

    this.starttest.addEventListener('click', (event) => {
      this.runGridTest()
    });
  }

  runGridTest() {
    var me = this;

    if (!Ext.isEmpty(me.gridToTest)) {
      return;
    }

    Ext.define(`${me.testname}-store`, {
      extend: 'Ext.data.BufferedStore',
      alias: `store.${me.testname}-store`,
      fields: ['firstname', 'lastname', 'address', 'company', 'title',{name: 'id',type: 'int'}],
      pageSize: parseInt(me.pageSize.value, 10),
      leadingBufferZone: parseInt(me.leadingBufferZone.value, 10),
      trailingBufferZone: parseInt(me.trailingBufferZone.value, 10),
      remoteFilter: true,
      proxy: {
        type: 'ajax',
        url: `${baseURL}api/rawData/getPageData?tableName=${window.tableName}`,
        reader: {
          rootProperty: 'users',
          totalProperty: 'totalCount'
        }
      }
    });

    Ext.define(`${me.testName}-grid`, {
      extend: 'Ext.grid.Panel',
      xtype: `${me.testName}`,
      height: 430,
      width: 550,
      scrollable: true,
      emptyText: 'No data available',
      style: 'background: #fff;',
      store: { type: `${me.testname}-store` },
      columns: [{
        text: 'Id',
        dataIndex: 'id',
        width: 70
      },{
        text: 'First Name',
        dataIndex: 'firstname'
      }, {
        text: 'Last Name',
        dataIndex: 'lastname'
      }, {
        text: 'Title',
        dataIndex: 'title'
      }, {
        text: 'Address',
        dataIndex: 'address'
      }, {
        text: 'Company',
        dataIndex: 'company'
      }],
      viewConfig: {
        listeners: {
          itemadd: 'onRecordsAdded'
        }
      },
      listeners: {
        afterrender: 'onGridAfterRender'
      },
      dockedItems: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
          xtype: 'button',
          text: 'Scroll to End',
          handler: 'onScrollToEndBtnClick'
        }, '-', {
          xtype: 'numberfield',
          reference: 'pageDownField',
          labelWidth: 80,
          hideTrigger: true,
          width: 140,
          fieldLabel: 'Page Down',
          minValue: 0,
          bind: {
            value: '{pageDown}',
            maxValue: '{totalPages}'
          }
        }, {
          xtype: 'numberfield',
          reference: 'pageUpField',
          labelWidth: 80,
          hideTrigger: true,
          width: 140,
          fieldLabel: 'Page Up',
          minValue: 0,
          bind: {
            value: '{pageUp}',
            maxValue: '{totalPages}'
          }
        }, {
          xtype: 'button',
          text: 'Start Test',
          handler: 'onStartTestBtnClick'
        }]
      }],
      viewModel: {
        data: {
          totalPages: '...',
          pageDown: 10,
          pageUp: 5,
        }
      },
      controller: {
        timeStarted: false,
        itemsAdded: false,
        scrollEnded: false,
        iteration: null, // pageDown/pageUp

        init: function() {
          var store = this.getView().getStore(),
            viewModel = this.getViewModel();

          store.load({
            callback: () => {
              viewModel.set('totalPages', Math.ceil(store.getTotalCount() / store.getPageSize()));
            }
          })
        },

        onScrollToEndBtnClick: function() {
          var lastPage = this.getViewModel().get('totalPages'),
            newScrollTop = this.getNewScrollTop(lastPage);

          this.startTimer();
          this.iteration = 'pageUp';
          this.itemsAdded = false;
          this.scrollEnded = false;
          this.scrollToEndFunctionality = true;
          this.getScrollable().scrollTo(0, newScrollTop);
        },

        getScrollable: function () {
          return this.getView().getScrollable();
        },
        getCurrentScrollTop: function () {
          return this.getScrollable().position.y;
        },
        // tentative scroll position
        getNewScrollTop: function (pageNo) {
          var view = this.getView(),
            viewModel = this.getViewModel(),
            pageSize = view.getStore().getPageSize();

          pageNo = pageNo || viewModel.get(this.iteration) || 0;

          // scrollTop should be totalRecords * rowHeight from buffered renderer
          return pageNo * pageSize * view.plugins[0].rowHeight;
        },
        startTimer: function () {
          this.timeStarted = true;

          // start the timer
          startTimer(me);
        },
        endTimer: function () {
          if (this.timeStarted) {
            this.timeStarted = false;

            // end the timer
            let testName = me.testName;

            if (this.scrollToEndFunctionality) {
              testName = 'Scroll End';
              this.scrollToEndFunctionality = false;
            }

            var milliseconds = endTimer(me),
              testJson = {
                product: me.product,
                testName: testName,
                totalCount: this.getView().getStore().getTotalCount(),
                milliseconds: milliseconds,
              };

            sendIt(me.product, testName, testJson, milliseconds);
          }
        },
        onGridAfterRender: function () {
          this.getScrollable().on('scrollend', this.onScrollEnded, this);
        },
        onScrollEnded: function (params) {
          if (this.timeStarted) {
            this.scrollEnded = true;

            this.checkForNextIteration();
          }
        },
        checkForNextIteration: function () {
          if (this.timeStarted && this.scrollEnded == this.itemsAdded) {
            if (this.iteration == 'pageDown') {
              // start second iteration
              this.iteration = 'pageUp';

              // waiting for some time to render the rows, then loading new page
              Ext.defer(this.loadPage, 10, this);
            } else {
              // exit the cycle
              this.endTimer();
            }
          }
        },
        onRecordsAdded: function () {
          if (this.timeStarted) {
            this.itemsAdded = true;

            this.checkForNextIteration();
          }
        },
        loadPage: function () {
          var currentScrollTop = this.getCurrentScrollTop(),
            newScrollTop = this.getNewScrollTop();

          this.itemsAdded = false;
          this.scrollEnded = false;

          // nothing to do
          if (currentScrollTop === newScrollTop) {
            this.checkForNextIteration();
          } else {
            // setting the scroll top
            this.getScrollable().scrollTo(0, newScrollTop).then(() => {
              // calling this function as quickFix of buffered renderer bug
              // sometimes its not rendering the row
              // to fix that problem we are touching the scroll little bit
              // that will complete the cycle of scrolling
              this.iteration == 'pageUp' && this.adjustViewScrolling(newScrollTop);
            });
          }
        },
        onStartTestBtnClick: function () {
          var pageDownField = this.lookupReference('pageDownField'),
            pageUpField = this.lookupReference('pageUpField');

          if (pageDownField.isValid() && pageUpField.isValid()) {
            this.iteration = 'pageDown';

            this.startTimer();
            this.loadPage();
          } else {
            Ext.toast('Please enter the pages numbers in range');
          }
        },
        adjustViewScrolling: function (newScrollTop) {
          var view = this.getView().getView();
  
          Ext.defer(function (scrolltop) {
              var el = this.getEl();
  
              scrolltop = scrolltop == 0 ? 5 : (scrolltop - 5);
  
              el.scrollTo('top', scrolltop);
          }, 100, view, [newScrollTop]);
        }
      }
    });

    // creating grid
    me.gridToTest = Ext.create({
      xtype: `${me.testName}`,
      renderTo: me.parent
    });
  }

  clearGridRefs() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    
    this.pageSize.value = 200;
    this.leadingBufferZone.value = 0;
    this.trailingBufferZone.value = 0;
  }

  disconnectedCallback() {
    this.clearGridRefs();
    Ext.undefine(`${this.testName}-store`);
    Ext.undefine(`${this.testName}-grid`);
  }
}
customElements.define("z-extjs-classic-scroll", ExtJSClassicScrollingComponent);