import React, { useEffect, useState } from 'react'
import { Form, Row } from "antd";
import tableRenderData from '@/components/CensusDetailForm/houseServey'
import { useSelector } from 'react-redux';
import _ from "lodash";

const useHouseholdSurveyForm = (values) => {
    const [form] = Form.useForm();
    const [surveyList, setSurveyList] = useState([])

    const malariyaStrictedDelements = ['dhOvYypmAKV', 'GkBNgm5nJFM', 'PflI8FU0Rpd', 'aoQkCHSTvA2', 'uy9zZpHKaom', 'LDTBV6f9x5j', 'keBvW7IyXli']
    const hideForMaleria = ["GtSSMCc6nXz", "Ojvu6krZKBX", "WTFyAoDjI4X", "S4G690Rx8KD", "FL0F1NaV4e2", "b60lyh4IRgb", "uMRfJEDErNx"]

    const selectedOuPath = useSelector((state) => state.metadata.selectedOrgUnit.path);

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(values);
        // load survey fields

        malariyaStrictedDelements.forEach(item => {
            if (selectedOuPath.includes(item)) {
                tableRenderData.forEach(item => {
                    if ((hideForMaleria.includes(item.uid))) { item.permanentHide = false }
                })
                return
            }
        })

        if (values['NPb0hOBn6g9'] == 'Empty') {
            tableRenderData.forEach(item => {
                if (item.uid != 'NPb0hOBn6g9') { item.hidden = true }
            })
        }

    }, [values])


    function loadServeyFields(event = []) {

        const uuid = event[0]?.name[0]
        const value = event[0]?.value

        if (event.length) {
            values[uuid] = value
            if (uuid == 'NPb0hOBn6g9' && value == 'Empty') {
                let keysToKeep = ["NPb0hOBn6g9", "tjXaQPI9OcQ"]

                tableRenderData.forEach(item => {
                    if (!keysToKeep.includes(item.uid)) { item.hidden = true }
                })


                for (let key in values) {
                    if (!keysToKeep.includes(key)) {
                        values[key] = null;
                    }
                }
                // values['NPb0hOBn6g9'] = value
                form.setFieldsValue(values);
            } else if (uuid == 'a0t6coJR4bG') {
                let dwelling = ["Pipe in compound but outside the dwelling", "Piped in dwelling"]

                if (value == "Pipe in compound but outside the dwelling") {
                    values["lRVDgo5HwYe"] = "In own dwelling"

                    // tableRenderData.forEach(item => {
                    //     if (item.uid == 'lRVDgo5HwYe') { item.hidden = false }
                    // })

                    form.setFieldsValue(values);
                } if (value == "Piped in dwelling") {
                    values["lRVDgo5HwYe"] = "In own dwelling"
                    // tableRenderData.forEach(item => {
                    //     if (item.uid == 'lRVDgo5HwYe') { item.hidden = false }
                    // })

                    form.setFieldsValue(values);
                }
                // else if (!dwelling.includes(value)) {
                //     values["lRVDgo5HwYe"] = null
                //     tableRenderData.forEach(item => {
                //         if (item.uid == 'lRVDgo5HwYe') { item.hidden = true }
                //     })

                //     form.setFieldsValue(values);
                // }
                else {
                    delete values["lRVDgo5HwYe"]
                    form.setFieldsValue(values);
                }
            } else if (uuid == "JT2QvZDPRAy") {
                if (value == "No facility/bush/field") {
                    tableRenderData.forEach(item => {
                        if ((item.uid == "ySLtaPSULVN") || (item.uid == 'RIqHmgT1OWu')) { item.hidden = true }
                    })

                    values["ySLtaPSULVN"] = null
                } else {
                    tableRenderData.forEach(item => {
                        if ((item.uid == "ySLtaPSULVN") || (item.uid == 'RIqHmgT1OWu')) { item.hidden = false }
                    })

                }
                form.setFieldsValue(values);

            } else if (uuid == "ySLtaPSULVN") {
                if (value == "Never emptied") {

                    tableRenderData.forEach(item => {
                        if (item.uid == "RIqHmgT1OWu") { item.hidden = true }
                    })

                    values["RIqHmgT1OWu"] = null
                } else {

                    tableRenderData.forEach(item => {
                        if (item.uid == "RIqHmgT1OWu") { item.hidden = false }
                    })
                }
                form.setFieldsValue(values);

            } else if (uuid == "R0AYFvHFg6u") {
                let ifExist = ['No handwashing place in dwelling/yard/plot', 'No permission to see', 'Other reasons']
                if (ifExist.includes(value)) {

                    tableRenderData.forEach(item => {
                        if ((item.uid == "d4VMT4orArm") || (item.uid == 'Ju3AkdRHT52')) { item.hidden = true }
                    })
                    values["d4VMT4orArm"] = null
                    values["Ju3AkdRHT52"] = null
                } else {

                    tableRenderData.forEach(item => {
                        if ((item.uid == "d4VMT4orArm") || (item.uid == 'Ju3AkdRHT52')) { item.hidden = false }
                    })
                }
                form.setFieldsValue(values);
            }
            else if (uuid == "GtSSMCc6nXz") {
                let ifExist = ['Ojvu6krZKBX', 'WTFyAoDjI4X', 'S4G690Rx8KD', 'FL0F1NaV4e2', 'b60lyh4IRgb']
                if (value == "false") {

                    tableRenderData.forEach(item => {
                        if (ifExist.includes(item.uid)) { item.hidden = true }
                    })
                    values["Ojvu6krZKBX"] = null
                    values["WTFyAoDjI4X"] = null
                    values["S4G690Rx8KD"] = null
                    values["FL0F1NaV4e2"] = null
                    values["b60lyh4IRgb"] = null
                } else if (value != "false") {

                    tableRenderData.forEach(item => {
                        if (ifExist.includes(item.uid)) { item.hidden = false }
                    })
                }
                form.setFieldsValue(values);

            } else if (uuid == 'NPb0hOBn6g9' && value != 'Empty') {
                tableRenderData.forEach(item => {
                    item.hidden = false
                })
            }

        }
        setSurveyList(_.cloneDeep(tableRenderData))
    }

    return {
        form,
        surveyList,
        loadServeyFields,
    }
}

export default useHouseholdSurveyForm;