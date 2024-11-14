import { UploadOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { createFakeData } from "./createFakeData";

import * as eventManager from "@/indexDB/EventManager/EventManager";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

const shouldShowTestButton = () => localStorage.getItem("showTestButton");

const BulkImportButton = () => {
  if (!shouldShowTestButton()) {
    return null;
  }

  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleMakeFakeData = async () => {
    for (let i = 0; i < 10; i++) {
      const fakeData = createFakeData();

      await trackedEntityManager.setTrackedEntityInstances({
        trackedEntities: fakeData.teis,
      });
      await eventManager.setEvents({ events: fakeData.events });
    }

    notification.success({
      message: "Bulk import successful",
      description: "Data has been imported to OfflineData",
      placement: "bottomRight",
      duration: 5,
    });
  };

  return (
    <>
      <Button
        onClick={handleMakeFakeData}
        style={{
          marginRight: "10px",
        }}
        shape="round"
        size="small"
        type="primary"
        danger
        icon={<UploadOutlined />}
      >
        Add 10 fake data
      </Button>
      <Button
        onClick={clearCache}
        style={{
          marginRight: "10px",
        }}
        shape="round"
        size="small"
        type="primary"
        danger
      >
        Clear all
      </Button>
    </>
  );
};

export default BulkImportButton;
