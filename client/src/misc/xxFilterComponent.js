//import './ExtStuff.js'
import './Header.js'
class FilterComponent extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `<z-header></z-header>`;
    //this.querySelector("span[title]").innerText = "Ext JS Modern Filter"
    //this.example = this._doIt(this.querySelector("div[example]"))
    this._addListeners();
  }

  _addListeners() {
    // this.querySelector("ext-button[extname='starttest']").addEventListener('tap', (event) => {
    //   //this.grid.getStore().setAutoLoad(true)
    //   this.example.setHtml(new Date().toString())
    // });
  }

  _doIt(parent) {
    var o = Ext.create({ xtype: 'container', height: '400', renderTo: parent, html: "Ext JS Modern Filter will be here..." })
    console.log(o)
    return o
  }
}
customElements.define("z-filter", FilterComponent);