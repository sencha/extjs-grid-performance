import './Header.js'
export function initialize(me) {
  me.gridToTest = null
  if (me.formstate == undefined) {
    me.formstate = 'hide'
  }
  var color
  var background
  var buttonstate = 'show'


  switch(me.product){
    case 'none':
      background="lightgray";
      color="black";
      buttonstate="hide"
      break;
    case 'KendoUI':
      background="rgb(9, 65, 88)";
      color="white";
      break;
    case 'placeholder':
      background="white";
      color="black";
      break;
    case 'extjsclassic':
      background="#92c045";
      color="black";
      break;
    case 'aggrid':
      background="#df232b";
      color="white";
      break;
    case 'webix':
      background="#6f4eb5";
      color="white";
      break;
    default:
      background="#df232b";
      color="black";
  }

  background="lightgray";
  color="black";

  //background="rgb(9, 65, 88)";
  //color="white";

  me.innerHTML = `<z-header color="${color}" background="${background}"  formstate="${me.formstate}" buttonstate="${buttonstate}"></z-header>`;
  me.parent = me.querySelector("div[parent]")
  me.starttime = null
  me.endtime = null
  me.cleartest=me.querySelector("button[cleartest]")
  me.starttest=me.querySelector("button[starttest]")

  me.pageSize=me.querySelector("input[pageSize]")
  me.leadingBufferZone=me.querySelector("input[leadingBufferZone]")
  me.trailingBufferZone=me.querySelector("input[trailingBufferZone]")

  me.querySelector("div[name]").innerHTML = me.name
  me.querySelector("div[summary]").innerHTML = me.summary
}

export function startTimer(me) {
  //me.starttime = new Date().getTime()
  me.starttime = performance.now()
}

export function endTimer(me) {
  //me.endtime = new Date().getTime()
  me.endtime = performance.now()
  return me.endtime - me.starttime
  //sendIt(me.product, whichTest, me.endtime - me.starttime)
}

export function sendIt(product, testname, testJSON, milliseconds) {
  var test = JSON.stringify(testJSON)
  document.dispatchEvent(new CustomEvent('newdata',
  {
    detail: {
      product: product,
      testname: testname,
      test: test,
      testJSON: testJSON,
      milliseconds: milliseconds,
      tablename: window.tableName
    },
    bubbles: true,
    composed: true
  }))
}
export function createFilterView(parent, startFilter, clearFilter) {
  var container1 = document.createElement('span');
  var inputFilterVal = document.createElement('INPUT');
  inputFilterVal.setAttribute('type', 'text');
  inputFilterVal.setAttribute('id', 'inputFilterVal');
  inputFilterVal.setAttribute('style', 'width: 150px; display: none ');
  var filterValueLabel = document.createElement('label');
  filterValueLabel.innerHTML = 'Filter on First Name:';
  filterValueLabel.setAttribute('id', 'filterValueLabel');
  filterValueLabel.setAttribute('style', 'width: 200px; display: none ');
  container1.append(filterValueLabel);
  container1.append(inputFilterVal);

  var container2 = document.createElement('p');
  var startFilterBtn = document.createElement('Button');
  startFilterBtn.innerHTML = 'Start Filtering';
  startFilterBtn.setAttribute('id', 'startFilterBtn');
  startFilterBtn.style.display = 'none';
  startFilterBtn.addEventListener('click', startFilter);

  var clearFilterBtn = document.createElement('Button');
  clearFilterBtn.innerHTML = 'Clear Filtering';
  clearFilterBtn.setAttribute('id', 'clearFilterBtn');
  clearFilterBtn.style.display = 'none';
  clearFilterBtn.addEventListener('click', clearFilter);

  container2.append(startFilterBtn);
  container2.append(clearFilterBtn);

  parent.append(container1);
  parent.append(container2);
}

export function createBufferView(parent) {
  var container1 = document.createElement('span');
  var filterRowInput = document.createElement('INPUT');
  filterRowInput.setAttribute('type', 'number');
  filterRowInput.setAttribute('id', 'pageSize');
  filterRowInput.setAttribute('min', 1);
  filterRowInput.setAttribute('max', 1000);
  filterRowInput.setAttribute('value', 20);
  filterRowInput.setAttribute('style', 'width: 150px');
  var filterRowLabel = document.createElement('label');
  filterRowLabel.innerHTML = 'Page Size:&nbsp;'
  container1.append(filterRowLabel);
  container1.append(filterRowInput);

  parent.append(container1);
}

