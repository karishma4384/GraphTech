/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/************************************************************************************************
 * * Suitelet **
 *  * To view the Customer Sales Summary Report **
 *  * GTIL-39 : Suitlet: Report View Customization
 *
 * **********************************************************************************************
 *
 * Author: Jobin & Jismi IT Services LLP
 *
 * Date Created : 23-February-2022
 *
 * Created By: Sandhra Simon,Jobin & Jismi IT Services LLP
 *
 * Description :
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/
define(['N/log', 'N/record', 'N/task', 'N/ui/serverWidget', 'N/util', 'N/url','./../Library/JJ CM NS Utility.js','./../Model/JJ CM Resolver Model GTIL-39.js','./../Templates/JJ CM Resolver Template GTIL-39.js'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{task} task
     * @param{serverWidget} serverWidget
     * @param{util} util
     * @param{url} url
     * @param{jjUtil} jjUtil
     * @param{modelResolver} modelResolver
     */
    (log, record, task, serverWidget, util, url,jjUtil, modelResolver,templateResolver) => {
        let fetchModel;
         let templateFetch;
        const PAGE_SIZE = 1000;
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        /**
         * To generate Date String on the format YYYY-MM-DD
         * @param {Date} dateObj - javascript Date Object
         */
        const generateDateString = function (dateObj) {
            return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
        };
        const form = {
            /**
             * to refer suitelet form object
             */
            formObj: null,
            /**
             * repository to refer all buttons
             */
            buttons: {},
            /**
             * repository to refer all body fields
             */
            bodyFields: {},
            /**
             * repository to refer all fieldgroups
             */
            fieldGroups: {},
            /**
             * repository to refer all sublists
             */
            subLists: {},
            // /**
            //  * repository to refer all parameters
            //  */
            // parameters: {},
            init(formObj) {
                this.formObj = formObj;
            },
            setformFieldProperty(field, propObj) {
                const setFieldProp = {
                    updateLayoutType: function (field, value) {
                        field.updateLayoutType({
                            layoutType: value
                        });
                    },
                    updateBreakType: function (field, value) {
                        field.updateBreakType({
                            breakType: value
                        });
                    },
                    updateDisplayType: function (field, value) {
                        field.updateDisplayType({
                            displayType: value
                        });
                    },
                    setHelpText: function (field, value) {
                        field.setHelpText({
                            help: value
                        });
                    },
                    isMandatory: function (field, value) {
                        field.isMandatory = value;
                    },
                    defaultValue: function (field, value) {
                        field.defaultValue = value;
                    }
                };
                for (let prop in propObj)
                    if (propObj[prop]) setFieldProp[prop](field, propObj[prop]);
            },
            setBodyButtons() {
                let formobj = form.formObj;
                //Download Button for CSV Export
                form.buttons.custpage_btn_export_gtil39 = formobj.addButton({
                    id: "custpage_btn_export_gtil39",
                    label: "Generate CSV",
                    functionName: "triggerCsvExport_gtil39",
                });

                //Button for Generating Pdf
                form.buttons.custpage_btn_pdf_gtil39 = formobj.addButton({
                    id: "custpage_btn_pdf_gtil39",
                    label: "Generate PDF",
                    functionName: "triggerExport_pdf"
                });
            },
            setBodyFields() {
                let formObj = form.formObj;
                //Inline HTML Field (Hidden)
                form.bodyFields.custpage_field_hidden_inlinehtml = formObj.addField({
                    id: 'custpage_field_hidden_inlinehtml',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Inline HTML'
                });
                form.setformFieldProperty(form.bodyFields.custpage_field_hidden_inlinehtml, {
                    setHelpText: "Inline HTML",
                    isMandatory: true,
                    defaultValue: `<script>
                    window.ns_screenfields_suiteletform = window.ns_screenfields_suiteletform || {};
                    window.ns_screenfields_suiteletform.suiteletFormUrl = "${url.resolveScript({
                        scriptId: 'customscript_jj_customersales_report',
                        deploymentId: 'customdeploy_jj_customersales_report',
                    })}";
                    </script>`
                });

                //First Field Group
                form.fieldGroups.custpage_group_report = formObj.addFieldGroup({
                    id: "custpage_group_report",
                    label: "Report"
                });
                //Report
                form.bodyFields.custpage_filter_report = formObj.addField({
                    id: "custpage_filter_report",
                    label: "Report",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_group_report",
                });

                form.bodyFields.custpage_filter_report.addSelectOption({
                    value: "Brand Sales Summary Report",
                    text: "Brand Sales Summary Report"
                });
                form.bodyFields.custpage_filter_report.addSelectOption({
                    value: "Brand Detail Report",
                    text: "Brand Detail Report"
                });
                form.bodyFields.custpage_filter_report.addSelectOption({
                    value: "Customer Sales Summary Report",
                    text: "Customer Sales Summary Report"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_report, {
                    setHelpText: 'Choose Report type.',
                    isMandatory: false,
                    defaultValue: exports.parameters?.custpage_filter_report || "Customer Sales Summary Report"
                });

                //Second Field Group
                form.fieldGroups.custpage_group_filter = formObj.addFieldGroup({
                    id: "custpage_group_filter",
                    label: "Filter"
                });
                //Customer
                form.bodyFields.custpage_filter_customer = formObj.addField({
                    id: "custpage_filter_customer",
                    label: "Customer",
                    type: serverWidget.FieldType.SELECT,
                    source: 'customlist_eb_channel',
                    container: "custpage_group_filter"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_customer, {
                    setHelpText: 'Choose Customer',
                    defaultValue: exports.parameters?.custpage_filter_customer || "2"
                });
                //Type of Report
                form.bodyFields.custpage_filter_type_of_report = formObj.addField({
                    id: "custpage_filter_type_of_report",
                    label: "Type of Report",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_group_filter"
                });
                form.bodyFields.custpage_filter_type_of_report.addSelectOption({
                    value: "ALL",
                    text: "All"
                });
                form.bodyFields.custpage_filter_type_of_report.addSelectOption({
                    value: "CustInvc",
                    text: "Invoice"
                });
                form.bodyFields.custpage_filter_type_of_report.addSelectOption({
                    value: "CustCred",
                    text: "Credit Memo"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_type_of_report,{
                    setHelpText: "Choose type of the report",
                    defaultValue: exports.parameters?.custpage_filter_type_of_report
                });

                //As Of Month
                let today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                form.bodyFields.custpage_filter_asofmonth = formObj.addField({
                    id: "custpage_filter_asofmonth",
                    label: "Current MONTH",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_group_filter"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_asofmonth, {
                    setHelpText: 'Choose month for the Report',
                    //isMandatory: true,
                    defaultValue: exports.parameters?.custpage_filter_asofmonth
                });
                months.forEach(month => {
                    //log.debug(month,months.indexOf(month));
                    form.bodyFields.custpage_filter_asofmonth.addSelectOption({
                        value: months.indexOf(month),
                        text: month,
                        //isSelected: true,
                    });
                });
                //As of Year
                form.bodyFields.custpage_filter_asofyear = formObj.addField({
                    id: "custpage_filter_asofyear",
                    label: "current Year",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_group_filter"
                });
                for(let year = currentYear + 1; year >= 2000;year--){
                    form.bodyFields.custpage_filter_asofyear.addSelectOption({
                        value: parseInt(year),
                        text: year.toString(),
                    });
                }
                form.setformFieldProperty(form.bodyFields.custpage_filter_asofyear, {
                    setHelpText: "Choose As of Year for the Report",
                    isMandatory: true,
                    defaultValue: parseInt(exports.parameters?.custpage_filter_asofyear) || parseInt(currentYear)
                });

                //Page Index
                form.bodyFields.custpage_filter_pageindex = formObj.addField({
                    id: "custpage_filter_pageindex",
                    label: "Page Index",
                    type: serverWidget.FieldType.SELECT,
                    container: "custpage_group_filter"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_pageindex, {
                    setHelpText: "Choose the index of the pages result",
                    isMandatory: false,
                    defaultValue: exports.parameters?.custpage_filter_pageindex || 1
                });


                //Third Field Group
                form.fieldGroups.custpage_group_reportdetails = formObj.addFieldGroup({
                    id: "custpage_group_reportdetails",
                    label: "Report Details"
                });

                //Customer in Report Details
                form.bodyFields.custpage_detail_customer = formObj.addField({
                    id: "custpage_detail_customerin",
                    label: "Customer",
                    type: serverWidget.FieldType.TEXT,
                    container: "custpage_group_reportdetails"
                });
                form.setformFieldProperty(form.bodyFields.custpage_detail_customer, {
                    updateDisplayType: serverWidget.FieldDisplayType.INLINE,
                    setHelpText: "The customer for which the report is being run",
                    defaultValue: exports.parameters?.custpage_filter_customer_formatted || "All"
                });
                //Type of Report
                form.bodyFields.custpage_detail_type_of_report = formObj.addField({
                    id: "custpage_detail_type_of_report",
                    label: "Type of Report",
                    type: serverWidget.FieldType.TEXT,
                    container: "custpage_group_reportdetails"
                });
                form.setformFieldProperty(form.bodyFields.custpage_detail_type_of_report,{
                    updateDisplayType: serverWidget.FieldDisplayType.INLINE,
                    setHelpText: "The type of report selected",
                    isMandatory: false,
                    defaultValue: exports.parameters?.custpage_filter_type_of_report_formatted || "All"
                });

                //As of month and year
                form.bodyFields.custpage_detail_asat = formObj.addField({
                    id: "custpage_detail_asat",
                    label: "As of Month & Year",
                    type: serverWidget.FieldType.TEXT,
                    container: "custpage_group_reportdetails"
                });
                let defaultValue;
                if(exports.parameters.custpage_filter_asofmonth && exports.parameters.custpage_filter_asofyear){
                    defaultValue = months[parseInt(exports.parameters?.custpage_filter_asofmonth)] + " " + parseInt(exports.parameters?.custpage_filter_asofyear);
                }else if(exports.parameters.custpage_filter_asofmonth && !exports.parameters.custpage_filter_asofyear){
                    defaultValue = months[parseInt(exports.parameters?.custpage_filter_asofmonth)] + " " + parseInt(currentYear) ;
                }else if(!exports.parameters.custpage_filter_asofmonth && exports.parameters.custpage_filter_asofyear){
                    defaultValue = months[currentMonth] + " " + parseInt(exports.parameters?.custpage_filter_asofyear);
                }else{
                    defaultValue = "January" + " " + parseInt(currentYear);
                }
                form.setformFieldProperty(form.bodyFields.custpage_detail_asat, {
                    updateDisplayType: serverWidget.FieldDisplayType.INLINE,
                    setHelpText: "Selected Month and year",
                    // isMandatory: true,
                    defaultValue: defaultValue
                });
                //Page Length
                form.bodyFields.custpage_filter_pagelength = formObj.addField({
                    id: "custpage_filter_pagelength",
                    label: "Page Length",
                    type: serverWidget.FieldType.INTEGER,
                    container: "custpage_group_reportdetails"
                });
                form.setformFieldProperty(form.bodyFields.custpage_filter_pagelength, {
                    updateDisplayType: serverWidget.FieldDisplayType.INLINE,
                    setHelpText: "Total length of Search Pages",
                    isMandatory: false,
                });
                //Report in Report Details
                form.bodyFields.custpage_detail_report = formObj.addField({
                    id: "custpage_detail_report",
                    label: "Report",
                    type: serverWidget.FieldType.TEXT,
                    container: "custpage_group_reportdetails"
                });
                form.setformFieldProperty(form.bodyFields.custpage_detail_report, {
                    updateDisplayType: serverWidget.FieldDisplayType.INLINE,
                    setHelpText: "Selected report type",
                    isMandatory: false,
                    defaultValue: exports.parameters?.custpage_filter_report_formatted || "Customer Sales Summary Report"
                });
            },
            // /**
            //  * To set the parameter values
            //  */
            // getParameters(){
            //     parameters.customerFromUrl = form.request.parameters.custpage_filter_customer;
            // },
            /**
             * To set the sublist in the Suitelet form
             */
            setSublistFields() {
                form.subLists.custpage_sublist_report = form.formObj.addSublist({
                    id: "custpage_sublist_report",
                    type: serverWidget.SublistType.LIST,
                    label: "Customer Sales Summary Report"
                });
                const columnMap = {
                    "Channel": {
                        "id": "custpage_month", "label": "Customer", "type": serverWidget.FieldType.TEXTAREA
                    },
                    "currentYear": {
                        "id": "custpage_year", "label": "Current Year", "type": serverWidget.FieldType.TEXT
                    },
                    "totalSales": {
                        "id": "custpage_totalsales", "label": "% of Total Sales", "type": serverWidget.FieldType.TEXT
                    },
                    "previousYear": {
                        "id": "custpage_previousyear", "label": "Previous Year", "type": serverWidget.FieldType.TEXT
                    },
                    "percentage_preyear": {
                        "id": "custpage_percent", "label": "% of Previous Year", "type": serverWidget.FieldType.TEXT
                    },
                    "change_OverYear": {
                        "id": "custpage_changeoveryear",
                        "label": "Change Over Prev Year",
                        "type": serverWidget.FieldType.TEXT,
                    },
                };
                for (let column in columnMap){
                    form.subLists.custpage_sublist_report.addField({
                        id: columnMap[column].id,
                        label: columnMap[column].label,
                        type: columnMap[column].type,
                        align: serverWidget.LayoutJustification.LEFT
                    });
                        //var channelCategoryLink = `<a target ="_blank" href="/app/common/search/searchresults.nl?searchtype=Transaction&CUSTBODY_EB_CHANNELtype=ANYOF&CUSTBODY_EB_CHANNEL=${columnMap[channel]}&detail=CUSTBODY_EB_CHANNEL&detailname=${columnMap.Channel}">${columnMap.Channel}</a>`;
                }
                let savedSearchConfigParam = {
                    filterConfig: {
                        report:     exports.parameters?.custpage_filter_report ? exports.parameters?.custpage_filter_report : "Customer Sales Summary Report",
                        customer:   exports.parameters?.custpage_filter_customer ? exports.parameters?.custpage_filter_customer : "ALL",
                        reportType: exports.parameters?.custpage_filter_type_of_report ? exports.parameters?.custpage_filter_type_of_report : "ALL",
                        asOfMonth:  exports.parameters?.custpage_filter_asofmonth ? exports.parameters?.custpage_filter_asofmonth: "0",
                        asOfYear:   exports.parameters?.custpage_filter_asofyear ? parseInt(exports.parameters?.custpage_filter_asofyear): new Date().getFullYear(),
                    },
                    searchConfig: {
                        PAGE_INDEX: Number(exports.parameters?.custpage_filter_pageindex || 1),
                        PAGE_SIZE: PAGE_SIZE
                    }
                };
                log.debug('savedSearchPDF', savedSearchConfigParam);
                const modelSavedSearchResult = fetchModel.models.fetchChannel(savedSearchConfigParam);
                // log.debug('modelSavedSearchResult', modelSavedSearchResult);
                form.setformFieldProperty(form.bodyFields.custpage_filter_pagelength, {
                    defaultValue: modelSavedSearchResult.lines.length > 0 ? modelSavedSearchResult?.pageInfo?.pageLength : 0
                });

                for (let index = 1, len = modelSavedSearchResult?.pageInfo?.pageLength; index <= len; index++) {
                    form.bodyFields.custpage_filter_pageindex.addSelectOption({
                        value: index,
                        text: index + ' of ' + len,
                    });
                }
                log.debug("modelSavedSearchResult", modelSavedSearchResult);
                let summaryLine = modelSavedSearchResult.lines.reduce((acc, el) => {
                    for (let key in acc) {
                        acc[key].value = Number(acc[key].value) + Number(el?.[key].value || 0);
                        acc[key].value = jjUtil.fixFloat(acc[key].value, 2);
                    }
                    return acc;
                }, {
                    "currentYear": {"value": "0", "text": null},
                    "totalSales": {"value": "100%", "text": "100%"},
                    "previousYear": {"value": "0", "text": null},
                    "percentage_preyear": {"value": "100%", "text": "100%"},
                    "change_OverYear": {"value": "0", "text": null},
                });
                modelSavedSearchResult.lines.push({
                    "Channel": {"value": "SUMMARY", "text": null},
                    ...summaryLine
                })

                if (modelSavedSearchResult.lines.length) {
                    for (let index = 0, len = modelSavedSearchResult.lines.length; index < len; index++)
                        for (let key in columnMap)
                            form.subLists.custpage_sublist_report.setSublistValue({
                                id: columnMap[key].id,
                                line: index,
                                value: index == len ?
                                    (jjUtil.assignDefaultValue(modelSavedSearchResult.lines[index][key]?.text, modelSavedSearchResult.lines[index][key]?.value) || '---') :
                                    (jjUtil.assignDefaultValue(modelSavedSearchResult.lines[index][key]?.text, modelSavedSearchResult.lines[index][key]?.value) || ' ')
                            });
                }
            },
            generateForm(){
                log.debug("generateForm", "generateForm");
                //Initialize Suitelet Form
                form.init(serverWidget.createForm({
                    title: "Customer Sales Summary Report"
                }));

                //Associate Client Script with Suitelet
                form.formObj.clientScriptModulePath = "./JJ CS Customer Sales Summary Report GTIL-39.js";

                //Set Body Buttons
                form.setBodyButtons();

                //Set Body Fields
                form.setBodyFields();

                //Set Sublist Fields
                form.setSublistFields();

                // //Get parameters
                // form.getParameters();
                return this.formObj;
            }
        };

        const exports = {
            context: "",
            method: "",
            parameters: {
                custpage_filter_report: "",
                custpage_filter_customer: "",
                custpage_filter_type_of_report: "",
                custpage_filter_asofmonth: "",
                custpage_filter_asofyear: "",
                custpage_filter_pageindex: "",
                custpage_filter_report_formatted: "",
                custpage_filter_customer_formatted: "",
                custpage_filter_type_of_report_formatted: "",
                pdfDownloaded: false,
            },
            body: "",
            /**
             * To initialise the
             * @param {Object} scriptContext
             * @param {ServerRequest} scriptContext.request - Incoming request
             * @param {ServerResponse} scriptContext.response - Suitelet response
             * @since 2015.2
             */
            init(scriptContext) {
                this.context = scriptContext;
                this.method = scriptContext.request.method;
                this.parameters = scriptContext.request.parameters;
                this.body = scriptContext.request.body;
            },
           pdfDownloaded() {
                fetchModel = modelResolver.modelFetch('GRAPH_TECH_REPORT');
                let savedSearchConfigParam = {
                    filterConfig: {
                        report:     exports.parameters?.custpage_filter_report ? exports.parameters?.custpage_filter_report : "Customer Sales Summary Report",
                        customer:   exports.parameters?.custpage_filter_customer ? exports.parameters?.custpage_filter_customer : "ALL",
                        reportType: exports.parameters?.custpage_filter_type_of_report ? exports.parameters?.custpage_filter_type_of_report : "ALL",
                        asOfMonth:  exports.parameters?.custpage_filter_asofmonth ? exports.parameters?.custpage_filter_asofmonth: "0",
                        asOfYear:   exports.parameters?.custpage_filter_asofyear ? parseInt(exports.parameters?.custpage_filter_asofyear): new Date().getFullYear(),
                    },
                    searchConfig: {
                        PAGE_INDEX: Number(exports.parameters?.custpage_filter_pageindex || 1),
                        PAGE_SIZE: PAGE_SIZE
                    }
                };
                log.debug('savedSearchPDF', savedSearchConfigParam);
                const modelSavedSearchResult = fetchModel.models.runSearch(savedSearchConfigParam);
                log.debug('modelSavedSearchResult', modelSavedSearchResult);
                templateFetch = templateResolver.templateFetch('CUSTOMER SALES REPORT PDF');
                let renderObj = templateFetch.templateRender.init();

                templateFetch.templateRender.addCustomDataSource(renderObj, {
                    header: {

                        asOfYear:   exports.parameters?.custpage_filter_asofyear ? parseInt(exports.parameters?.custpage_filter_asofyear): new Date().getFullYear(),
                        asOfMonth:  exports.parameters?.custpage_filter_asofmonth ? exports.parameters?.custpage_filter_asofmonth:"0",

                    },
                    lines: modelSavedSearchResult.lines,
                    summary: {}
                });
                let objPdfFile = templateFetch.templateRender.renderAsExcel(renderObj, {filename: ''});
                return {
                    status: "EXPORT_SUCCESS",
                    value: objPdfFile
                };
            },
            toBeCsvDownloaded() {
                fetchModel = modelResolver.modelFetch('GRAPH_TECH_REPORT');
                let savedSearchConfigParam = {
                    filterConfig: {
                        report:     exports.parameters?.custpage_filter_report ? exports.parameters?.custpage_filter_report : "Customer Sales Summary Report",
                        customer:   exports.parameters?.custpage_filter_customer ? exports.parameters?.custpage_filter_customer : false,
                        reportType: exports.parameters?.custpage_filter_type_of_report ? exports.parameters?.custpage_filter_type_of_report :false,
                        asOfMonth:  exports.parameters?.custpage_filter_asofmonth ? exports.parameters?.custpage_filter_asofmonth: "0",
                        asOfYear:   exports.parameters?.custpage_filter_asofyear ? parseInt(exports.parameters?.custpage_filter_asofyear): new Date().getFullYear(),

                    },
                    searchConfig: {
                        PAGE_INDEX: Number(exports.parameters?.custpage_filter_pageindex || 1),
                        PAGE_SIZE: PAGE_SIZE
                    }
                };
                log.debug('savedSearchConfigParam', savedSearchConfigParam);
                const modelSavedSearchResult = fetchModel.models.runSearch(savedSearchConfigParam);
                log.debug('modelSavedSearchResult', modelSavedSearchResult);
                templateFetch = templateResolver.templateFetch('CUSTOMER_SALES_CSV_REPORT');
                let renderObj = templateFetch.templateRender.init();

                templateFetch.templateRender.addCustomDataSource(renderObj, {
                    header: {
                        asOfMonth:  exports.parameters?.custpage_filter_asofmonth ? exports.parameters?.custpage_filter_asofmonth: "0",
                        asOfYear:   exports.parameters?.custpage_filter_asofyear ? parseInt(exports.parameters?.custpage_filter_asofyear): new Date().getFullYear(),
                    },
                    lines: modelSavedSearchResult.lines,
                    summary: {}
                });
                let objXlsFile = templateFetch.templateRender.renderAsCSV(renderObj, {filename: ''});
                return {
                    status: "EXPORT_SUCCESS",
                    value: objXlsFile
                };
            },

            /**
             * Defines the Suitelet script trigger point.
             * @param {Object} scriptContext
             * @param {ServerRequest} scriptContext.request - Incoming request
             * @param {ServerResponse} scriptContext.response - Suitelet response
             * @returns {Boolean}
             * @since 2015.2
             */
            onRequest(scriptContext){
                try{
                    //Initialize Suitelet
                    exports.init(scriptContext);
                    if (this.method == "POST") {
                        log.debug('exports.parameters', exports.parameters);
                        if (exports.parameters.pdfDownloaded == 'true') {
                            let handleExportRequest = exports.pdfDownloaded();
                            if (handleExportRequest && handleExportRequest.status == 'EXPORT_SUCCESS') {
                                return exports.context.response.writeFile({
                                    file: handleExportRequest.value
                                }), false;
                            }
                        }else {
                            /*exports.context.response.setHeader({
                                name: 'responseString',
                                value: 'SOMETHING_WENT_WRONG',
                            });*/
                            return exports.context.response.write("SOMETHING_WENT_WRONG"), false;
                        }

                    }
                    if(this.method == "GET") {
                        fetchModel = modelResolver.modelFetch('GRAPH_TECH_REPORT');
                        const suiteletForm = form.generateForm();
                        log.debug('suiteletForm', suiteletForm)
                        if (suiteletForm)
                            return exports.context.response.writePage(suiteletForm), true;
                        return exports.context.response.write("SOMETHING_WENT_WRONG_CUSTOMER_SALES _SUMMARY_REPORT"), false;
                    }
                    return exports.context.response.write("SOMETHING_WENT_WRONG_CUSTOMER_SALES _SUMMARY_REPORT"), false;
                }catch (err) {
                    log.error('err@suiteletForm', err);
                    return exports.context.response.write("SOMETHING_WENT_WRONG_CUSTOMER_SALES _SUMMARY_REPORT"), false;
                }
            }
        };
        return exports;
    });


