/**
 * @NApiVersion 2.1
 */
/************************************************************************************************
 * * Model for Graph Tech Report**
 *
 *
 * **********************************************************************************************
 *
 * Author: Graph Tech Innovations Ltd
 *
 * Date Created : 24-February-2022
 *
 * Created By: Sandhra Simon
 *
 * Description : Model
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/
define(['N/search', 'N/util', '../Library/JJ CM NS Utility.js'],
    /**
     * @param{search} search
     * @param{util} util
     * @param{jjUtil} jjUtil
     */
    (search, util, jjUtil) => {

        const models = {
                /**
                 * To run saved search to fetch the model
                 * @param {Object} param
                 * @param {Object} param.filterConfig
                 * @param {Object} param.searchConfig
                 * @returns {[]|Object[]}
                 */
                runSearch({
                              filterConfig = {},
                              searchConfig = {}
                          }) {
                    let filters = [];
                    log.debug("filterConfig",filterConfig);
                    if(filterConfig?.brand)
                        filters.push("AND", ["class", "anyof",filterConfig?.brand]);
                    if(filterConfig?.salesRep)
                        filters.push("AND", ["salesrep","anyof",filterConfig?.salesRep]);
                    if(filterConfig.reportType == "ALL"){
                        filters.push("AND",["type","anyof",["CustInvc","CustCred"]]);
                    } else if(filterConfig?.reportType){
                        filters.push("AND", ["type", "anyof", filterConfig?.reportType]);
                    }
                    // if(filterConfig?.asOfMonth || filterConfig?.asOfYear) {
                    //     filters.push("AND", [`formulanumeric: CASE WHEN TO_CHAR({trandate},'YYYY') = '${filterConfig?.asOfYear}' AND TO_CHAR({trandate},'MM') = '${filterConfig?.asOfMonth}' THEN 1 ELSE 0 END`, "equalto", "1"])
                    // }
                        var brandReportSearchObj = search.create({
                        type: "transaction",
                        filters:
                            [
                                ["type","anyof","CustInvc","CustCred"],
                                "AND",
                                ["mainline","is","F"],
                                "AND",
                                ["shipping","is","F"],
                                "AND",
                                ["cogs","is","F"],
                                "AND",
                                ["taxline","is","F"],
                                "AND",
                                ["formulanumeric: CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END","isnotempty","1"],
                                "AND",
                                ["formulanumeric: CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END","isnotempty","1"],
                                "AND",
                                ["salesrep","anyof","@ALL@"],
                                ...filters
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "class",
                                    summary: "GROUP",
                                    label: "currentMonth"
                                }),
                                search.createColumn({
                                    name: "formulacurrency",
                                    summary: "SUM",
                                    formula: "CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END",
                                    //label: "This Month This Year Amount",
                                    label: "currentYear"
                                }),
                                search.createColumn({
                                    name: "formulapercent",
                                    summary: "MAX",
                                    formula: "SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)",
                                    label: "totalSales",
                                    function: "percentOfTotal"
                                }),
                                search.createColumn({
                                    name: "formulacurrency",
                                    summary: "SUM",
                                    formula: "CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END",
                                    //label: "This Month Last Year Amount",
                                    label: "previousYear"
                                }),
                                search.createColumn({
                                    name: "formulapercent",
                                    summary: "MAX",
                                    formula: "SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END)",
                                    label: "percentage_preyear",
                                    function: "percentOfTotal"
                                }),
                                search.createColumn({
                                    name: "formulapercent",
                                    summary: "MAX",
                                    formula: "NVL(((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100), 0)",
                                    //formula: "((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100)",
                                    label: "change_OverYear",
                                }),
                            ]
                    });
                    var brandReportResultCount = brandReportSearchObj.runPaged().count;
                    log.debug("brandReportSearchObj result count", brandReportResultCount);
                    return jjUtil.dataSets.iterateSavedSearch({
                        searchObj: brandReportSearchObj,
                        columns: jjUtil.dataSets.fetchSavedSearchColumn(brandReportSearchObj, 'label'),
                        ...searchConfig
                    });
                },
            /**
             * List  all active brand/materials
             * @param {Object} param
             * @param {Object} param.filterConfig
             * @param {Object} param.searchConfig
             * @returns {[]|Object[]}
             */
            fetchBrand({
                           filterConfig = {},
                           searchConfig = {}
                       }) {
                var brandSearchObj = search.create({
                    type: "classification",
                    filters:
                        [
                            ["isinactive", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "internalid",
                                sort: search.Sort.ASC,
                                label: "InternalID"
                            }),
                            search.createColumn({name: "name", label: "Name"}),
                        ]
                });
                var brandResultCount = brandSearchObj.runPaged().count;
                log.debug("brandSearchObj result count", brandResultCount);
                return jjUtil.dataSets.iterateSavedSearch({
                    searchObj: brandSearchObj,
                    columns: jjUtil.dataSets.fetchSavedSearchColumn(brandSearchObj, 'label'),
                    ...searchConfig
                });
            },
            /**
             * List of Sale rep
             */
            fetchSaleRep({
                           filterConfig = {},
                           searchConfig = {}
                       }) {
                        var employeeSearchObj = search.create({
                            type: "employee",
                            filters:
                                [
                                    ["formulatext: CASE WHEN {issalesrep} = 'T' THEN 1 ELSE 0 END", "is", "1"]
                                ],
                            columns:
                                [
                                    search.createColumn({
                                        name: "entityid",
                                        sort: search.Sort.ASC,
                                        label: "ID"
                                    }),
                                    search.createColumn({name: "altname", label: "Name"}),
                                    search.createColumn({name: "internalid", label: "InternalID"})
                                ]
                        });
                        var salesRepResultCount = employeeSearchObj.runPaged().count;
                        log.debug("employeeSearchObj result count", salesRepResultCount);
                        return jjUtil.dataSets.iterateSavedSearch({
                            searchObj: employeeSearchObj,
                            columns: jjUtil.dataSets.fetchSavedSearchColumn(employeeSearchObj, 'label'),
                            ...searchConfig
                        });

            },
            /**
             * Search for Customer Sales Summary Report
             */
            fetchChannel({
                             filterConfig = {},
                             searchConfig = {}
                         }){
                let filters = [];
                log.debug("filterConfig",filterConfig);
                if(filterConfig?.customer)
                    filters.push("AND",["custbody_eb_channel","anyof",filterConfig?.customer]);
                if(filterConfig?.asOfMonth)
                    filters.push("AND", [`formulanumeric: CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END`,"isnotempty","1"]);
                if(filterConfig.reportType == "ALL"){
                    filters.push("AND",["type","anyof",["CustInvc","CustCred"]]);
                } else if(filterConfig?.reportType){
                    filters.push("AND", ["type", "anyof", filterConfig?.reportType]);
                }
                var channelSearchObj = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["type","anyof","CustInvc","CustCred"],
                            "AND",
                            ["custbody_eb_channel","anyof","2","3","5","4","6","7","12","8","9","10","11"],
                            "AND",
                            ["mainline","is","F"],
                            "AND",
                            ["shipping","is","F"],
                            "AND",
                            ["cogs","is","F"],
                            "AND",
                            ["taxline","is","F"],
                            "AND",
                            ["formulanumeric: CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END","isnotempty","1"],
                            "AND",
                            ["formulanumeric: CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END","isnotempty","1"],
                            ...filters
                        ],
                    columns:
                        [
                            // search.createColumn({
                            //     name: "custbody_eb_channel",
                            //     summary: "GROUP",
                            //     label: "Channel"
                            // }),
                            search.createColumn({
                                name: "formulatext",
                                summary: "GROUP",
                                formula: " '<A href=\"/app/common/search/searchresults.nl?searchtype=Transaction&CUSTBODY_EB_CHANNEL='||{custbody_eb_channel.id}||'&style=NORMAL&report=&grid=&searchid=263&dle=&sortcol=Transction_ORDTYPE9_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=50&_csrf=m2ZyxrvdeZaGKs6G0ZDvLGFRVVnYdy34OOLR0AxykQWEgikeJ0RT6ckndCBYiMZGRhEZ52jOXuIhgsl_ptByOV6YjRAu0wtGa9us_042LM4Na_bG5ZFfHNlg9GR2KJUD9OWldyt2xN4TQJCToX0owEg7uONP5jsvGxpHKU03fTE%3D&twbx=F\">'||{custbody_eb_channel}||'</A>'",
                                label: "Channel"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END",
                                //label: "This Month This Year Amount",
                                label: "currentYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)",
                                label: "totalSales",
                                function: "percentOfTotal"
                            }),
                            search.createColumn({
                                name: "formulanumeric",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END",
                                //label: "This Month Last Year Amount",
                                label: "previousYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END)",
                                label: "percentage_preyear",
                                function: "percentOfTotal"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "NVL(((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100), 0)",
                                //formula: "((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100)",
                                label: "change_OverYear",
                            }),
                        ]
                });
                var channelSearchResultCount = channelSearchObj.runPaged().count;
                log.debug("invoiceSearchObj result count",channelSearchResultCount);
                return jjUtil.dataSets.iterateSavedSearch({
                    searchObj: channelSearchObj,
                    columns: jjUtil.dataSets.fetchSavedSearchColumn(channelSearchObj, 'label'),
                    ...searchConfig
                });
            },
            /**
             * Search for Brand Detail Report
             */
            fetchDetail({
                             filterConfig = {},
                             searchConfig = {}
                         }){
                let filters = [];
                log.debug("filterConfig",filterConfig);
                if(filterConfig?.brand)
                    filters.push("AND", ["class", "anyof",filterConfig?.brand]);
                if(filterConfig?.customer)
                    filters.push("AND",["custbody_eb_channel","is",filterConfig?.customer]);
                if(filterConfig.reportType == "ALL"){
                    filters.push("AND",["type","anyof",["CustInvc","CustCred"]]);
                } else if(filterConfig?.reportType){
                    filters.push("AND", ["type", "anyof", filterConfig?.reportType]);
                }

                if(filterConfig?.asOfMonth)
                    filters.push("AND", [`formulanumeric: CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END`,"isnotempty","1"]);


                var brandDetailSearchObj = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["type","anyof",["CustInvc","CustCred"]],
                            "AND",
                            ["custbody_eb_channel","anyof","2","3","5","4","6","7","12","8","9","10","11"],
                            "AND",
                            ["mainline","is","F"],
                            "AND",
                            ["shipping","is","F"],
                            "AND",
                            ["cogs","is","F"],
                            "AND",
                            ["taxline","is","F"],
                            "AND",
                            ["formulanumeric: CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END","isnotempty","1"],
                            "AND",
                            ["formulanumeric: CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END","isnotempty","1"],
                            ...filters
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "class",
                                summary: "GROUP",
                                label: "brand"
                            }),
                            search.createColumn({
                                name: "custbody_eb_channel",
                                summary: "GROUP",
                                label: "Channel"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END",
                                //label: "This Month This Year Amount",
                                label: "currentYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)",
                                label: "totalSales",
                                function: "percentOfTotal"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END",
                                //label: "This Month Last Year Amount",
                                label: "previousYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END)",
                                label: "percentage_preyear",
                                function: "percentOfTotal"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "NVL(((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100), 0)",
                               // formula: "((SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END))-(SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {amount} ELSE 0 END)))/((SUM(NULLIF(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {amount} ELSE 0 END,0)))*100)",
                                label: "change_OverYear",
                            }),
                        ]
                });
                var brandDetailSearchResultCount = brandDetailSearchObj.runPaged().count;
                log.debug("invoiceSearchObj result count",brandDetailSearchResultCount);
                return jjUtil.dataSets.iterateSavedSearch({
                    searchObj: brandDetailSearchObj,
                    columns: jjUtil.dataSets.fetchSavedSearchColumn(brandDetailSearchObj, 'label'),
                    ...searchConfig
                });

            },
            /**
             * To reclassify the resultSet
             * @param {Object[]} dataSet - Contains the array of objects of the result set
             * @param {Object} param
             * @param {String} param.groupBy - Indicate the key on which group action should perform
             * @param {String} param.groupByFallbackValue - Indicate the fallback group which should be defaulted when groupBy in missing
             * @param {String[]} param.sumOf - Indicates the keys on which the summary function should be executed
             */
            classifyResults(dataSet = [], {
                groupBy = '',
                groupByFallbackValue = '',
                sumOf = [],
            }) {
                if (!dataSet || (util.isArray(dataSet) && dataSet.length == 0)) {
                    return dataSet;
                }
                if (!groupBy)
                    return dataSet;
                let columnKeys = Object.keys(dataSet[0]);
                log.debug('columnKeys', columnKeys);

                let orderByGroup = dataSet.reduce((acc, el) => {
                    let val = el[groupBy]?.value || "";
                    acc[val] = val;
                    return acc;
                }, {});
                log.debug('orderByGroup', orderByGroup);

                let sortedDataSet = dataSet.sort((a, b) => a[groupBy]?.value - b[groupBy]?.value);
                log.debug('sortedDataSet', sortedDataSet);


                let newDataSet = [];
                //Iterate the dataset by Group Keys
                for (let groupByKey in orderByGroup) {
                    let summaryLine = [];
                    //Iterate each element over Dataset
                    for (let rowElem of sortedDataSet) {
                        if (rowElem[groupBy]?.value?.toString().trim() != groupByKey?.toString().trim())
                            continue;
                        //log.debug("rowElem[groupBy]",rowElem[groupBy])
                        //Iterate each key on a Dataset Element
                        for (let colElm of columnKeys) {
                          //  log.debug("colElm",colElm)
                            //Push only the summation columns
                            if (sumOf.includes(colElm)) {
                                summaryLine.push({[colElm]: rowElem[colElm]});
                               // log.debug("sumOf.includes(colElm",sumOf.includes(colElm));
                            }
                        }
                        //newDataSet.push(rowElem);
                        newDataSet.push({
                            ...rowElem,
                            [groupBy]: {
                                value: rowElem[groupBy]?.value || groupByFallbackValue,
                                text: rowElem[groupBy]?.text || rowElem[groupBy]?.value || groupByFallbackValue,
                            }
                        });
                    }
                   // log.debug("newDataSet",newDataSet)
                    //For the summary lines
                    newDataSet.push({
                        //Initiate the columns
                        ...columnKeys.reduce((acc, el) => {
                            acc[el] = {"value": "", "text": null};
                            return acc;
                        }, {}),
                        //Calculate and set the sum on summation columns
                        ...summaryLine.reduce((acc, el) => {
                                for (let key in acc) {
                                    acc[key].value = Number(acc[key].value) + Number(el?.[key].value || 0);
                                    acc[key].value = jjUtil.fixFloat(acc[key].value, 2);
                                }
                                return acc;
                            },
                            sumOf.reduce((acc, el) => {
                                acc[el] = {"value": "0", "text": null};
                                return acc;
                            }, {}),
                        ),
                        //Set the Summary key
                        [groupBy]: {"value": "SUMMARY", "text": "SUMMARY"},
                    });
                    log.debug("newData",newDataSet)

                }
                log.debug('newDataSet', newDataSet);
                return newDataSet;
            },
            /**
             * Search for the shipping line in the summary line
             */
            fetchShippingLine({
                            filterConfig = {},
                            searchConfig = {}
                        }) {
                var shippingLineSearchObj = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["type", "anyof", "CustCred", "CustInvc"],
                            "AND",
                            ["mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "class",
                                summary: "GROUP",
                                label: "Brand/Material"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {shippingcost} ELSE 0 END",
                                //label: "This Month This Year Amount",
                                label: "currentYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc({today}, 'month') AND last_day({today}) THEN {shippingcost} ELSE 0 END)",
                                label: "totalSales",
                                function: "percentOfTotal"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {shippingcost} ELSE 0 END",
                                //label: "This Month Last Year Amount",
                                label: "previousYear"
                            }),
                            search.createColumn({
                                name: "formulapercent",
                                summary: "MAX",
                                formula: "SUM(CASE WHEN {trandate} between trunc(add_months({today}, -12), 'month') AND last_day(add_months({today}, -12)) THEN {shippingcost} ELSE 0 END)",
                                label: "percentage_preyear",
                                function: "percentOfTotal"
                            }),
                        ]
                });
                var shippingResultCount = shippingLineSearchObj.runPaged().count;
                log.debug("transactionSearchObj result count", shippingResultCount);
                return jjUtil.dataSets.iterateSavedSearch({
                    searchObj: shippingLineSearchObj,
                    columns: jjUtil.dataSets.fetchSavedSearchColumn(shippingLineSearchObj, 'label'),
                    ...searchConfig
                });
            },
        };
        return function () {
            //return {models};
            this.models = models;
            return this;
        };

    });