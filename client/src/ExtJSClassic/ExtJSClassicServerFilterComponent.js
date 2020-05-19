import { initialize, startTimer, endTimer, sendIt } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class ExtJSClassicServerFilterComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "show";
    this.product = "extjsclassic";
    this.testName = "server filter";
    this.name = "Ext JS Classic server filtering Test";
    this.summary = "Filtering store on server side in ExtJS of Classic Toolkit.<br/>You can set different values for:";

    initialize(this);

    this.cleartest.addEventListener('click', (event) => {
      this.clearGridRefs();
    });
    this.starttest.addEventListener('click', (event) => {
      this.runGridTest();
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
      autoLoad: false,
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
      width: 800,
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
        dataIndex: 'address',
        width: 210
      }, {
        text: 'Company',
        dataIndex: 'company',
        width: 210
      }],
      dockedItems: [
        {
          xtype: 'toolbar',
          docked: 'top',
          items: [
            {
              xtype: 'textfield',
              fieldLabel: 'Filter by first name',
              labelWidth: 120,
              labelAlign: 'left',
              bind: {
                value: '{filterText}',
                hidden: '{hiddenFlag}'
              },
              keyMap: {
                ENTER: 'onFilterFieldEnterKey'
              }
            },
            {
              xtype: 'button',
              text: 'Filter',
              handler: 'doFilter',
              bind: {
                hidden: '{hiddenFlag}'
              }
            },
            {
              xtype: 'button',
              text: 'Clear',
              handler: 'clearFilter'
            }
          ]
        }
      ],
      viewModel: {
        data: {
          filterText: '',
          hiddenFlag: true
        }
      },
      controller: {
        init: function() {
          var store = this.getView().getStore();

          store.load({
            callback: function() {
              this.getViewModel().set('hiddenFlag', false);
            },
            scope: this
          })
        },
        doFilter: function () {
          this.toggleFilter(true);
        },
        clearFilter: function () {
          this.toggleFilter(false);
        },
        toggleFilter: function (flag) {
          var viewModel = this.getViewModel(),
            filterText = viewModel.get('filterText'),
            store = this.getView().getStore(),
            milliseconds, testJson;

          // if clear filter is pressed and there is no filter applied to the store
          if (!filterText && store.getFilters().getCount() == 0) {
            return;
          }

          if (flag) {
            startTimer(me);
            store.on('load', () => {
              milliseconds = endTimer(me);
              testJson = {
                product: me.product,
                testName: me.testName,
                totalCount: store.totalCount,
                milliseconds: milliseconds,
              };

              sendIt(me.product, me.testName, testJson, milliseconds);
            }, this, { single: true });

            store.filter({
              property: 'firstname',
              value: filterText,
              anyMatch: true
            });
          } else {
            viewModel.set('filterText', '');
            store.clearFilter();
          }
        },
        onFilterFieldEnterKey: function () {
          var filterText = this.getViewModel().get('filterText');

          this.toggleFilter(!!filterText);
        }
      }
    });

    // creating grid
    me.gridToTest = Ext.create({
      xtype: `${me.testName}`,
      renderTo: me.parent
    });
  }
  disconnectedCallback() {
    this.clearGridRefs();
    Ext.undefine(`${this.testName}-store`);
    Ext.undefine(`${this.testName}-grid`);
  }
}

customElements.define("z-extjs-classic-server-filter", ExtJSClassicServerFilterComponent);