import { dataApi } from "@/api";
import { useSelector } from "react-redux";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";

export const usePushData = () => {
  const { offlineStatus } = useSelector((state) => state.common);

  const pustTei = async ({ currentTei }) => {
    if (offlineStatus) {
      await trackedEntityManager.setTrackedEntityInstance({
        trackedEntity: currentTei,
      });
    } else {
      await dataApi.postTrackedEntityInstances({
        trackedEntities: [currentTei],
      });
    }
  };

  return {
    pustTei,
  };
};
