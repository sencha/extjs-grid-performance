import { initialize, startTimer, endTimer, sendIt, createServerSideFilterView } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class WijmoFlexGridServerFilteringComponent extends HTMLElement {
  connectedCallback() {
    this.serverView = null;
    this.theGrid = null;
    this.isScroll = false;
    this.totalRows = null;
    this.formstate = 'hide';
    this.product = 'wijmo';
    this.testname = 'server filter';
    this.name = 'Flex Grid Server Side Filter Test'
    this.summary = ` This test will display performance of the Flex Grid Filtering.`
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.clearGrid();
    });
    this.starttest.addEventListener('click', (event) => {
      if (!this.theGrid) {
        this.runGridTest();
      }
    });
    createServerSideFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
  }

  /**
   * This function invoked on click on of `Clear Test` button
   * Hide all the elements on the page
   * Remove Grid element
   */
  clearGrid() {
    document.getElementById('startFilterBtn').style.display = 'none';
    document.getElementById('clearFilterBtn').style.display = 'none';
    this.parent.removeChild(document.getElementById("target"));
    document.getElementById('inputFilterVal').value = '';
    document.getElementById("rowCount").remove();
    document.getElementById('pageSize').value = 20;
    document.getElementById('inputFilterVal').style.display = 'none';
    document.getElementById('filterValueLabel').style.display = 'none';
    this.theGrid = null;
  }
  
  /**
   * This function invoked on click on of `Start Filtering` button
   * Clear rendered Grid
   * Get filtered data and Rerender Grid
   */
  startFiltering() {
    if (document.getElementById('inputFilterVal').value !== '') {
      startTimer(this);
      this.serverView.items.clear();
      this.getData(0);
    }
  }
  
  /**
   * This function invoked on click on of `Clear Filtering` button
   * Clear rendered Grid
   * Get data and rerender Grid
   */
  clearFiltering() {
    if (document.getElementById('inputFilterVal').value !== '') {
      document.getElementById('inputFilterVal').value = '';
      this.serverView.items.clear();
      this.getData(0);
    }
  }
  
  /**
   * This function invoked on click on of `Start Test` button
   * Create Initial Grid
   * Set data in grid
   */
  runGridTest() {
    var me = this;
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
    var filter = null;
    if (document.getElementById('inputFilterVal').value) {
      filter = JSON.stringify({
        key: 'firstname',
        value: document.getElementById('inputFilterVal').value
      });
    }
    // populate it with data from a server
    var url = `${baseURL}api/rawData/getWijmoGridBufferedData`;
    var params = {
      $format: 'json',
      tableName: window.tableName,
      pageSize: document.getElementById('pageSize').value,
      start: start,
      filter: filter
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
        me.showGridControll();
        if (filter) {
          me.timeCalculator();
        }
      }
    });
  }

  /**
   * Show the Form elements
   * Set `Display` to `inline-block`
   */
  showGridControll() {
    document.getElementById('startFilterBtn').style.display = 'inline-block';
    document.getElementById('clearFilterBtn').style.display = 'inline-block';
    document.getElementById('inputFilterVal').style.display = 'inline-block';
    document.getElementById('filterValueLabel').style.display = 'inline-block';
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
      rowCount: document.getElementById('pageSize').value
    };
    sendIt(this.product, this.testname, testJSON, milliseconds);
  }
}

customElements.define("wijmo-flex-server-filtering", WijmoFlexGridServerFilteringComponent);