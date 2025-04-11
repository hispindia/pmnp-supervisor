import { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import InterviewResultForm from "./InterviewResultForm";
import HouseHoldSurveyForm from "./HouseHoldSurveyForm";
import { FORM_ACTION_TYPES } from "../constants";
import HouseHoldMemberTable from "./HouseHoldMemberTable";

const InterviewDetailModal = ({ open, onClose, interviewData, selectedRowIndex, formStatus }) => {
  const [currentTab, setCurrentTab] = useState();
  const { t } = useTranslation();

  const items = [
    {
      label: t("householdMembers"),
      key: "1",
      children: <HouseHoldMemberTable interviewData={interviewData} onClose={onClose} />,
    },
    {
      label: t("Household Survey"),
      key: "2",
      children: <HouseHoldSurveyForm interviewData={interviewData} onClose={onClose} />,
    },
    {
      label: t("interviewResult"),
      key: "3",
      children: <InterviewResultForm interviewData={interviewData} onClose={onClose} />,
    },
  ];

  return (
    <Modal backdrop="static" size="xl" keyboard={false} show={open} scrollable>
      <Modal.Body>
        <Card style={{ border: 0 }}>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              {formStatus !== FORM_ACTION_TYPES.ADD_NEW && "No." + (selectedRowIndex + 1)}
            </Card.Subtitle>
            <Tabs
              style={{ overflow: "visible" }}
              destroyInactiveTabPane
              activeKey={currentTab}
              onChange={setCurrentTab}
              defaultActiveKey="1"
              tabBarExtraContent={{
                right: (
                  <div
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
                  </div>
                ),
              }}
              items={items}
            />
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default InterviewDetailModal;
