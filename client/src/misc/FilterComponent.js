import { sendIt, initialize } from './ComponentHelper.js'
import './Header.js'
class FilterComponent extends HTMLElement {

  connectedCallback() {
    this.product = "extjsclassic";
    this.name = "ExtJSClassicFilterComponent"
    initialize(this)
    this._addListeners();
    var o = this._doIt()
  }

  _addListeners() {
    this.starttest.addEventListener('click', (event) => {
      //console.log('click')
      //this.grid.getStore().setAutoLoad(true)
      //this.example.setHtml(new Date().toString())
      //this.example.innerHTML = new Date().toString()
      sendIt('beforeload', new Date())
    });
  }

  _doIt() {
    var o = Ext.create({ xtype: 'panel', title: "the panel", height: '400px', renderTo: this.example, html: "Ext JS Modern Filter will be here..." })
    return o
  }
}
customElements.define("z-filter", FilterComponent);