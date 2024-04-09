import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { pushToServer } from "@/redux/actions/common";

const PushToServerButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { offlineStatus } = useSelector((state) => state.common);

  return (
    <Button
      onClick={() => {
        dispatch(pushToServer());
      }}
      style={{
        marginRight: "10px",
        backgroundColor: "green",
      }}
      shape="round"
      size="small"
      type="primary"
      icon={<UploadOutlined />}
    >
      {t("push")}
    </Button>
  );
};

export default PushToServerButton;
