import HierachySelector from "@/components/HierachySelector/HierachySelector.component";
import {
  CloseOutlined,
  EditOutlined,
  RightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Space } from "antd";
import { isEqual } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import withDhis2FormItem from "../../hocs/withDhis2Field";
import CFormControl from "../CustomAntForm/CFormControl";
import InputField from "../CustomAntForm/InputField";

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
    programMetadata: {
      trackedEntityAttributes,
      organisationUnits,
      villageHierarchy,
    },
  } = useSelector((state) => state.metadata);
  const profile = useSelector((state) => state.data.tei.data.currentTei);
  const Dhis2FormItem = useMemo(
    () => withDhis2FormItem(trackedEntityAttributes)(CFormControl),
    []
  );

  const randomNumber = useMemo(() => {
    return Math.floor(1000 + Math.random() * 9000);
  }, []);

  const handleGenerateTemporaryBookNumber = ([
    residenceStatus,
    unitOfVillage,
    houseNumber,
    temporaryFamilyBookNumber,
  ]) => {
    const values = [
      "TEMP",
      residenceStatus ? residenceStatus.substr(0, 1) : "< >",
      organisationUnits.find((ou) => ou.id === selectedOrgUnit.id).code,
      unitOfVillage ? unitOfVillage : "< >",
      houseNumber ? houseNumber : "< >",
      temporaryFamilyBookNumber
        ? temporaryFamilyBookNumber.split("_")[5]
        : randomNumber,
    ];
    return values.join("_");
  };

  const returnValueForVillageSelector = (type) => {
    let value = "";
    let province = "";
    let district = "";
    let village = "";
    let find = organisationUnits.find((e) => e.id === profile.orgUnit);
    if (find) {
      let findVillageHierarchy = villageHierarchy.find(
        (e) => e.value === find.code
      );
      if (findVillageHierarchy) {
        let array = findVillageHierarchy.path.split("/");
        province = array[0] ? array[0] : "";
        district = array[1] ? array[1] : "";
        village = array[2] ? array[2] : "";
      }
    }
    if (type === "province") {
      value = province;
    }
    if (type === "district") {
      value = district;
    }
    if (type === "village") {
      value = village;
    }
    return value;
  };

  // const cleanFormData = (values) => pickBy(values, identity);

  return (
    <Form
      className=""
      initialValues={profile.attributes}
      form={form}
      name="familyRegistration"
      onFinish={(fieldsValue) => {
        // onSubmit(cleanFormData(fieldsValue));
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
              disabledDate={(date) =>
                date < moment([minDate]) || date > moment([maxDate])
              }
            />
          </Dhis2FormItem>
        </div>
      </div>
      <div className="row col-lg-12">
        {/* <div className="col-lg-3">
          <FormNoInputContainer
            id="G9KYJZ8dW76"
            initialValue={profile.attributes.G9KYJZ8dW76}
            disabled={!isEdit}
            size="large"
            form={form}
          />
        </div> */}
        <div className="col-lg-3">
          <Dhis2FormItem
            id="b4UUhQPwlRH"
            // displayFormName={t("unitOfVillage")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>
        <div className="col-lg-3">
          <Dhis2FormItem
            id="eMYBznRdn0t"
            // displayFormName={t("houseNumber")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>
        <div className="col-lg-3">
          <Dhis2FormItem
            id="WcKI8B0MYaB"
            // displayFormName={t("houseNumber")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div>
        {/* <div className="col-lg-3">
          <Dhis2FormItem
            id="SHPW4d00NnM"
            // displayFormName={t("houseNumber")}
          >
            <InputField size="large" disabled={!isEdit} />
          </Dhis2FormItem>
        </div> */}
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
      <Space>
        <Button.Group>
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
                "xbwURy2jG2K",
                "W8WZcI1SUjC",
                "rzGghDo5ipI",
                "nYcHuUDqeBY",
                "AiwUJOsOC86",
                "CKQuSLAY0Xf",
                "gSImG6wxCkY",
                "UQdxC9ojcju",
                "BgKZvUxweKO",
                "utW5gK4ihvz",
                "XwnHdecsbvz",
              ]}
              childPropsFunc={() => {
                return {
                  disabled: isEqual(
                    // cleanFormData(profile.attributes),
                    // cleanFormData(form.getFieldsValue()),
                    profile.attributes,
                    form.getFieldsValue()
                  ),
                };
              }}
            >
              <Button
                key={1}
                size="large"
                type="primary"
                htmlType="submit"
                className="mb-3"
              >
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
        <Button
          onClick={onNextClick}
          size="large"
          disabled={isEdit || !hasTeiParam}
          type="primary"
        >
          {t("next")} <RightOutlined />
        </Button>
      </Space>
    </Form>
  );
};

export default ProfileForm;