export function createServerSideFilterView(parent, startFilter, clearFilter) {
  var container1 = document.createElement('span');
    var filterRowInput = document.createElement('INPUT');
    filterRowInput.setAttribute('type', 'number');
    filterRowInput.setAttribute('id', 'pageSize');
    filterRowInput.setAttribute('min', 1);
    filterRowInput.setAttribute('max', 1000);
    filterRowInput.setAttribute('value', 20);
    filterRowInput.setAttribute('style', 'width: 150px');
    var filterRowLabel = document.createElement('label');
    filterRowLabel.innerHTML = 'Page Size:&nbsp;';

    container1.append(filterRowLabel);
    container1.append(filterRowInput);

    var breakLine = document.createElement('br');
    container1.append(breakLine);

    var inputFilterVal = document.createElement('INPUT');
    inputFilterVal.setAttribute('type', 'text');
    inputFilterVal.setAttribute('id', 'inputFilterVal');
    inputFilterVal.setAttribute('style', 'width: 150px; display: none ');
    var filterValueLabel = document.createElement('label');
    filterValueLabel.innerHTML = 'Filter on First Name:';
    filterValueLabel.setAttribute('id', 'filterValueLabel');
    filterValueLabel.setAttribute('style', 'width: 150px; display: none ');
    container1.append(filterValueLabel);
    container1.append(inputFilterVal);

    var container2 = document.createElement('p');
    var startFilterBtn = document.createElement('Button');
    startFilterBtn.innerHTML = 'Start Filtering';
    startFilterBtn.setAttribute('id', 'startFilterBtn');
    startFilterBtn.style.display = 'none';
    startFilterBtn.addEventListener('click', startFilter);

    var clearFilterBtn = document.createElement('Button');
    clearFilterBtn.innerHTML = 'Clear Filtering';
    clearFilterBtn.setAttribute('id', 'clearFilterBtn');
    clearFilterBtn.style.display = 'none';
    clearFilterBtn.addEventListener('click', clearFilter);

    container2.append(startFilterBtn);
    container2.append(clearFilterBtn);

    parent.append(container1);
    parent.append(container2);
}

export function createScrollView(parent, startScroll, scrollToEnd) {
  const container1 = document.createElement('span');
  const filterRowInput = document.createElement('INPUT');
  filterRowInput.setAttribute('type', 'number');
  filterRowInput.setAttribute('id', 'pageSize');
  filterRowInput.setAttribute('min', 1);
  filterRowInput.setAttribute('max', 1000);
  filterRowInput.setAttribute('value', 20);
  filterRowInput.setAttribute('style', 'width: 80px');
  const filterRowLabel = document.createElement('label');
  filterRowLabel.innerHTML = 'Page Size:&nbsp;'
  container1.append(filterRowLabel);
  container1.append(filterRowInput);

  const scrollDownVal = document.createElement('INPUT');
  scrollDownVal.setAttribute('type', 'number');
  scrollDownVal.setAttribute('id', 'scrollDownVal');
  scrollDownVal.setAttribute('style', 'width: 80px');
  const scrollDownLabel = document.createElement('label');
  scrollDownLabel.innerHTML = 'Scroll Down Page:&nbsp';
  scrollDownLabel.setAttribute('style', 'width: 110px');
  scrollDownLabel.setAttribute('id', 'scrollDownLabel');

  const container2 = document.createElement('span');
  container2.setAttribute('style', 'display: none');
  container2.setAttribute('id', 'scrollDownContainer');
  container2.append(scrollDownLabel);
  container2.append(scrollDownVal);

  const scrollUpVal = document.createElement('INPUT');
  scrollUpVal.setAttribute('type', 'number');
  scrollUpVal.setAttribute('id', 'scrollUpVal');
  scrollUpVal.setAttribute('style', 'width: 80px');
  const scrollUpLabel = document.createElement('label');
  scrollUpLabel.setAttribute('style', 'width: 110px');
  scrollUpLabel.innerHTML = 'Scroll Up Page:&nbsp';
  scrollUpLabel.setAttribute('id', 'scrollUpLabel');

  const container3 = document.createElement('span');
  container3.setAttribute('style', 'display: none');
  container3.setAttribute('id', 'scrollUpContainer');
  container3.append(scrollUpLabel);
  container3.append(scrollUpVal);

  var startScrollBtn = document.createElement('Button');
  startScrollBtn.innerHTML = 'Start Scrolling';
  startScrollBtn.setAttribute('id', 'startScrollBtn');
  startScrollBtn.style.display = 'none';
  startScrollBtn.addEventListener('click', startScroll);

  var scrollToEndBtn = document.createElement('Button');
  scrollToEndBtn.innerHTML = 'Scroll to End';
  scrollToEndBtn.setAttribute('id', 'scrollToEndBtn');
  scrollToEndBtn.style.display = 'none';
  scrollToEndBtn.addEventListener('click', scrollToEnd);

  parent.append(document.createElement('br'));
  parent.append(container1);
  parent.append(document.createElement('br'));
  parent.append(container2);
  parent.append(document.createElement('br'));
  parent.append(container3);
  parent.append(document.createElement('br'));
  parent.append(startScrollBtn);
  parent.append(scrollToEndBtn);
}