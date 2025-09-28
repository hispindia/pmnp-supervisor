import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Card, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./index.css";

const { Title, Text } = Typography;

const AccessRestrictionMessage = ({ userRole = "unknown" }) => {
  const { t } = useTranslation();

  return (
    <div className="access-restriction-container">
      <div className="access-restriction-content">
        <Card className="access-restriction-card" bordered={false}>
          <div className="access-restriction-icon">
            <ExclamationCircleOutlined className="restriction-icon" />
          </div>

          <Title level={2} className="access-restriction-title">
            {t("Access Restricted")}
          </Title>

          <Alert
            message={t("Unauthorized Access")}
            description={
              <div className="access-restriction-description">
                <Text className="restriction-message">
                  {t("This app is only accessible by data collector users. Kindly check your user role.")}
                </Text>
                <div className="user-role-info">
                  <UserOutlined className="user-icon" />
                  <Text className="current-role">
                    {t("Current Role")}: <strong>{userRole}</strong>
                  </Text>
                </div>
              </div>
            }
            type="warning"
            showIcon={false}
            className="access-restriction-alert"
          />

          <div className="access-restriction-footer">
            <Text type="secondary" className="footer-text">
              {t("Please contact your administrator for access permissions.")}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccessRestrictionMessage;
