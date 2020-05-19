
import {
    initialize, startTimer, endTimer, sendIt,
    createFilterView,
} from '../util/ComponentHelper.js';
import { baseURL } from '../util/config.js';

class WebixFilteredComponent extends HTMLElement {
    connectedCallback() {
        let gridToTest = null;
        this.formstate = "hide";
        this.product = "webix";
        this.testname = "client filter";
        this.name = "Webix filtered Test"
        this.summary = `This test will display performance of the Webix Client Renderering.`
        this.isOnFilterClick = false;
        initialize(this);
        this.cleartest.addEventListener('click', (event) => {
            if (this.gridToTest) {
                this.gridToTest.destructor();
            }
            this.gridToTest = null;
            
            if (document.getElementById("target")) {
                this.parent.removeChild(document.getElementById("target"));
            }
        });
        this.starttest.addEventListener('click', (event) => {
            if (!this.gridToTest) {
                this.runGridTest()
            }
        });

        createFilterView(this.parent);
    }

    runGridTest() {
        const container2 = document.createElement('div');
        container2.setAttribute('id', 'target');
        this.parent.append(container2);
        let me = this;

        const url = `${baseURL}api/rawData/getAllData?tableName=${window.tableName}`
        webix.ajax(url).then(res => res.json()).then(data => {
            me.gridToTest = new webix.ui({
                container: document.getElementById("target"),
                view: "datatable",
                overflow: 'hidden',
                id: "table",
                css:"webix_data_border webix_header_border",
                resizeColumn:true, resizeRow:true,
                fixedRowHeight:false, rowLineHeight:25, rowHeight:75,  
                scrollX:false,
                columns: [
                    { id: 'id', header: 'Id', width: 120 },
                    { id: 'firstname', header: ['First Name', { content: "textFilter" }], width: 80 },
                    { id: 'lastname', header: 'Last Name', width: 80 },
                    { id: 'address', header: 'Address', width: 130 },
                    { id: 'company', header: 'Company', width: 120 },
                    { id: 'title', header: 'Title', width: 120 }
                ],
                height: 380,
                width: 660,
                data: data.users,
            });
            me.gridToTest.data.attachEvent("onBeforeFilter", function () {
                if (document.getElementsByClassName("webix_ss_filter")[0].children[0].value) {
                    me.isOnFilterClick = true;
                    startTimer(me);
                }
            });
            me.gridToTest.data.attachEvent("onAfterFilter", function () {
                if (me.isOnFilterClick && document.getElementsByClassName("webix_ss_filter")[0].children[0].value) {
                    const milliseconds = endTimer(me)
                    const testJSON = {
                        product: me.product,
                        testname: me.testname,
                        milliseconds: milliseconds,
                    }
                    sendIt(me.product, me.testname, testJSON, milliseconds);
                    me.isOnFilterClick = false;
                }
            });
            me.gridToTest.resize();
        });

    }
    disconnectedCallback() {
        this.gridToTest = null;
    }
}
customElements.define("z-webix-filter", WebixFilteredComponent);