import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import CensusDetailFormContainer from "../../containers/CensusDetailFormContainer";
import FMLayoutContainer from "../../containers/FMLayout";
import ProfileFormContainer from "../../containers/ProfileForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { setSelectedParentOuPattern } from "@/redux/actions/data";
import { useApi } from "@/hooks";

const { TabPane } = Tabs;

const MainForm = ({
  onCloseClick,
  currentTab,
  onTabChange,
  isEditingAttributes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const { offlineStatus } = useSelector((state) => state.common);
  const { selectedOrgUnit: { id: orgUnit } } = useSelector((state) => state.metadata);
  const { dataApi } = useApi();
 const randomNumber = useMemo(() => {
    return Math.floor(100 + Math.random() * 900);
  }, []);


  useEffect(() => {


    function extractValues(obj) {
      let values = [];
      if (obj.attributeValues) {
        values.push(...obj.attributeValues?.map(av => av?.value));
      }
      if (obj.parent) {
        values.push(...extractValues(obj.parent));
      }
      return values;
    }

    if (offlineStatus) { }
    else {
      try {
        dataApi.getParentsByOuId(orgUnit).then((json) => {
          let parent = extractValues(json);
          dispatch(setSelectedParentOuPattern(parent?.join(' ')+' '+randomNumber))
        });

      } catch (error) {
        dispatch(setSelectedParentOuPattern())
      }
    }
  }, [orgUnit])

  const items = [
    {
      label: t("familyRegistration"),
      key: "1",
      children: <ProfileFormContainer />,
    },
    {
      label: t("familyMembers"),
      key: "2",
      children: <FMLayoutContainer />,
      disabled: isEditingAttributes,
    },
    {
      label: t("Household Survey"),
      key: "3",
      children: <CensusDetailFormContainer />,
      disabled: isEditingAttributes,
    },
  ];

  return (
    <Card size="small">
      <Tabs
        style={{
          overflow: "visible",
        }}
        activeKey={currentTab}
        onChange={onTabChange}
        // defaultActiveKey="1"
        tabBarExtraContent={{
          right: (
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <Button type="text">
                <CloseOutlined onClick={onCloseClick} />
              </Button>
            </div>
          ),
        }}
        items={items}
      />
    </Card>
  );
};

export default MainForm;
