import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { setOfflineStatus } from "@/redux/actions/common";

const OfflineModeButton = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { offlineStatus } = useSelector((state) => state.common);

  return (
    <Switch
      checkedChildren={t("offline")}
      unCheckedChildren={t("online")}
      onChange={(checked) => {
        dispatch(setOfflineStatus(checked));
      }}
      checked={offlineStatus}
      style={{
        marginRight: "10px",
      }}
    />
  );
};

export default OfflineModeButton;
