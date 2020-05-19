import { initialize, startTimer, endTimer, sendIt, createScrollView } from '../util/ComponentHelper.js'
import { baseURL } from '../util/config.js';

class WijmoFlexGridScrollComponent extends HTMLElement {
  connectedCallback() {
    this.serverView = null;
    this.theGrid = null;
    this.isScroll = false;
    this.totalRows = null;
    this.renderedRows = null;
    this.startIndex = 1;
    this.isScrollToEnd = false;
    this.formstate = "hide";
    this.product = "Wijmo";
    this.testname = "scroll";
    this.name = "Wijmo Flex Grid Scroll Test";
    this.summary = `
      This test will display performance of the Wijmo Flex Grid Scroll Renderer.
    `;
    initialize(this);
    this.cleartest.addEventListener('click', (event) => {
      this.clearGrid();
    });
    this.starttest.addEventListener('click', (event) => {
      if (!this.theGrid) {
        this.runGridTest();
      }
    });

    createScrollView(this.parent, this.startScrolling.bind(this), this.scrollToEnd.bind(this));
  }

  /**
   * This function invoked on click on of `Clear Test` button
   * Hide all the elements on the page
   * Remove Grid element
   */
  clearGrid() {
    document.getElementById('startScrollBtn').style.display = 'none';
    document.getElementById('scrollUpContainer').style.display = 'none';
    document.getElementById('scrollDownContainer').style.display = 'none';
    document.getElementById('scrollToEndBtn').style.display = 'none';
    this.parent.removeChild(document.getElementById("target"));
    document.getElementById("rowCount").remove();
    document.getElementById('pageSize').value = 20;
    document.getElementById('scrollDownVal').value = '';
    document.getElementById('scrollUpVal').value = '';
    this.theGrid = null;
    this.startIndex = 1;
  }

  /**
   * This function invoked on click on of `Start Scrolling` button
   * Start the timer and call `startScrollingDown()`
   */
  startScrolling() {
    startTimer(this);
    this.startScrollingDown();
  }

  /**
   * This function invoked on click on of `Scroll To End` button
   * Start the timer
   * Set `isScrollToEnd` to true and call `startScrollingDown()`
   */
  scrollToEnd() {
    startTimer(this);
    this.isScrollToEnd = true;
    this.startScrollingDown();
  }

  /**
   * This function calculate the page position
   * Scroll the page Top to Buttom as specified in Page Down input
   * Once Reached to target page move up to specified page no in Page Up input
   */
  startScrollingDown() {
    if (this.isScrollToEnd) {
        // This handle the Scroll to End request
        var gridElement = document.getElementsByClassName('wj-cells')[0];
        var sz = this.theGrid.scrollSize;
        this.theGrid.scrollPosition = new wijmo.Point(-sz.width, -sz.height);
        this.startIndex++;

        if (this.renderedRows === this.totalRows) {
          this.startIndex = 1;
          this.isScrollToEnd = false;
          this.timeCalculator(true);
        }
    } else {
      var pageDown = parseInt(document.getElementById("scrollDownVal").value, 0);
      if (!(pageDown == 1 && this.startIndex == 1)) {
        var pageSize = parseInt(document.getElementById("pageSize").value, 0);
        var gridElement = document.getElementsByClassName('wj-cells')[0];
        var sz = this.theGrid.scrollSize;

        //Page Down code
        var height = (pageDown-1) * gridElement.offsetTop * pageSize;
        this.theGrid.scrollPosition = new wijmo.Point(-sz.width, -height);
        this.startIndex++;

        //Page Up Code
        if (this.startIndex == (pageDown * 2) + 1) {
          this.startIndex = 1;
          var pageUp = parseInt(document.getElementById("scrollUpVal").value, 0);
          var up = (pageUp - 1) * gridElement.offsetTop * pageSize;
          this.theGrid.scrollPosition = new wijmo.Point(-sz.width, -up);
          this.timeCalculator(false);
        }
      }
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
        if (me.startIndex !== 1) {
          me.startScrollingDown();
        }
        me.renderedRows = s.rows.length;
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
        if (me.startIndex == 1) {
          me.showGridControll();
        }
      }
    });
  }

  /**
   * Show the Form elements
   * Set `Display` to `inline-block`
   */
  showGridControll() {
    document.getElementById('startScrollBtn').style.display = 'inline-block';
    document.getElementById('scrollToEndBtn').style.display = 'inline-block';
    document.getElementById('scrollUpContainer').style.display = 'inline-block';
    document.getElementById('scrollDownContainer').style.display = 'inline-block';
  }

  /**
   * End the timer
   * Calcute time and send.
   */
  timeCalculator(isScrollEnd) {
    var testName = isScrollEnd ? 'Scroll End' : this.testname;
    var milliseconds = endTimer(this);
    var testJSON = {
      product: this.product,
      testname: testName,
      milliseconds: milliseconds,
      pageSize: document.getElementById("pageSize").value,
    };
    sendIt(this.product, testName, testJSON, milliseconds);
  }
}
customElements.define("flex-grid-scroll", WijmoFlexGridScrollComponent);