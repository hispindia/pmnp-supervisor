import { HOUSEHOLD_DATA_COLLECTOR_ATTR_ID, HOUSEHOLD_ID_ATTR_ID, SHOULD_NOT_CLEAR_LIST } from "@/constants/app-config";
import { CloseOutlined, EditOutlined, RightOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Space } from "antd";
import { isEqual } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import withDhis2FormItem from "../../hocs/withDhis2Field";
import { HH_STATUS_ATTR_ID } from "../constants";
import CFormControl from "../CustomAntForm/CFormControl";
import InputField from "../CustomAntForm/InputField";
import { format } from "date-fns";

const disabledFields = [
  HOUSEHOLD_ID_ATTR_ID,
  HH_STATUS_ATTR_ID,
  HOUSEHOLD_DATA_COLLECTOR_ATTR_ID,
  "eMYBznRdn0t",
  "GXs8SDJL19y",
];

const ProfileForm = ({
  onSubmit,
  isEditingAttributes: isEdit,
  setIsEditingAttributes: setIsEdit,
  hasTeiParam,
  onNextClick,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { minDate, maxDate } = useSelector((state) => state.metadata);

  const {
    selectedOrgUnit,
    programMetadata: { trackedEntityAttributes, organisationUnits, villageHierarchy },
  } = useSelector((state) => state.metadata);
  const profile = useSelector((state) => state.data.tei.data.currentTei);
  const Dhis2FormItem = useMemo(() => withDhis2FormItem(trackedEntityAttributes)(CFormControl), []);

  const randomNumber = useMemo(() => {
    return Math.floor(1000 + Math.random() * 9000);
  }, []);

  const items = trackedEntityAttributes
    .filter((tea) => tea.displayInList || SHOULD_NOT_CLEAR_LIST.includes(tea.id))
    .map((attr) => ({ ...attr, disabled: disabledFields.includes(attr.id) || !isEdit }));

  return (
    <Form
      key={profile.updatedAt}
      className=""
      initialValues={profile.attributes}
      form={form}
      name="familyRegistration"
      onValuesChange={(changedValues, allValues) => {
        console.log("Form values changed:", { changedValues, allValues });
      }}
      onFinish={(fieldsValue) => {
        onSubmit(fieldsValue);
      }}
    >
      <div className="row col-lg-12">
        <div className="col-12">
          <Dhis2FormItem id="BUEzQEErqa7">
            <InputField
              disabled={!profile.isNew}
              size="large"
              valueType="YEAR"
              disabledDate={(date) => date < moment([minDate]) || date > moment([maxDate])}
            />
          </Dhis2FormItem>
        </div>
      </div>
      <div className="row col-lg-12">
        {items.map((item) => (
          <div className="col-lg-3" key={item.id}>
            <Dhis2FormItem
              id={item.id}
              dependentFields={item.id === HH_STATUS_ATTR_ID ? ["eNSVMKSqOVY"] : undefined}
              setValuesFunc={
                item.id === HH_STATUS_ATTR_ID
                  ? ([isDuplicate]) => {
                      if (isDuplicate === "true" || isDuplicate === true) {
                        return { [HH_STATUS_ATTR_ID]: "Duplicate" };
                      }
                      return {};
                    }
                  : undefined
              }
              rules={[
                {
                  validator: (_, value) => {
                    if (item.id === "D9fGfe9AmkZ") {
                      if (value && value.length !== 11) {
                        return Promise.reject(new Error(t("The phone number is 11 digit")));
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputField size="large" disabled={item.disabled} />
            </Dhis2FormItem>
          </div>
        ))}
        {/* HH - Duplicate */}
        <div className="col-lg-3">
          <Dhis2FormItem id={"eNSVMKSqOVY"}>
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>

        <div className="col-lg-3">
          <Dhis2FormItem id={HOUSEHOLD_DATA_COLLECTOR_ATTR_ID}>
            <InputField size="large" disabled={true} />
          </Dhis2FormItem>
        </div>

        <div className="col-lg-3">
          <Dhis2FormItem id={"I32qp5UaNwq"} setValuesFunc={() => ({ I32qp5UaNwq: format(new Date(), "yyyy-MM-dd") })}>
            <InputField size="large" disabled={true} />
          </Dhis2FormItem>
        </div>
      </div>
      {/* <div className="row col-lg-12">
        <div className="col-lg-3">
          <Dhis2FormItem
            id="nYcHuUDqeBY"
            displayFormName={t("telephoneNumber")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>
      </div> */}
      {/* <div className="row col-lg-12">
        <div className="col-lg-3">
          <Dhis2FormItem
            dependentFields={["rzGghDo5ipI"]}
            setValuesFunc={([residenceStatus]) => ({
              AiwUJOsOC86: residenceStatus === "Residence" ? "true" : "false",
            })}
            childPropsFunc={([residenceStatus]) => {
              return {
                disabled: ["Student", "Mobile worker", "Others"].includes(
                  residenceStatus
                ),
              };
            }}
            id="AiwUJOsOC86"
            displayFormName={t("familyRegistered")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>
        <div className="col-lg-9">
          <div className="row">
            <div className="col-lg-4">
              <Dhis2FormItem
                displayFormName={t("tempBookNumber")}
                dependentFields={[
                  "rzGghDo5ipI",
                  "AiwUJOsOC86",
                  "xbwURy2jG2K",
                  "W8WZcI1SUjC",
                  "CKQuSLAY0Xf",
                ]}
                showFieldFunc={([residenceStatus, familyRegistered]) =>
                  residenceStatus !== "Others" && familyRegistered === "false"
                }
                setValuesFunc={([
                  residenceStatus,
                  familyRegistered,
                  unitOfVillage,
                  houseNumber,
                  temporaryBookNumber,
                ]) => {
                  const generatedValue = handleGenerateTemporaryBookNumber([
                    residenceStatus,
                    unitOfVillage,
                    houseNumber,
                    temporaryBookNumber,
                  ]);

                  return {
                    CKQuSLAY0Xf: generatedValue,
                  };
                }}
                id="CKQuSLAY0Xf"
              >
                <InputField size="large" disabled={true} />
              </Dhis2FormItem>
            </div>
            <div className="col-lg-5">
              <CFormControl
                noStyle
                dependentFields={["rzGghDo5ipI", "AiwUJOsOC86"]}
                showFieldFunc={([residenceStatus, familyRegistered]) =>
                  residenceStatus !== "Others" && familyRegistered === "false"
                }
                childPropsFunc={([residenceStatus, familyRegistered]) => {
                  let newValues = {};
                  if (residenceStatus === "Residence") {
                    newValues = {
                      BgKZvUxweKO: returnValueForVillageSelector("province"),
                      utW5gK4ihvz: returnValueForVillageSelector("district"),
                      XwnHdecsbvz: returnValueForVillageSelector("village"),
                    };
                  } else {
                    newValues = {
                      utW5gK4ihvz: profile.attributes["utW5gK4ihvz"] || "",
                      BgKZvUxweKO: profile.attributes["BgKZvUxweKO"] || "",
                      XwnHdecsbvz: profile.attributes["XwnHdecsbvz"] || "",
                    };
                  }

                  const currentProvince = newValues["BgKZvUxweKO"];
                  const currentDistrict = newValues["utW5gK4ihvz"];
                  const currentVillage = newValues["XwnHdecsbvz"];

                  form.setFieldsValue(newValues);

                  return {
                    config: {
                      labels: [
                        "Please select province / ກະລຸນາເລຶອກແຂວງ",
                        "Please select district / ກະລຸນາເລຶອກເມືອງ",
                        "Please select village / ກະລຸນາເລຶອກບ້ານ",
                      ],
                      hierachy: villageHierarchy,
                      initSelections: [
                        currentProvince,
                        currentDistrict,
                        currentVillage,
                      ],
                      disabled:
                        !isEdit ||
                        (residenceStatus === "Residence" &&
                          familyRegistered === "false"),
                      select: (selections) => {
                        form.setFieldsValue({
                          BgKZvUxweKO: selections[0]?.value,
                          utW5gK4ihvz: selections[1]?.value,
                          XwnHdecsbvz: selections[2]?.value,
                        });
                      },
                    },
                  };
                }}
              >
                <Form.Item name="BgKZvUxweKO" noStyle hidden />
                <Form.Item name="utW5gK4ihvz" noStyle hidden />
                <Form.Item name="XwnHdecsbvz" noStyle hidden />
                <HierachySelector />
              </CFormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <Dhis2FormItem
                id="gSImG6wxCkY"
                displayFormName={t("familyBookNumber")}
                dependentFields={["AiwUJOsOC86"]}
                showFieldFunc={([familyRegistered]) =>
                  familyRegistered === "true"
                }
              >
                <InputField size="large" disabled={!isEdit} />
              </Dhis2FormItem>
            </div>
            <div className="col-lg-4">
              <Dhis2FormItem
                dependentFields={["rzGghDo5ipI"]}
                showFieldFunc={([residenceStatus]) =>
                  residenceStatus === "Others"
                }
                id="UQdxC9ojcju"
                displayFormName={t("specifyresidentdetails")}
              >
                <InputField size="large" disabled={!isEdit} />
              </Dhis2FormItem>
            </div>
          </div>
        </div>
      </div> */}
      <Space style={{ marginLeft: 15, marginTop: 5, marginBottom: 20 }}>
        <Button.Group style={{ alignItems: "center" }}>
          {!isEdit ? (
            <Button
              key={0}
              size="large"
              type="primary"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              <EditOutlined /> {t("edit")}
            </Button>
          ) : (
            <CFormControl
              dependentFields={[
                "BUEzQEErqa7",
                // "G9KYJZ8dW76",
                HOUSEHOLD_ID_ATTR_ID,
                "eMYBznRdn0t",
                "J2KmQw53CRl",
                "HYNM3CJYLje",

                // "xbwURy2jG2K",
                // "W8WZcI1SUjC",
                // "rzGghDo5ipI",
                // "nYcHuUDqeBY",
                // "AiwUJOsOC86",
                // "CKQuSLAY0Xf",
                // "gSImG6wxCkY",
                // "UQdxC9ojcju",
                // "BgKZvUxweKO",
                // "utW5gK4ihvz",
                // "XwnHdecsbvz",
              ]}
              childPropsFunc={() => {
                return {
                  disabled: isEqual(
                    // cleanFormData(profile.attributes),
                    // cleanFormData(form.getFieldsValue()),
                    profile.attributes,
                    form.getFieldsValue(),
                  ),
                };
              }}
            >
              <Button key={1} size="large" type="primary" htmlType="submit">
                <SaveOutlined /> {t("save")}
              </Button>
            </CFormControl>
          )}
          <Button
            key={2}
            size="large"
            onClick={() => {
              setIsEdit(false);
              form.resetFields();
            }}
            disabled={!isEdit}
          >
            <CloseOutlined /> {t("cancel")}
          </Button>
        </Button.Group>
        <Button onClick={onNextClick} size="large" disabled={isEdit || !hasTeiParam} type="primary">
          {t("next")} <RightOutlined />
        </Button>
      </Space>
    </Form>
  );
};

export default ProfileForm;
