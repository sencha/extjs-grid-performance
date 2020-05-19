//import './ExtStuff.js'
import { sendIt, initialize } from './ComponentHelper.js'
import './Header.js'
class CustomRendererComponent extends HTMLElement {

  connectedCallback() {
    initialize(this, "Ext JS Custom Renderer")
    //this.innerHTML = `<z-header></z-header>`;
    //this.querySelector("div[name]").innerText = "Ext JS Custom Renderer"
    //this.example = this._doIt(this.querySelector("div[example]"))
    this._addListeners();
  }

  _addListeners() {
    this.querySelector("ext-button[extname='starttest']").addEventListener('tap', (event) => {
      //this.grid.getStore().setAutoLoad(true)
      this.example.setHtml(new Date().toString())
    });
  }

  _doIt(parent) {
    var o = Ext.create({ xtype: 'container', height: '400', renderTo: parent, html: "Ext JS Modern Filter will be here..." })
    console.log(o)
    return o
  }
}
customElements.define("z-custom-renderer", CustomRendererComponent);