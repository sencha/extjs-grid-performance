import { sendIt } from './ComponentHelper.js'

// function scriptIt() {
//   var xhrObj = new XMLHttpRequest();
//   var se;
//   xhrObj.open('GET', `assets/ext-all-sandbox-debug.js`, false);
//   xhrObj.send('');
//   console.log(xhrObj.responseText.substring(0, 5))
//   //if (xhrObj.responseText.substring(0, 3) != 'var') {showError();return;}
//   se = document.createElement('script');
//   se.type = "text/javascript";
//   se.text = xhrObj.responseText;
//   document.getElementsByTagName('head')[0].appendChild(se);
// }

// scriptIt()

// Ext6Classic.onReady(function() {
//   console.log(Ext6Classic)
// })


Ext.define('theStore', {
  extend: 'Ext.data.virtual.Store',
  alias: 'store.bufferforum',
  fields: [ 'firstName', 'lastName', 'address', 'company', 'title', { name: 'id', type: 'int' }],
  autoLoad: false,
  listeners: {
    // beforeprefetch: function() {
    //   console.log('beforeprefetch')
    // },
    // refresh: function() {
    //   console.log('refresh')
    // },
    beforeload: function (store, operation, eOpts) {
     //console.log('beforeload')
     sendIt('beforeload', new Date())

      // TestMetrics.timer_start({
      //   sync: false,
      //   run_test() {
      //     console.log()
      //   }
      // });
    },
    load: function (sender, records, b) {
      console.log('load')
      //sendIt('load', new Date())
      //var stop = TestMetrics.timer_stop()
      //generate_results(stop);
    }
  },

   leadingBufferZone: 0,
   trailingBufferZone: 0,
   purgePageCount: 0,
   pageSize: 10,
   //defaultViewSize: 8,
   //viewSize: 8,
  proxy: {
    type: 'ajax',
    url: 'https://llbzr8dkzl.execute-api.us-east-1.amazonaws.com/production/user',
    reader: {
      rootProperty: 'users',
      totalProperty: 'totalCount'
    }
  }
});

Ext.define('InfiniteGrid', {
  extend: 'Ext.grid.Grid',
  xtype: 'buffer-grid',
  title: 'Infinite Grid',
  width: 600,
  height: 500,
  shadow: true,
  store: { type: 'bufferforum' },
  scrollable: true,

  viewConfig: {

    //loadMask: false,

    listeners: {
      // itemadd: {
      //   fn: function () {
      //     console.log('item loaded')
      //   },
      //   single: true
      // }

      viewready: function () {
        console.log('viewready')
      },

      activate: function () {
        console.log('activate')
      },

      itemadd: function () {
          console.log('item loaded')
      }

    }
  },
  columns: [
        { text: 'First Name', dataIndex: 'firstName' },
        { text: 'Last Name', dataIndex: 'lastName' },
        { text: 'Id', dataIndex: 'id' },
        { text: 'Title', dataIndex: 'title' },
        { text: 'Address', dataIndex: 'address' },
        { text: 'Company', dataIndex: 'company' }
      ]

});