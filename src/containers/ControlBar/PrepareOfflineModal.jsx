import { Modal, Typography, Progress, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  setOfflineLoadingStatus,
  resetCurrentOfflineLoading,
  setOfflineSelectedOrgUnits,
} from "@/redux/actions/common";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import OrgUnitContainer from "./OrgUnit";

const downloadMapping = [
  { id: "metadata", label: "Download metadata" },
  { id: "tei", label: "Download tracked entities" },
  { id: "enr", label: "Download enrollments" },
  { id: "event", label: "Download events" },
];

const PrepareOfflineModal = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentOfflineLoading, offlineLoading, offlineStatus } = useSelector(
    (state) => state.common
  );
  const { programMetadata, orgUnits } = useSelector((state) => state.metadata);

  const userOrgUnits = useMemo(
    () =>
      programMetadata.organisationUnits.filter(({ path }) =>
        orgUnits.find(({ id }) => path.includes(id))
      ),
    [programMetadata]
  );

  const [selectedOrgUnits, setSelectedOrgUnit] = useState({ selected: [] });

  const handleSelectOrgUnit = (orgUnit) => {
    const found = userOrgUnits.find(({ id }) => id === orgUnit.id);
    if (found) setSelectedOrgUnit(orgUnit);
  };

  const handleDownload = () => {
    const listId = selectedOrgUnits.selected.map((path) => ({
      id: path.split("/").pop(),
    }));
    dispatch(resetCurrentOfflineLoading());
    dispatch(setOfflineSelectedOrgUnits(listId));
    dispatch(setOfflineLoadingStatus(true));
  };

  return (
    <Modal
      title={t("preparingForOfflineMode")}
      open={open}
      // centered
      closeIcon={null}
      maskClosable={false}
      okText={t("OK")}
      onCancel={onCancel}
      onOk={() => window.location.reload()}
      okButtonProps={{ disabled: !offlineStatus }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <OrgUnitContainer
          limit={3}
          singleSelection={false}
          onChange={handleSelectOrgUnit}
          value={selectedOrgUnits}
        />
        <Button
          type="primary"
          disabled={
            !selectedOrgUnits.selected.length || offlineLoading || offlineStatus
          }
          onClick={handleDownload}
        >
          {t("download")}
        </Button>
      </div>
      <Typography
        className="mt-2"
        style={{ color: "#0277bd", fontWeight: "bold" }}
      >
        {t("downloadOfflineHelper")}
      </Typography>
      <div style={{ marginTop: 8, marginBottom: 24 }}>
        {(offlineLoading || offlineStatus) &&
          downloadMapping.map(({ label }, step) => {
            const currentStep = downloadMapping.findIndex(
              ({ id }) => id === currentOfflineLoading.id
            );

            let percent = 0;
            if (currentStep > -1) {
              if (currentStep > step) percent = 100;
              if (currentStep === step) percent = currentOfflineLoading.percent;
            }

            return (
              <div key={label}>
                <Typography>{label}</Typography>
                <Progress
                  percent={percent}
                  format={() => `${percent.toFixed(0)}%`}
                />
              </div>
            );
          })}
      </div>
    </Modal>
  );
};

export default PrepareOfflineModal;
