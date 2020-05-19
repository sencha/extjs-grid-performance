import { startTimer, endTimer } from '../util/ComponentHelper.js'
export function doIt(me) {
  if (me.o != null) {
    Ext.destroy(me.o)
  }
  else {
    Ext.create('Ext.data.Store', {
      storeId: 'simpsonsStore',
      fields:[ 'name', 'email', 'phone'],
      data: [
          { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },
          { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },
          { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244' },
          { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }
      ]
    });
    Ext.define('buffergrid', {
      extend: 'Ext.grid.Panel',
      xtype: 'buffer-grid',
      title: new Date().toString(),
      store: Ext.data.StoreManager.lookup('simpsonsStore'),
      columns: [
        { text: 'Name', dataIndex: 'name', flex: 1 },
        { text: 'Email', dataIndex: 'email', flex: 2 },
        { text: 'Phone', dataIndex: 'phone', flex: 1 }
      ],
      listeners: {
        afterlayout: function() {
          endTimer(me)
        }
      }
    });
  }
  startTimer(me)
  me.o = Ext.create({ xtype: 'buffer-grid', height: '500px', width: '500px', renderTo: me.parent })
  return me.o
}