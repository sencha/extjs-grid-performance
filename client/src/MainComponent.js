class MainComponent extends HTMLElement {
  connectedCallback() {
    window.allTests = []
    window.tableName = "mega_1000000";
    window.tableSize = 1000000;

    this.innerHTML = `
<style>
.x-column-header {
  border-right: 1px solid #d0d0d0;
  color: white;
  font: 400 13px/19px 'Open Sans', 'Helvetica Neue', helvetica, arial, verdana, sans-serif;
  outline: 0;
  background-color: #094158;
}
// .x-grid-view, .x-tree-view {
//   z-index: 1;
//   background: #094158;
// }
</style>

<ext-panel viewport="true" layout="fit" bodyStyle='{"border":"0px solid red"}'>

  <ext-container dock="top" layout="hbox" height="100" style='{"color": "white","background": "#094158"}'>
    <ext-image alt='logo' src='assets/sencha.png' height='100' width='200'></ext-image>
    <ext-container style='{"font-style": "italic", "font-size": "34px","font-weight": "700","margin": "37px 10px 10px 0","color": "white","background": "#094158"}' html="Grid Performance Analyzer - Classic Toolkit"></ext-container>
  </ext-container>

  <ext-panel
    header="false"
    dock="left"
    layout="fit"
    border="false"
    scrollable="y"
    resizable='{"edges": "east", "dynamic": "true"}'
    width="400"
  >
    <ext-container dock="top" height="46" layout="hbox" style='{"padding": "0 0 0 20px","color": "white","background": "#094158"}'>


      <select tableSize style="background: #5fa2dd;color:white;margin: 1px 1px 1px 10px;height: 30px;padding: 5px 7px;">
        <option value="mega_5000">Table size: 5000</option>
        <option value="mega_10000">Table size: 10000</option>
        <option value="mega_100000">Table size: 100000</option>
        <option selected value="mega_1000000">Table size: 1000000</option>
      </select>

      <!--
      <ext-button collapse text="collapse all"></ext-button>
      -->
    </ext-container>
    <ext-treelist
      nav
      extname="treelist"
      ui="nav"
      expanderFirst="false"
      expanderOnly="false"
    >
    </ext-treelist>
  </ext-panel>

  <div id="router" style="border:1px;width:100%;height:100%;background:green;"></div>

  <ext-panel
    dock="right"
    layout="fit"
    xtitle="Results"
    xcls="contextpanel"
    weight="10"
    bodyPadding="0"
    xextname="context"
    bodyPadding="10px"
    border="true"
    shadow="true"
    scrollable="y"
    resizable='{"edges": "east", "dynamic": "true"}'
    width="400"
    collapsed="false"
  >
    <ext-container dock="top" height="46" style='{"padding": "0 0 0 20px","color": "white","background": "#094158"}'>
      <ext-button clear text="clear"></ext-button>
      <ext-button style="margin-left:10px;" export text="export"></ext-button>
    </ext-container>
    <ext-grid
      id = 'g2'
      plugins = '{
        "gridexporter": true
      }',
      columns='[
        {"text": "product", "dataIndex": "product"},
        {"text": "testname", "dataIndex": "testname"},
        {"text": "tablesize", "dataIndex": "tablesize"},
        {"text": "milliseconds", "dataIndex": "milliseconds", "flex": "1"}
      ]'
      grid store='{}' extname="grid" flex: "1">
    </ext-grid>
  </ext-panel>

  <!--
  <ext-toolbar dock="bottom">
    <ext-button id="button2" text="bottom"></ext-button>
  </ext-toolbar>
  -->

</ext-panel>
`;
 //{"text": "test", "dataIndex": "test", "flex": "1"},
    this._addListeners();
  }

  getLeafs(data) {
    var leafs = []
    data.forEach(item => {
      if(item.children) {
        var newLeafs = this.getLeafs(item.children)
        leafs = leafs.concat(newLeafs)
      }
      else if (item.leaf == true) {
        var o = {}
        o.path = item.path
        o.component = item.component
        leafs.push(o)
      }
      else {
        console.log('bad item')
      }
    })
    return leafs;
  }

  _addListeners() {
    var me = this;
    this.querySelector('ext-panel').addEventListener('ready', (event) => {
      for (var prop in event.detail.cmpObj) {
        this[prop] = event.detail.cmpObj[prop];
      }
      fetch('assets/menu.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var leafs = this.getLeafs(data)
        const router = new Router(document.getElementById('router'));
        router.setRoutes(leafs)
        var navTreeRoot = {
          children: data
        };
        var treeStore = {xtype: 'tree',root: navTreeRoot};
        this.treelist.setStore(treeStore);
      });
    });

    this.querySelector('ext-treelist[nav]').addEventListener('selectionchange', (event) => {
      var data = event.detail.record.data;
      if (data.leaf == true) {
        Router.go(data.path);
      }
    });

    this.querySelector('select[tableSize]').addEventListener('change', (event) => {
      window.tableName = event.target.value;
      window.tableSize = parseInt(event.target.value.split('_')[1], 10);
    });

    // this.querySelector('ext-button[expand]').addEventListener('click', (event) => {
    //   //me.treelist.setSelection(0);
    //   me.treelist.setSelection(31);
    //   me.treelist.setSelection(41);
    //   me.treelist.setSelection(51);
    //   me.treelist.setSelection(61);
    //   me.treelist.setSelection(71);
    //   me.treelist.setSelection(81);
    //   me.treelist.setSelection(91);
    //   me.treelist.setSelection(101);
    //   me.treelist.setSelection(21);

    // });

    // this.querySelector('ext-button[collapse]').addEventListener('click', (event) => {
    //   //me.treelist.setSelection(0);
    //   me.treelist.setSelection(2);
    //   me.treelist.setSelection(7);
    //   me.treelist.setSelection(1);
    //   //console.log(me.treelist.getSelection(0))
    // });

    this.querySelector('ext-button[clear]').addEventListener('click', (event) => {
      me.grid.getStore().removeAll();
      //me.grid.getStore().sync();
    });

    this.querySelector('ext-button[export]').addEventListener('click', (event) => {
      var cfg = {
        title: 'Grid Perf Export',
        fileName: 'GridPerfExport.csv',
        type: 'csv'
      }
      me.grid.saveDocumentAs(cfg);
      //Ext.getCmp('g2').saveDocumentAs(cfg);
    });

    document.addEventListener('newdata', (event) => {
      var product = event.detail.product
      //var test = event.detail.test
      var testname = event.detail.testname
      var milliseconds = event.detail.milliseconds.toString()
      var tablesize = window.tableSize
      me.grid.getStore().add({product: product, testname: testname, milliseconds: milliseconds, tablesize: tablesize})

      window.allTests.push(event.detail.testJSON)
    });
  }
}
customElements.define("z-main", MainComponent);

  // {"text": "Filtering","iconCls": "x-fa fa-tags","path": "/z-filter","component": "z-filter", "leaf": true},
  // {"text": "Ext JS Classic Virtual","iconCls": "x-fa fa-tags","path": "/extjs-classic-virtual","component": "z-extjs-classic-virtual", "leaf": true},
  // {"text": "Initial Load","iconCls": "x-fa fa-sliders-h","path": "/extjs-classic-virtual","component": "z-extjs-classic-virtual", "leaf": true},
  // {"text": "Scroll to End (BASIC)","iconCls":"x-fa fa-sliders-h","path": "/basic", "component": "z-basic", "leaf": true}