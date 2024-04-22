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
      >
        <TabPane tab={t("familyRegistration")} key="1">
          <ProfileFormContainer />
        </TabPane>
        <TabPane
          tab={t("familyMembers")}
          disabled={isEditingAttributes}
          key="2"
        >
          <FMLayoutContainer />
        </TabPane>
        <TabPane
          tab={t("censusDetails")}
          disabled={isEditingAttributes}
          key="3"
        >
          <CensusDetailFormContainer />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default MainForm;
