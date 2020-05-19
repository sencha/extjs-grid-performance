import { initialize } from '../util/ComponentHelper.js'
import { startTimer, endTimer, sendIt } from '../util/ComponentHelper.js'
class ExtJSClassicBasicComponent extends HTMLElement {
  connectedCallback() {
    this.formstate = "hide";
    this.product = "extjsclassic";
    this.testname = "basic";
    this.name = "Ext JS Classic Basic Test"
    this.summary = `
    This test will display performance of the Ext JS Classic Toolklit Basic Renderer.
        `

    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      Ext.destroy(this.gridToTest)
      this.gridToTest = null;
      Ext.undefine(this.testname);
    });
    this.starttest.addEventListener('click', (event) => {
      this.runGridTest()
    });
  }
  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
      Ext.define(this.testname, {
        extend: 'Ext.grid.Panel',
        xtype: `${this.testname}-grid`,
        height: '500px', width: '500px',
        store: {
          data: [
            { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
            { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
            { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
            { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
        ]},
        columns: [
          { text: 'Name', dataIndex: 'name' },
          { text: 'Email', dataIndex: 'email' },
          { text: 'Phone', dataIndex: 'phone' }
        ],
        listeners: {
          afterlayout: function() {
            var milliseconds = endTimer(me)
            var testJSON = {
              product: me.product,
              testname: me.testname,
              milliseconds: milliseconds
            }
            sendIt(me.product, me.testname, testJSON, milliseconds)
          }
        }
      });
    }
    else {
      Ext.destroy(this.gridToTest)
    }
    startTimer(this)
    //this.gridToTest = Ext.create({ xtype: 'basic-grid', title: new Date().toString(), renderTo: this.parent })
    this.gridToTest = Ext.create({ xtype: `${this.testname}-grid`, renderTo: this.parent })
  }
  disconnectedCallback() {
    if (this.gridToTest && this.gridToTest.destroy) {
      this.gridToTest.destroy();
    }
    this.gridToTest = null;
    Ext.undefine(this.testname);
  }
}
customElements.define("z-extjs-classic-basic", ExtJSClassicBasicComponent);