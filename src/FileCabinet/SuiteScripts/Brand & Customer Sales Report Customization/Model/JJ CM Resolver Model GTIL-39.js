/**
 * @NApiVersion 2.1
 */
/************************************************************************************************
 * * Model for Invoice UnCollected Report **
 *
 *
 * **********************************************************************************************
 *
 * Author: Jobin & Jismi IT Services LLP
 *
 * Date Created : 03-March-2022
 *
 * Created By: Sandhra Simon, Jobin & Jismi IT Services LLP
 *
 * Description : Model
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/
define({
        modelFetch(type){
                let sourcedLib = null;
                switch(type) {
                        case 'GRAPH_TECH_REPORT' :
                                require(['/SuiteScripts/Brand & Customer Sales Report Customization/Model/JJ CM Model GTIL-39.js'], function (lib) {
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
