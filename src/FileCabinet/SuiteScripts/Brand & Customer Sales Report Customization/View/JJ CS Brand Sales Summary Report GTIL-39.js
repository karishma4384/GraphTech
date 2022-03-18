/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/************************************************************************************************
 * * ClientScript **
 *  * To view the Brand Sales Summary Report
 *  * GTIL-39 :  Graph Tech Report
 *
 * **********************************************************************************************
 *
 * Author:
 *
 * Date Created : 25-January-2022
 *
 * Created By: Sandhra Simon
 *
 * Description :
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/
define(['N/currentRecord', 'N/ui/message','N/url'],
    /**
     * @param{currentRecord} currentRecord
     * @param{message} message
     * @param{record} url
     */
    function (currentRecord, message,url){

        var recordObj;

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            recordObj = currentRecord.get();
            // window.onbeforeunload = function () {
            //     return "";
            // };
            // window.onbeforeunload = null;
            // window.addEventListener('beforeunload', function (event) {
            //     // Cancel the event as stated by the standard.
            //     event.preventDefault();
            //     // Chrome requires returnValue to be set.
            //     event.returnValue = '';
            // });
            //return true;
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
                if(scriptContext.fieldId === 'custpage_filter_report') {
                    var typeOfReport = scriptContext.currentRecord.getValue({
                        fieldId: 'custpage_filter_report'
                    });
                    console.log("Report type is", typeOfReport);
                    if (typeOfReport === 'Brand Detail Report') {
                       var  brandDetailReportSuiteletUrl = url.resolveScript({
                            scriptId: 'customscript_jj_brand_detail_report',
                            deploymentId: 'customdeploy_jj_brand_detail_report',
                        });
                        console.log("suiteletUrl",brandDetailReportSuiteletUrl);
                        return window.location.href = brandDetailReportSuiteletUrl,true;
                    }else if(typeOfReport === 'Customer Sales Summary Report'){
                        var customerSalesReportSuiteletUrl = url.resolveScript({
                            scriptId: 'customscript_jj_customersales_report',
                            deploymentId: 'customdeploy_jj_customersales_report',
                        });
                        console.log("suiteletUrl",customerSalesReportSuiteletUrl);
                       return  window.location.href = customerSalesReportSuiteletUrl,true;
                    }else if(typeOfReport === 'Brand Sales Summary Report'){
                        var brandReportSuiteletUrl = url.resolveScript({
                            scriptId: 'customscript_jj_brand__summary_report',
                            deploymentId: 'customdeploy_jj_brand__summary_report',
                        });
                        console.log("suiteletUrl",brandReportSuiteletUrl);
                        return  window.location.href = brandReportSuiteletUrl,true;
                    }
                    }
            if([
                'custpage_filter_brand',
                //'custpage_filter_report',
                'custpage_filter_salesrep',
                'custpage_filter_type_of_report',
                'custpage_filter_asofmonth',
                'custpage_filter_asofyear',
                'custpage_filter_pageindex'
               ].indexOf(scriptContext.fieldId)>-1)
                triggerSearch_js39({
                    custpage_filter_pageindex : 1
                });
            else
               // triggerSearch_gtil39({});
            return true;
        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {
            return true;

        }
        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
            return true;
        }
        /**
         * To set URL Parameters for filtering and pagination
         * @param{Object} defaultParam - To override values to parameter
         * @param{Boolean} doNotNavigate - Do not navigate the page, instead send back the URL
         * @returns {boolean}
         */
        function triggerSearch_js39(defaultParam, doNotNavigate) {
            var paramObj = {
                custpage_filter_report: recordObj.getValue({fieldId: 'custpage_filter_report'}),
                custpage_filter_brand: recordObj.getValue({fieldId: 'custpage_filter_brand'}),
                custpage_filter_salesrep: recordObj.getValue({fieldId: 'custpage_filter_salesrep'}),
                custpage_filter_type_of_report: recordObj.getValue({fieldId: 'custpage_filter_type_of_report'}),
                custpage_filter_asofmonth: recordObj.getValue({fieldId: 'custpage_filter_asofmonth'}),
                custpage_filter_asofyear: recordObj.getValue({fieldId: 'custpage_filter_asofyear'}),
                custpage_filter_pageindex: recordObj.getValue({fieldId: 'custpage_filter_pageindex'})

            };
            for (var key in paramObj) {
                if (!paramObj[key]) {
                    alert("Fill all the mandatory fields");
                    return false;
                }
            }
            paramObj = Object.assign(paramObj, defaultParam);
            console.log('paramObj', paramObj);


            paramObj.custpage_filter_report_formatted = recordObj.getText({fieldId: 'custpage_filter_report'});
            paramObj.custpage_filter_brand_formatted = recordObj.getText({fieldId: 'custpage_filter_brand'});
            paramObj.custpage_filter_salesrep_formatted = recordObj.getText({fieldId: 'custpage_filter_salesrep'});
            paramObj.custpage_filter_type_of_report_formatted = recordObj.getText({fieldId: 'custpage_filter_type_of_report'});
            paramObj.custpage_filter_month_formatted = recordObj.getText({fieldId: 'custpage_filter_asofmonth'});
            paramObj.custpage_filter_asofyear_formatted = recordObj.getText({fieldId: 'custpage_filter_asofyear'});


            console.log('paramObj', JSON.stringify(paramObj));
            var urlparam = '';
            for (var key in paramObj)
                urlparam += '&' + key + '=' + paramObj[key];

            console.log('  window.location.href', {
                origin: window.location.origin,
                suiteletFormUrl: window.ns_screenfields_suiteletform.suiteletFormUrl,
                urlparam: urlparam,
                fullText: window.location.origin + window.ns_screenfields_suiteletform.suiteletFormUrl + urlparam

            });
            var generatedURL = window.location.origin + window.ns_screenfields_suiteletform.suiteletFormUrl + urlparam;
            if (doNotNavigate)
                return generatedURL;
            else
                return window.location.href = generatedURL, true;
        }
        function triggerExport_pdf() {
            console.log("triggerexport entered");
            var paramObj = {
                custpage_filter_report: recordObj.getValue({fieldId: 'custpage_filter_report'}),
                custpage_filter_brand: recordObj.getValue({fieldId: 'custpage_filter_brand'}),
                custpage_filter_salesrep: recordObj.getValue({fieldId: 'custpage_filter_salesrep'}),
                custpage_filter_type_of_report: recordObj.getValue({fieldId: 'custpage_filter_type_of_report'}),
                custpage_filter_asofmonth: recordObj.getValue({fieldId: 'custpage_filter_asofmonth'}),
                custpage_filter_asofyear: recordObj.getValue({fieldId: 'custpage_filter_asofyear'}),
                custpage_filter_pageindex: recordObj.getValue({fieldId: 'custpage_filter_pageindex'})
            };
            for (var key in paramObj) {
                if (!paramObj[key]) {
                    alert("Fill all the mandatory fields");
                    return false;
                }
            }

            var pageLength = recordObj.getValue({fieldId: 'custpage_filter_pagelength'});
            if (pageLength == 0)
                return alert('There is no data to download'), false;
            else {
                message.create({
                    title: 'REPORT EXPORT',
                    message: 'Please wait and do not navigate while we prepare the export',
                    type: message.Type.CONFIRMATION
                }).show({
                    duration: 15000 // will disappear after 15s
                });
                for (var index = 1; index <= pageLength; index++) {
                    (function (iNum, uniqueUrl) {
                        console.log(iNum, uniqueUrl);
                        fetch(uniqueUrl, {
                            method: 'POST',
                            headers: {
                                //  'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({}),
                        }).then(function (response) {
                            console.log('response', response);
                            return response.blob();
                        }).then(function (blob) {
                            console.log(blob);
                            var url = window.URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = url;
                            a.download = /*subsidiary + "-" +*/ iNum + "-" + (Date.now() / 1000) + ".PDF";
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                        });
                    })(index, triggerSearch_js39({
                        custpage_filter_pageindex: index,
                        pdfDownloaded: true,

                    }, true));
                    //break;
                }
            }


            return true;
        }
        function triggerCsvExport_gtil39(){
            var paramObj = {
                custpage_filter_report: recordObj.getValue({fieldId: 'custpage_filter_report'}),
                custpage_filter_brand: recordObj.getValue({fieldId: 'custpage_filter_brand'}),
                custpage_filter_salesrep: recordObj.getValue({fieldId: 'custpage_filter_salesrep'}),
                custpage_filter_type_of_report: recordObj.getValue({fieldId: 'custpage_filter_type_of_report'}),
                custpage_filter_asofmonth: recordObj.getValue({fieldId: 'custpage_filter_asofmonth'}),
                custpage_filter_asofyear: recordObj.getValue({fieldId: 'custpage_filter_asofyear'}),
                custpage_filter_pageindex: recordObj.getValue({fieldId: 'custpage_filter_pageindex'})

            };
            for (var key in paramObj) {
                if (!paramObj[key]) {
                    alert("Fill all the mandatory fields");
                    return false;
                }
            }

            var pageLength = recordObj.getValue({fieldId: 'custpage_filter_pagelength'});
            if (pageLength == 0) {
                return alert('There is no data to download');
            }else {
                message.create({
                    title: 'REPORT EXPORT',
                    message: 'Please wait and do not navigate while we prepare the export',
                    type: message.Type.CONFIRMATION
                }).show({
                    duration: 15000 // will disappear after 15s
                });
                for (var index = 1; index <= pageLength; index++) {
                    (function (iNum, uniqueUrl) {
                        console.log(iNum, uniqueUrl);
                        fetch(uniqueUrl, {
                            method: 'POST',
                            headers: {
                                //  'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({}),
                        }).then(function (response) {
                            console.log('response', response);
                            return response.blob();
                        }).then(function (blob) {
                            console.log(blob);
                            var url = window.URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = url;
                            a.download = iNum + "-" + (Date.now() / 1000) + ".xls";
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                        });
                    })(index, triggerSearch_js39({
                        custpage_filter_pageindex: index,
                        toBeCsvDownloaded: true,
                    }, true));
                    //break;
                }
            }

            return true;



        }

        /**
         * To generate Date String on the format YYYY-MM-DD
         * @param {Date} dateObj - javascript Date Object
         */
        function generateDateString(dateObj) {
            return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateField: validateField,
            saveRecord: saveRecord,
            triggerSearch_js39:triggerSearch_js39,
            generateDateString: generateDateString,
            triggerExport_pdf: triggerExport_pdf,
            triggerCsvExport_gtil39:triggerCsvExport_gtil39
        };

});
