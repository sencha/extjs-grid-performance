import { initialize, startTimer, endTimer, sendIt } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class ExtJSClassicBufferedComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "show";
    this.product = "extjsclassic";
    this.testname = "buffered";
    this.name = "Ext JS Classic Buffered Test"
    this.summary = `
This test will display performance of the Ext JS Classic toolkit Buffered Renderer and Buffered Store.
<p>You can set different values for:

    `
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      Ext.destroy(this.gridToTest)
      this.gridToTest = null;

      this.pageSize.value = 200;
      this.leadingBufferZone.value = 0;
      this.trailingBufferZone.value = 0;
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
    
    if (this.gridToTest == null) {
      Ext.define(`${this.testname}-store`, {
        extend: 'Ext.data.BufferedStore',
        alias: `store.${this.testname}-store`,
        fields: ['firstname', 'lastname', 'address', 'company', 'title',{name: 'id',type: 'int'}],
        listeners: {
          beforeload: function (store, operation, eOpts) {
            startTimer(me)
          },
          load: function (sender, records, b) {
            var milliseconds = endTimer(me)
            var testJSON = {
              product: me.product,
              testname: me.testname,
              totalCount: me.gridToTest.getStore().totalCount,
              milliseconds: milliseconds,
              pageSize: me.pageSize.value,
              leadingBufferZone: me.leadingBufferZone.value,
              trailingBufferZone: me.trailingBufferZone.value
            }
            sendIt(me.product, me.testname, testJSON, milliseconds)
          }
        },
        pageSize: parseInt(this.pageSize.value, 10),
        leadingBufferZone: parseInt(this.leadingBufferZone.value, 10),
        trailingBufferZone: parseInt(this.trailingBufferZone.value, 10),
        autoLoad: true,
        proxy: {
          type: 'ajax',
          url: `${baseURL}api/rawData/getPageData?tableName=${window.tableName}`,
          reader: {
            rootProperty: 'users',
            totalProperty: 'totalCount'
          }
        }
      });
      Ext.define(`${this.testname}-grid`, {
        extend: 'Ext.grid.Panel',
        xtype: `${this.testname}`,
        store: { type: `${this.testname}-store` },
        height: 450,
        width: 800,
        scrollable: true,
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
      });
    }
    this.gridToTest = Ext.create({ xtype: `${this.testname}`, renderTo: this.parent })
  }
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    Ext.undefine(`${this.testname}-store`);
    Ext.undefine(`${this.testname}-grid`);
  }
}
customElements.define("z-extjs-classic-buffered", ExtJSClassicBufferedComponent);