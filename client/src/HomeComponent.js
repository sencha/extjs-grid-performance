import './util/Header.js'
import { initialize } from './util/ComponentHelper.js'
class HomeComponent extends HTMLElement {
  constructor() {
    super()
    this.product = "none";
    this.name = "Welcome"
    this.summary = `
    This is the Sencha Grid Performance Analyzer for the Classic Toolkit

    <p>Here are links for each product:
<ul style="line-height:1.5">
  <li><a target="_blank" href="https://docs.sencha.com/extjs/7.1.0/classic/Ext.grid.Panel.html">Ext JS Classic Toolkit Grid - Sencha</a>
  <li><a target="_blank" href="https://www.ag-grid.com/">ag-Grid - ag-Grid Ltd.</a>
  <li><a target="_blank" href="https://demos.telerik.com/kendo-ui/grid/index?_ga=2.243489477.1357119994.1584889528-1295651737.1584889528">Kendo UI Grid - Telerik</a>
  <li><a target="_blank" href="https://js.devexpress.com/Overview/DataGrid/">DevExtreme Data Grid - DevExpress</a>
  <li><a target="_blank" href="https://www.grapecity.com/wijmo-flexgrid">Wijmo FlexGrid - Grapecity</a>
  <li><a target="_blank" href="https://www.syncfusion.com/javascript-ui-controls/js-data-grid">JavaScript UI controls DataGrid - Syncfusion</a>
  <li><a target="_blank" href="https://webix.com/widget/datatable/">Webix DataTable - XB Software</a>
</ul>
`
  }
  connectedCallback() {
    initialize(this)
  }
}
customElements.define("z-home", HomeComponent);
