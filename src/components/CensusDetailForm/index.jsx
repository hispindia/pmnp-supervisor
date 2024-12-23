import { Button, Col, Form, Row, Table, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SideBarContainer from "../../containers/SideBar";
import withDhis2FormItem from "../../hocs/withDhis2Field";
import CFormControl from "../CustomAntForm/CFormControl";
import tableRenderData from './houseServey'

/* style */
import "./index.css";
import InputField from "../InputField";

const malariyaStrictedDelements = ['dhOvYypmAKV', 'GkBNgm5nJFM', 'PflI8FU0Rpd', 'aoQkCHSTvA2', 'uy9zZpHKaom', 'LDTBV6f9x5j', 'keBvW7IyXli']
const hideForMaleria = ["GtSSMCc6nXz", "Ojvu6krZKBX", "WTFyAoDjI4X", "S4G690Rx8KD", "FL0F1NaV4e2", "b60lyh4IRgb", "uMRfJEDErNx"]
const CensusDetailForm = ({ onSubmit, selected6Month, onTabChange, values, }) => {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [surveyList, setSurveyList] = useState([])

  const dataElements = useSelector((state) => state.metadata.programMetadata.programStages[0].dataElements);
  const selectedOuPath = useSelector((state) => state.metadata.selectedOrgUnit.path);

  const Dhis2FormItem = useMemo(() => withDhis2FormItem(dataElements)(CFormControl), [dataElements]);


  const columns = [
    {
      dataIndex: "label",
      key: "label",
      render: (value, row, index) => {
        const { type, styles } = row;
        return {
          children: value,
          props: {
            colSpan: type === "title" ? 4 : 1,
            style: styles,
          },
        };
      },
    },
    {
      dataIndex: "input1",
      key: "input1",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row, true),
          },
        };
      },
    },
    {
      dataIndex: "input2",
      key: "input2",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row),
          },
        };
      },
    },
    {
      dataIndex: "input3",
      key: "input3",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row),
          },
        };
      },
    },
  ];

  const getInputRowSpan = (row, isFirstInput = false) => {
    const { type, uid } = row;
    return type === "title" ? 0 : uid ? (isFirstInput ? 3 : 0) : 1;
  };

  const sumOf = (target, fields) => {
    return {
      dependentFields: fields,
      setValuesFunc: (values) => {
        const sum = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        return {
          [target]: sum,
        };
      },
      childPropsFunc: ([]) => {
        return {
          disabled: true,
        };
      },
    };
  };

  const dependenciesOf = (target) => {
    return {
      skFDIWZmgTC: {
        dependentFields: ["skFDIWZmgTC"],
        // showFieldFunc: ([skFDIWZmgTC]) => skFDIWZmgTC != 0,
        setValuesFunc: ([skFDIWZmgTC]) => {
          if (skFDIWZmgTC <= 0) {
            return {
              [target]: "",
            };
          }
        },
        childPropsFunc: ([skFDIWZmgTC]) => {
          return {
            disabled: skFDIWZmgTC <= 0,
          };
        },
      },
      ztDjhjZoEGe: {
        dependentFields: ["ztDjhjZoEGe"],
        // showFieldFunc: ([ztDjhjZoEGe]) => ztDjhjZoEGe != 0,
        setValuesFunc: ([ztDjhjZoEGe]) => {
          if (ztDjhjZoEGe <= 0) {
            return {
              [target]: "",
            };
          }
        },
        childPropsFunc: ([ztDjhjZoEGe]) => {
          return {
            disabled: ztDjhjZoEGe <= 0,
          };
        },
      },
      QteYoL0Yy6K: {
        dependentFields: ["QteYoL0Yy6K"],
        // setValuesFunc: ([QteYoL0Yy6K]) => {
        //   if (QteYoL0Yy6K <= 0) {
        //     return {
        //       [target]: "",
        //     };
        //   }
        // },
        // childPropsFunc: ([QteYoL0Yy6K]) => {
        //   return {
        //     disabled: QteYoL0Yy6K <= 0,
        //   };
        // },
      },
    };
  };




  /**
 * <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Non-biodegradable household solid
                    waste (glass, blades, expired medicine, bandages, etc.) disposal method used</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Public garbage collection
                </td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="fkAXYJ8nOll"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Open Pit</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="hwCISmocKY6"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Burning</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="f28Es6U3KSr"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Burial
                </td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="lSzJofGb7fU"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Others</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="vapo8mgKcyM"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Sanitation</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Proper drainage</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="spZ0rGykIK6">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Livestock without separate animal-shed</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="nFFkSQtqGqL">
                </td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Facility accessibility and income
                </td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Using the usual means, how long does it take to
                    get to the nearest facility in minutes?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="ezLCrmL40SD">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">What was your household’s TOTAL INCOME
                    (collective
                    for all members and all sources: salaries, wages, pension, farm produce, dairy, forest products,
                    zorig
                    chusum, remittance, kidu, business, real state, rental, etc ) last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="Cql7XO3Z5Fe"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Malaria endemic specific questions
                </td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Does your household have Long Lasting Insecticide
                    Nets (LLIN) received last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="GtSSMCc6nXz">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of LLINs received last year</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="Ojvu6krZKBX"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Did anyone in your household sleep under LLINs
                    last night?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="WTFyAoDjI4X"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of U5 children who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="S4G690Rx8KD"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of pregnant women who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="FL0F1NaV4e2"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of other members who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="b60lyh4IRgb"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Was your house sprayed with IRS last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="uMRfJEDErNx"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Salt Test</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Household salt Iodine content</td>
                <td><input type="text" style="box-sizing: border-box;" placeholder="YGisOzETviK">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">If less than15 PPM specify the brand of salt</td>
                <td><input type="text" style="box-sizing: border-box;" placeholder="pUnhWS1qOeS">
                </td>
            </tr>
        </tbody>
    </table>
 */



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
        if (item.uid != 'NPb0hOBn6g9') { item.hide = true }
      })
    }


  }, [values])


  useEffect(() => { loadServeyFields() }, [])

  function loadServeyFields(event = []) {
    const uuid = event[0]?.name[0]
    const value = event[0]?.value


    if (event.length) {
      values[uuid] = value
      if (uuid == 'NPb0hOBn6g9' && value == 'Empty') {
        tableRenderData.forEach(item => {
          if (item.uid != 'NPb0hOBn6g9') { item.hide = true }
          // else return { ...item, hide: true }
        })
        let keysToKeep = ["NPb0hOBn6g9", "tjXaQPI9OcQ"]

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
          tableRenderData.forEach(item => {
            if (item.uid == 'lRVDgo5HwYe') { item.hide = false }
          })
          form.setFieldsValue(values);
        } if (value == "Piped in dwelling") {
          values["lRVDgo5HwYe"] = "In own dwelling"
          tableRenderData.forEach(item => {
            if (item.uid == 'lRVDgo5HwYe') { item.hide = false }
          })
          form.setFieldsValue(values);
        } else if (!dwelling.includes(value)) {
          values["lRVDgo5HwYe"] = null
          tableRenderData.forEach(item => {
            if (item.uid == 'lRVDgo5HwYe') { item.hide = true }
          })

          form.setFieldsValue(values);
        } else {
          delete values["lRVDgo5HwYe"]
          form.setFieldsValue(values);
        }
      } else if (uuid == "JT2QvZDPRAy") {
        if (value == "No facility/bush/field") {
          tableRenderData.forEach(item => {
            if (item.uid == "ySLtaPSULVN") { item.hide = true }
          })
          values["ySLtaPSULVN"] = null
        } else {

          tableRenderData.forEach(item => {
            if (item.uid == "ySLtaPSULVN") { item.hide = false }
          })
        }
        form.setFieldsValue(values);

      } else if (uuid == "ySLtaPSULVN") {
        if (value == "Never emptied") {

          tableRenderData.forEach(item => {
            if (item.uid == "RIqHmgT1OWu") { item.hide = true }
          })
          values["RIqHmgT1OWu"] = null
        } else {

          tableRenderData.forEach(item => {
            if (item.uid == "RIqHmgT1OWu") { item.hide = false }
          })
        }
        form.setFieldsValue(values);

      } else if (uuid == "R0AYFvHFg6u") {
        let ifExist = ['No handwashing place in dwelling/yard/plot', 'No permission to see', 'Other reasons']
        if (ifExist.includes(value)) {

          tableRenderData.forEach(item => {
            if ((item.uid == "d4VMT4orArm") || (item.uid == 'Ju3AkdRHT52')) { item.hide = true }
            // else return { ...item }
          })
          values["d4VMT4orArm"] = null
          values["Ju3AkdRHT52"] = null
        } else {

          tableRenderData.forEach(item => {
            if ((item.uid == "d4VMT4orArm") || (item.uid == 'Ju3AkdRHT52')) { item.hide = false }
          })
        }
        form.setFieldsValue(values);
      }
      else if (uuid == "GtSSMCc6nXz") {
        let ifExist = ['Ojvu6krZKBX', 'WTFyAoDjI4X', 'S4G690Rx8KD', 'FL0F1NaV4e2', 'b60lyh4IRgb']
        if (value == "false") {

          tableRenderData.forEach(item => {
            if (ifExist.includes(item.uid)) { item.hide = true }
          })
          values["Ojvu6krZKBX"] = null
          values["WTFyAoDjI4X"] = null
          values["S4G690Rx8KD"] = null
          values["FL0F1NaV4e2"] = null
          values["b60lyh4IRgb"] = null
        } else if (value != "false") {

          tableRenderData.forEach(item => {
            if (ifExist.includes(item.uid)) { item.hide = false }
          })
        }
        form.setFieldsValue(values);

      } else if (uuid == 'NPb0hOBn6g9' && value != 'Empty') {

        tableRenderData.forEach(item => {
          item.hide = false
        })
      }

    }


    const dataSource = tableRenderData.map((row, index) => {
      const {
        uid,
        some,
        alot,
        thirdRowTitle,
        thirdRowId,
        name,
        type,
        hide,
        permanentHide,
        dependentFields = [],
        setValuesFunc = () => { },
        showFieldFunc = () => true,
        childPropsFunc = () => { },
      } = row;
      switch (type) {
        case "title": {
          return {
            ...row,
            key: index,
            label: name,
          };
        }
        default: {
          if (uid) {
            return {
              ...row,
              key: index,
              label: name,
              input1: (
                <Dhis2FormItem
                  noStyle
                  id={uid}
                  dependentFields={dependentFields}
                  setValuesFunc={setValuesFunc}
                  showFieldFunc={showFieldFunc}
                  childPropsFunc={childPropsFunc}

                >
                  <InputField
                    disabled={permanentHide == true ? true : hide}
                    size="small" style={{ minWidth: 120 }} />
                </Dhis2FormItem>
              ),
            };
          } else {
            return {
              ...row,
              key: index,
              label: name,
              input1: (
                <Dhis2FormItem
                  displayFormName={t("some")} id={some}>
                  <InputField size="small" />
                </Dhis2FormItem>
              ),
              input2: (
                <Dhis2FormItem displayFormName={t("alot")} id={alot}>
                  <InputField size="small" />
                </Dhis2FormItem>
              ),
              input3: (
                <Dhis2FormItem displayFormName={t(thirdRowTitle)} id={thirdRowId}>
                  <InputField size="small" />
                </Dhis2FormItem>
              ),
            };
          }
        }
      }

    });
    setSurveyList(dataSource)
  }




  const items = [
    {
      key: 1,
      label: ``,
      children: (

        <Table
          size="small"
          bordered
          pagination={false}
          showHeader={false}
          dataSource={surveyList}
          columns={columns}
        />
      ),
    }
  ];

  return (
    <Form
      onFieldsChange={loadServeyFields}
      initialValues={values}
      form={form}
      onFinish={(fieldsValue) => {
        onSubmit(fieldsValue);
      }}
    >
      <div className="d-md-flex">
        <Col className="leftBar mr-2 mt-2">
          <SideBarContainer />

          <Row justify="center">
            <Button
              type="primary"
              htmlType="submit"
              className="mt-2"
              style={{
                width: "100%",
                backgroundColor: "#4CAF50",
              }}
            >
              {t("save")}
            </Button>
          </Row>
        </Col>



        <Col className="rightBar">

          <Tabs
            defaultActiveKey="1"
            size="small"
            items={items}
            onChange={onTabChange}
          />
        </Col>
      </div>
    </Form>
  );
};

export default CensusDetailForm;
