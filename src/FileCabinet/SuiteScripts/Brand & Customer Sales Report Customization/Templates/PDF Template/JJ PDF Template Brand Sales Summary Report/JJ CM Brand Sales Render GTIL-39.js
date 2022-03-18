/************************************************************************************************
 * * PDF Render for GTIL Report **
 *
 *
 * **********************************************************************************************
 *
 * Author:Jobin & Jismi IT Services LLP
 *
 * Date Created :11/March/2022
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
define(['N/file', 'N/render', 'N/encode', '../../../Library/JJ CM NS Utility'],
    /**
     * @param{file} file
     * @param{render} render
     * @param{encode} encode
     * @param{jjUtil} jjUtil
     */
    (file, render, encode, jjUtil) => {

        const templateRender = {
            /**
             * Initialize render and template
             * @returns {Object} renderObj
             */
            init() {
                try{
                    let renderObj = render.create();
                    renderObj.templateContent = file.load({
                        id: './JJ PDF Template Brand Sales Summary GTIL-39.xml'

                    }).getContents();
                    return renderObj;
                }catch(error){
                    log.debug("Error @init render",error);
                }
            },
            /**
             * To add custom dataSource
             * @param {Object} renderObj
             * @param {Object} param
             * @param{Object} param.header
             * @param{Array<Object>} param.lines
             * @param{Object} param.summary
             */
            addCustomDataSource(renderObj, {
                header,
                lines,
                summary
            }) {
                summary = Object.assign(
                    summary,
                    lines.reduce((acc, el) => {
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
                    })
                );
                log.debug("Summary",summary);
                const date = new Date();
                header.asOfMonth=
                    header.asOfYear=date.getFullYear(),

                    log.debug("Header",header)
                log.debug("lines",lines)
                renderObj.addCustomDataSource({
                    format: render.DataSource.OBJECT,
                    alias: "record",
                    data: {
                        header,
                        lines,
                        summary
                    }
                });
                log.debug("renderObj",renderObj);
            },
            /**
             * To render the XML as Excel Sheet
             * @param{Object} renderObj
             * @returns {File}
             */
            renderAsExcel(renderObj, {
                filename = ""
            }) {
                // let renderAsString = renderObj.renderAsString();
                // log.debug("renderAsString",renderAsString);
                // let strPdfEncoded = encode.convert({
                //     string: renderAsString,
                //     inputEncoding: encode.Encoding.UTF_8,
                //     outputEncoding: encode.Encoding.BASE_64
                // });
                // let objPDF = file.create({
                //     name: `รายงานขอคนื_WHT_${Date.now() / 1000}.pdf`,
                //     fileType: file.Type.PDF,
                //     contents: strPdfEncoded
                // });
                // log.debug("objPDF",objPDF);
                return renderObj.renderAsPdf();
            }
        };

        return function () {
            this.templateRender = templateRender;
            return this;
        };

    });
