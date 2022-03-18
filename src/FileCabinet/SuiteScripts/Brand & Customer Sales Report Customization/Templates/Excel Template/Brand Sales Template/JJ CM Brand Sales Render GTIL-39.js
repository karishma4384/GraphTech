/**
 * @NApiVersion 2.1
 */
/************************************************************************************************
 * * Excel Render for Customer Sales Summary- Current Month **
 *
 *
 * **********************************************************************************************
 *
 * Author:
 *
 * Date Created : 10-March-2022
 *
 * Created By: Vishnu P Santhosh, GraphTech
 *
 * Description : Model
 *
 * REVISION HISTORY
 *
 *
 *
 *
 ***********************************************************************************************/
define(['N/file', 'N/render', 'N/encode', '../../Library/JJ CM NS Utility'],
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
                let renderObj = render.create();
                renderObj.templateContent = file.load({
                    id: './JJ CSV Template Brand Sales GTIL-39.xml'
                }).getContents();
                return renderObj;
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
                        // "currentYear": {"value": "0", "text": null},
                        // "totalSales": {"value": "0", "text": null},
                        // "previousYear": {"value": "0", "text": null},
                        // "percentage_preyear": {"value": "0", "text": null},
                        // "change_OverYear": {"value": "0", "text": null}
                    })
                );
                log.debug("lines",lines);
                log.debug("summary",summary);
                log.debug("header",header);
                renderObj.addCustomDataSource({
                    format: render.DataSource.OBJECT,
                    alias: "record",
                    data: {
                        header,
                        lines,
                        summary
                    }
                });
                log.debug("log after render","Success");
            },
            /**
             * To render the XML as CSV
             * @param{Object} renderObj
             * @returns {File}
             */
            renderAsCSV(renderObj, {
                filename = ""
            }) {
                let renderAsString = renderObj.renderAsString();
                let strXmlEncoded = encode.convert({
                    string: renderAsString,
                    inputEncoding: encode.Encoding.UTF_8,
                    outputEncoding: encode.Encoding.BASE_64
                });
                let objXlsFile = file.create({
                    name: `BRAND_SALES_REPORT${Date.now() / 1000}.csv`,
                    fileType: file.Type.CSV,
                    contents: strXmlEncoded
                });
                return objXlsFile;
            }
        };

        return function () {
            this.templateRender = templateRender;
            return this;
        };

    });
