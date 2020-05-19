class HeaderComponent extends HTMLElement {
  connectedCallback() {
    var background = this.getAttribute('background')
    var buttonstate = this.getAttribute('buttonstate')
    var formstate = this.getAttribute('formstate')
    var color = this.getAttribute('color')
    this.template = `
    <style>
    .root {
      display: flex;
      width: 100%;
      flex-direction: column;
    }
    .top {
      height: 50px;
      padding: 10px 10px 10px 10px;
      color: white;
      font-size: 24px;
      background: #094158;
      display: flex;
      width: 100%;
    }
    .start {
      margin: 0px 0px 0px 30px;
      position: absolute;
      right: 0;
      margin: 0 1px 0 0;
      xpadding: 0 10px 20px 10px;
      height: 35px;
      display: flex;
      xjustify-content: flex-end;
      xalign-content: flex-end;
    }
    .buttons {
      width: 150px;
      background: ${background};
      color: ${color};
      font-size: 24px;
    }
    .form {
      font-size: 24px;
      font-weight: 500;
      color: ${color};
      margin: 0px 0px 0px 30px;
      display: table;
      width: 300px;
      line-height: 1.5;
    }
    .row {
      display: table-row;
    }
    label {
      display: table-cell;
    }
    input {
      font-size: 24px;
      display: table-cell;
      width: 50px;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
    .name {
      font-size: 24px;
      line-height: 1.1;
    }
    </style>
    <div class="root" style="border-left:1px solid gray;border-right:1px solid gray;background:${background};color:blue;width:100%;height:100%;">

      <div class="top">
        <div class="name" name></div>
        <div class="start">
          <button class="buttons ${buttonstate}" cleartest>clear test</button>
          <button class="buttons ${buttonstate}" starttest>start test</button>
        </div>
      </div>

      <div style="">
        <div summary style="color:${color};font-size: 24px;line-height: 1.1;padding:10px;width:100%;"></div>
        <div class="form ${formstate}">
          <div class="row">
            <label for="pageSize">pageSize:</label>
            <input name="pageSize" pageSize type="text" value="200">
          </div>
          <div class="row">
          <label for="leadingBufferZone">leadingBufferZone:</label>
          <input leadingBufferZone type="text" value="0">
          </div>
          <div class="row">
          <label for="trailingBufferZone">trailingBufferZone:</label>
          <input trailingBufferZone type="text" value="0">
          </div>
        </div>
        <div parent style="padding:10px;width:100%;height:100%;" class="ag-theme-balham"></div>
      </div>

    <div>
    `;
    this.innerHTML = this.template;
  }
}
customElements.define("z-header", HeaderComponent);