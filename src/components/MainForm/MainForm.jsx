import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import CensusDetailFormContainer from "../../containers/CensusDetailFormContainer";
import FMLayoutContainer from "../../containers/FMLayout";
import ProfileFormContainer from "../../containers/ProfileForm";


const { TabPane } = Tabs;

const MainForm = ({
  onCloseClick,
  currentTab,
  onTabChange,
  isEditingAttributes,
}) => {
  const { t } = useTranslation();
 
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
