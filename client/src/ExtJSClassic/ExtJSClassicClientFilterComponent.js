import { initialize, startTimer, endTimer, sendIt } from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class ExtJSClassicClientFilterComponent extends HTMLElement {
  connectedCallback() {
    this.product = "extjsclassic";
    this.testName = "local-filter";
    this.name = "Ext JS Classic local filtering Test";
    this.summary = "Filtering store on client side in ExtJS of Classic Toolkit";

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
  }
  runGridTest() {
    var me = this;

    if (!Ext.isEmpty(me.gridToTest)) {
      return;
    }

    Ext.define(`${me.testName}-grid`, {
      extend: 'Ext.grid.Panel',
      xtype: `${me.testName}`,
      height: 430,
      width: 800,
      scrollable: true,
      emptyText: 'No data available',
      bind: {
        store: '{users}'
      },
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
              emptyText: 'Filter by first name',
              width: 140,
              labelAlign: 'left',
              bind: {
                value: '{filterText}'
              },
              keyMap: {
                ENTER: 'onFilterFieldEnterKey'
              }
            },
            {
              xtype: 'button',
              text: 'Filter',
              handler: 'doFilter'
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
        stores: {
          users: {
            fields: ['firstname', 'lastname', 'title', 'address', 'company',{name: 'id',type: 'int'}],
            autoLoad: true,
            remoteSort: false,
            pageSize: 1000,
            proxy: {
              type: 'ajax',
              url: `${baseURL}api/rawData/getAllData?tableName=${window.tableName}`,
              reader: {
                rootProperty: 'users',
              }
            }
          }
        }
      },
      controller: {
        doFilter: function() {
          var viewModel = this.getViewModel(),
            filterText = viewModel.get('filterText'),
            store = viewModel.getStore('users'),
            milliseconds, testJson;

          startTimer(me);
          
          store.filter({
            property: 'firstname',
            value: filterText,
            anyMatch: true
          });
          
          milliseconds = endTimer(me);
          testJson = {
            product: me.product,
            testName: me.testName,
            milliseconds: milliseconds,
          };
          sendIt(me.product, me.testName, testJson, milliseconds);
        },
        clearFilter: function() {
          var viewModel = this.getViewModel();

          viewModel.set('filterText', '');
          viewModel.getStore('users').clearFilter();
        },
        onFilterFieldEnterKey: function () {
          var filterText = this.getViewModel().get('filterText');

          this[!!filterText ? 'doFilter' : 'clearFilter']();
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

customElements.define("z-extjs-classic-client-filter", ExtJSClassicClientFilterComponent);