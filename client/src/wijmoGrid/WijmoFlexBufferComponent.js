import { initialize, startTimer, endTimer, sendIt, createBufferView } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class WijmoFlexBufferComponent extends HTMLElement {
  connectedCallback() {
    this.theGrid = null;
    this.serverView = null;
    this.isScroll = false;
    this.totalRows = null;
    this.formstate = 'hide';
    this.product = 'Wijmo';
    this.testname = 'buffered';
    this.name = 'Wijmo Flex Buffer Filter Test'
    this.summary = ` This test will display performance of the Wijmo Flex Filtering.`
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.clearGrid();
    });
    this.starttest.addEventListener('click', (event) => {
      if (!this.theGrid) {
        this.runGridTest();
      }
    });
    createBufferView(this.parent);
  }

  /**
   * This function invoked on click on of `Clear Test` button
   * Hide all the elements on the page
   * Remove Grid element
   */
  clearGrid() {
    this.parent.removeChild(document.getElementById("target"));
    document.getElementById("rowCount").remove();
    document.getElementById('pageSize').value = 20;
    this.theGrid = null;
  }

  /**
   * This function invoked on click on of `Start Test` button
   * Create Initial Grid
   * Set data in grid
   */
  runGridTest() {
    var me = this;
    startTimer(me);
    var gridContainer = document.createElement('div');
    gridContainer.setAttribute('id', 'target');
    me.parent.append(gridContainer);

    var gridCounter = document.createElement('div');
    gridCounter.setAttribute('id', 'rowCount');
    me.parent.append(gridCounter);
    
    // create an empty CollectionView and bind a new FlexGrid to it
    me.serverView = new wijmo.collections.CollectionView();
    me.getData(0);
    me.theGrid = new wijmo.grid.FlexGrid('#target', {
      allowSorting: false,
      showSort: false,
      isReadOnly: true,
      autoGenerateColumns: false,
      columns: [
        { binding: 'id', header: 'Index', width: '2*' },
        { binding: 'firstname', header: 'Firstname', width: '5*' },
        { binding: 'lastname', header: 'Lastname', width: '5*' },
        { binding: 'title', header: 'Title', width: '5*' },
        { binding: 'address', header: 'Address', width: '5*' },
        { binding: 'company', header: 'Organization', width: '5*' }
      ],
      itemsSource: me.serverView,
      updatedView: function (s, e) {
        rowCount.textContent = `${s.rows.length} of ${me.totalRows}`;
      },
      scrollPositionChanged: function (s, e) {
        // if we're close to the bottom, add items
        if (s.rows.length && s.viewRange.bottomRow >= s.rows.length -1 && !me.isScroll) {
          if (s.rows.length < me.totalRows) {
            me.isScroll = true;
            me.getData(s.rows.length);
          }
        }
      }
    });

    var rowCount = document.getElementById('rowCount');
  }

  /**
   * Fetch data from server
   * Update the sourceCollection
   */
  getData(start) {
    var me = this;
    var url = `${baseURL}api/rawData/getWijmoGridBufferedData`;
    var params = {
      $format: 'json',
      tableName: window.tableName,
      pageSize: document.getElementById('pageSize').value,
      start: start,
      filter: null
    };
    wijmo.httpRequest(url, {
      data: params,
      success: function(xhr) {
        // got the data, assign it to the CollectionView
        var response = JSON.parse(xhr.response);
        var data = response.result ? response.result : [];
        me.totalRows = response.count;
        // use the result as the sourceCollection
        me.serverView.sourceCollection.push(...data);
        me.isScroll = false;
        if (start == 0) {
          me.timeCalculator();
        }
      }
    });
  }

  /**
   * End the timer
   * Calcute time and send.
   */
  timeCalculator() {
    var milliseconds = endTimer(this);
    var testJSON = {
      product: this.product,
      testname: this.testname,
      milliseconds: milliseconds,
      pageSize: document.getElementById("pageSize").value,
    };
    sendIt(this.product, this.testname, testJSON, milliseconds);
  }
}
customElements.define('wijmo-flex-buffer', WijmoFlexBufferComponent);