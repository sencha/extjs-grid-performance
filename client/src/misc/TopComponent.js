class TopComponent extends HTMLElement {
  connectedCallback() {
    this.style.flex = "1"
    //xthis.style.width = "100%"
    this.style.display = "flex"
    this.style.background = "green"
    this.template = `

  <ext-image src='assets/sencha.png' height='100' width='200'></ext-image>
  <ext-container style='{"font-size": "34px","font-weight": "700","margin": "37px 10px 10px 0","color": "white","background": "#094158"}' html="Grid Performance Analyzer - Classic Toolkit"></ext-container>

  `;
    this.innerHTML = this.template;
  }
}
customElements.define("z-top", TopComponent);