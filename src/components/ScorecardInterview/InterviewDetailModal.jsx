import HouseHoldMemberTable from "./HouseHoldMemberTable";
import HouseHoldSurveyForm from "./HouseHoldSurveyForm";
import InterviewResultForm from "./InterviewResultForm";

import {
  HOUSEHOLD_ID_ATTR_ID,
  HOUSEHOLD_INTERVIEW_DATE_DE_ID,
  HOUSEHOLD_INTERVIEW_ID_DE_ID,
} from "@/constants/app-config";
import { useInterviewCascadeData } from "@/hooks/useInterviewCascadeData";
import { Chip } from "@material-ui/core";
import { Card, Modal, Tabs } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FORM_ACTION_TYPES, HH_STATUS_ATTR_ID } from "../constants";

const InterviewDetailModal = ({ metadata, open, onClose, interviewData, formStatus }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState();
  const { interviewCascadeData } = useInterviewCascadeData(interviewData);
  const trackedEntityAttributes = useSelector((state) => state.metadata.programMetadata.trackedEntityAttributes);
  const attributeValues = useSelector((state) => state.data.tei.data.currentTei.attributes);
  const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);

  const HH_Update = interviewData["WBZ6d5BF26K"];
  const noEligibleMember = HH_Update === "No eligible HH member";
  const disabled =
    formStatus === FORM_ACTION_TYPES.VIEW ||
    ["Eligible HH has moved", "Household is closed", "Others"].includes(HH_Update);

  const statusAttr = trackedEntityAttributes.find((item) => item.id === HH_STATUS_ATTR_ID) || { valueSet: [] };
  const currentStatus = statusAttr.valueSet.find((o) => o.value === attributeValues[HH_STATUS_ATTR_ID]);
  const headAttribute = currentCascade?.find((item) => item["QAYXozgCOHu"] === "1") || currentCascade?.[0] || {};

  const items = [
    {
      label: t("householdMembersWithNumber"),
      key: "1",
      disabled: noEligibleMember,
      children: (
        <Card classNames={{ body: "p-0 px-1" }}>
          <HouseHoldMemberTable interviewData={interviewData} onClose={onClose} disabled={disabled} />
          <div className="px-2 pb-2 text-sm text-gray-500">
            Total Members: {interviewCascadeData.filter((i) => i.memberData.ableToStart).length} | Pending:{" "}
            {interviewCascadeData.filter((i) => i.memberData.ableToStart && i.memberData.status !== "COMPLETED")
              .length || 0}{" "}
            | Submitted: {interviewCascadeData.filter((i) => i.memberData.status === "COMPLETED").length || 0}
          </div>
        </Card>
      ),
    },
    {
      label: t("General Survey"),
      key: "2",
      disabled: noEligibleMember,
      children: (
        <Card>
          <HouseHoldSurveyForm
            interviewMetadata={metadata}
            interviewData={interviewData}
            onClose={onClose}
            disabled={disabled}
          />
        </Card>
      ),
    },
    {
      label: t("interviewResult"),
      key: "3",
      children: (
        <Card>
          <InterviewResultForm interviewData={interviewData} onClose={onClose} disabled={disabled} />
        </Card>
      ),
    },
  ];

  return (
    open && (
      <Modal
        footer={null}
        open={true}
        centered
        onCancel={onClose}
        forceRender={false}
        className="!w-full sm:!w-[90dvw] lg:!w-[80dvw] xxl:!w-[70dvw]"
        title={
          <Chip
            className="rounded"
            style={{ backgroundColor: currentStatus?.color, color: currentStatus?.color && "#fff", borderRadius: 4 }}
            label={attributeValues[HH_STATUS_ATTR_ID]}
          />
        }
      >
        <div className="space-y-6 h-[85dvh] pb-6 overflow-y-auto overflow-x-hidden">
          <Card title={t("Interview Details")} classNames={{ header: "!border-b-0 !text-lg", body: "pt-2" }}>
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const foundMetadata = metadata.find((i) => i.id === HOUSEHOLD_INTERVIEW_DATE_DE_ID);
                return (
                  <section>
                    <p className="text-xs uppercase text-gray-500 mb-1">{foundMetadata?.displayFormName}</p>
                    <p className="font-bold text-lg text-black">{interviewData[HOUSEHOLD_INTERVIEW_DATE_DE_ID]}</p>
                  </section>
                );
              })()}
              {(() => {
                const foundMetadata = metadata.find((i) => i.id === HOUSEHOLD_INTERVIEW_ID_DE_ID);
                return (
                  <section>
                    <p className="text-xs uppercase text-gray-500 mb-1">{foundMetadata?.displayFormName}</p>
                    <p className="font-bold text-lg text-black">{interviewData[HOUSEHOLD_INTERVIEW_ID_DE_ID]}</p>
                  </section>
                );
              })()}
              {(() => {
                const foundMetadata = trackedEntityAttributes.find((i) => i.id === HOUSEHOLD_ID_ATTR_ID);

                return (
                  <section>
                    <p className="text-xs uppercase text-gray-500 mb-1">{foundMetadata?.displayFormName}</p>
                    <p className="font-bold text-lg text-black">{attributeValues[HOUSEHOLD_ID_ATTR_ID]}</p>
                  </section>
                );
              })()}
              {(() => {
                return (
                  <section>
                    <p className="text-xs uppercase text-gray-500 mb-1">{t("RESPONDENT NAME")}</p>
                    <p className="font-bold text-lg text-black">
                      {headAttribute["PIGLwIaw0wy"]} {headAttribute["WC0cShCpae8"]} {headAttribute["IENWcinF8lM"]}
                    </p>
                  </section>
                );
              })()}
            </div>
          </Card>
          <Tabs
            className="[&_.ant-tabs-tab-btn]:text-base [&_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:justify-center [&_.ant-tabs-nav]:mb-6"
            destroyInactiveTabPane
            activeKey={currentTab}
            onChange={setCurrentTab}
            defaultActiveKey={noEligibleMember ? "3" : "1"}
            items={items}
          />
        </div>
      </Modal>
    )
  );
};

export default InterviewDetailModal;
