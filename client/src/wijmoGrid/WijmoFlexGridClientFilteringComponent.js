import { initialize, startTimer, endTimer, sendIt, createFilterView } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class WijmoFlexGridClientFilteringComponent extends HTMLElement {
  connectedCallback() {
    var theGrid = null;
    this.formstate = 'hide';
    this.product = 'wijmo';
    this.testname = 'client filter';
    this.name = 'Flex Grid Client Side Filter Test'
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
    createFilterView(this.parent, this.startFiltering.bind(this), this.clearFiltering.bind(this));
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
    document.getElementById('inputFilterVal').style.display = 'none';
    document.getElementById('inputFilterVal').value = '';
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
      this.flexGridFilter();
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
      this.flexGridFilter();
    }
  }

  /**
   * Filter data on client and rendered filtered data
   */
  flexGridFilter() {
    var filter = document.getElementById('inputFilterVal').value.toLowerCase();
    this.theGrid.collectionView.filter = function (item) {
      return filter.length == 0 || item.firstname.toLowerCase() == filter;
    };

    if (document.getElementById('inputFilterVal').value !== '') {
      this.timeCalculator();
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
    
    // create an empty CollectionView and bind a new FlexGrid to it
    me.serverView = new wijmo.collections.CollectionView();
    me.getData();
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
      itemsSource: me.serverView
    });
  }

  /**
   * Fetch data from server
   * Update the sourceCollection
   */
  getData() {
    var me = this;
    // populate it with data from a server
    var url = `${baseURL}api/rawData/getAllData`;
    var params = {
      $format: 'json',
      tableName: window.tableName
    };

    wijmo.httpRequest(url, {
      data: params,
      success: function(xhr) {
        // got the data, assign it to the CollectionView
        var response = JSON.parse(xhr.response);
        var data = response.users ? response.users : [];
        // use the result as the sourceCollection
        me.serverView.sourceCollection = data;
        document.getElementById('startFilterBtn').style.display = 'inline-block';
        document.getElementById('clearFilterBtn').style.display = 'inline-block';
        document.getElementById('inputFilterVal').style.display = 'inline-block';
        document.getElementById('filterValueLabel').style.display = 'inline-block';
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
      milliseconds: milliseconds
    };
    sendIt(this.product, this.testname, testJSON, milliseconds);
  }
}

customElements.define("wijmo-flex-client-filtering", WijmoFlexGridClientFilteringComponent);