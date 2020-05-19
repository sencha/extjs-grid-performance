import { initialize } from '../util/ComponentHelper.js'
import { startTimer, endTimer } from '../util/ComponentHelper.js'
class PlaceholderComponent extends HTMLElement {
  runGridTest() {
    var me = this;
    if (this.gridToTest == null) {
    }
    else {
    }
    startTimer(this)
    setTimeout(function(){
      endTimer(me, 'basic')
    }, 1000);
  }

  connectedCallback() {
    this.product = "placeholder";
    this.name = "PlaceholderComponent"
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      if (this.gridToTest && this.gridToTest.destroy) {
        this.gridToTest.destroy();
      }
    });
    this.starttest.addEventListener('click', (event) => {
      this.runGridTest()
    });
  }
}
customElements.define("z-placeholder", PlaceholderComponent);