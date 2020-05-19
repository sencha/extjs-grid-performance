import { sendIt, initialize } from './ComponentHelper.js'
import './Header.js'
class BasicComponent extends HTMLElement {
  connectedCallback() {
    initialize(this, "Basic")
    this._addListeners();
    var o = this._doIt()
  }
  _addListeners() {
    this.starttest.addEventListener('click', (event) => {
      sendIt('beforeload', new Date())
    });
  }
  _doIt() {
    return Ext.create({ xtype: 'panel', title: "Basic", height: '400px', renderTo: this.example, html: "Basic will be here..." })
  }
}
customElements.define("z-basic", BasicComponent);