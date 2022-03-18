/************************************************************************************************
 * * Module Resolver for Templates **
 *
 *
 * **********************************************************************************************
 *
 * Author:Jobin & Jismi IT Services LLP
 *
 * Date Created :10/March/2022
 *
 * Created By: Karishma K
 *
 * Description :
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/



define({
    templateFetch(type) {
        let sourcedLib = null;
        switch (type) {
            case 'CUSTOMER SALES REPORT PDF' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/PDF Template/JJ PDF Template Customer Sales Summary Report/JJ CM Customer Sales Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;
            case 'BRAND SALES SUMMARY REPORT PDF' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/PDF Template/JJ PDF Template Brand Sales Summary Report/JJ CM Brand Sales Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;
            case 'BRAND DETAIL REPORT PDF' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/PDF Template/JJ PDF Template Brand Detail Report/JJ CM Brand Detail Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;
            case 'CUSTOMER_SALES_REPORT' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/Excel Template/Customer Sales Template/JJ CM Customer Sales Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;
            case 'BRAND_SALES_CSV_REPORT' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/Excel Template/Brand Sales Template/JJ CM Brand Sales Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;
            case 'BRAND_DETAIL_CSV_REPORT' :
                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Templates/Excel Template/Brand Details Template/JJ CM Brand Detail Render GTIL-39.js'], function (lib) {
                    sourcedLib = new lib();
                    return sourcedLib;
                });
                return sourcedLib;
                break;

            default :
                return null;
        }
    }
});