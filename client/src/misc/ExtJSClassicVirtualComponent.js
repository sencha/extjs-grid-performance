import '../util/Header.js'
import { initialize } from '../util/ComponentHelper.js'
import { doIt } from './ExtJSClassicVirtual.js'
class ExtJSClassicVirtualComponent extends HTMLElement {
  constructor() {
    super()
    this.product = "extjsclassic";
    this.name = "ExtJSClassicVirtualComponent"
  }
  connectedCallback() {
    initialize(this)
    this.cleartest.addEventListener('click', (event) => {
      console.log('here')
      Ext.destroy(this.gridToTest)
      console.log(this.gridToTest)
    });
    this.starttest.addEventListener('click', (event) => {
      this.o = doIt(this)
    });
  }
}
customElements.define("z-extjs-classic-virtual", ExtJSClassicVirtualComponent);