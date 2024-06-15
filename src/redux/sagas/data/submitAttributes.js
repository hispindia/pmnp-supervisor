import { call, put, select, takeLatest } from "redux-saga/effects";
import { SUBMIT_ATTRIBUTES } from "../../types/data/tei";
import { generateDhis2Payload } from "../../../utils";
import { dataApi } from "../../../api";
import {
  mutateAttributes,
  updateNewStatus,
} from "../../actions/data/tei/currentTei";
import {
  getTeiError,
  getTeiSuccessMessage,
  loadTei,
} from "../../actions/data/tei";
import { editingAttributes } from "../../actions/data";
import { getTeiId } from "./utils";
import moment from "moment";
import { push } from "connected-react-router";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";

function* handleSubmitAttributes({ attributes }) {
  yield put(loadTei(true));

  const teiId = yield call(getTeiId);

  const { currentTei, currentEnrollment } = yield call(makePayload, attributes);

  console.log("handleSubmitAttributes", {
    teiId,
    attributes,
    currentTei,
    currentEnrollment,
  });

  try {
    if (teiId) {
      yield call(putTeiToServer, {
        currentTei,
        currentEnrollment,
        attributes,
      });
      yield put(
        getTeiSuccessMessage(
          `Updated tracked entity instance: ${teiId} successfully`
        )
      );
    } else {
      yield call(postTeiToServer, {
        currentTei,
        currentEnrollment,
        attributes,
      });
      yield put(
        getTeiSuccessMessage(
          `Created new tracked entity instance: ${currentTei.trackedEntity} successfully`
        )
      );
    }
    yield put(mutateAttributes(attributes));
    yield put(updateNewStatus(false));
    yield put(editingAttributes(false));
  } catch (e) {
    console.error("handleSubmitAttributes", e.message);
    yield put(getTeiError(e.message));
  }

  yield put(loadTei(false));
}

function* makePayload(attributes) {
  const data = yield select((state) => state.data.tei.data);
  const programMetadata = yield select(
    (state) => state.metadata.programMetadata
  );

  const newCurrentTei = { ...data.currentTei, attributes };
  const { currentTei, currentEnrollment } = generateDhis2Payload(
    { ...data, currentTei: newCurrentTei },
    programMetadata
  );
  return {
    currentTei,
    currentEnrollment,
  };
}

function* putTeiToServer({ currentTei, currentEnrollment, attributes }) {
  console.log("putTeiToServer");
  const { offlineStatus } = yield select((state) => state.common);
  const programMetadataId = yield select(
    (state) => state.metadata.programMetadata.id
  );

  if (offlineStatus) {
    yield call(trackedEntityManager.setTrackedEntityInstance, {
      trackedEntity: currentTei,
    });
  } else {
    // yield call(dataApi.putTrackedEntityInstance, currentTei, programMetadataId);
    yield call(
      dataApi.postTrackedEntityInstances,
      {
        trackedEntities: [currentTei],
      },
      programMetadataId
    );
  }
}

function* postTeiToServer({ currentTei, currentEnrollment, attributes }) {
  const { offlineStatus } = yield select((state) => state.common);
  const programMetadataId = yield select(
    (state) => state.metadata.programMetadata.id
  );
  const newEnrollment = {
    ...currentEnrollment,
    enrolledAt: moment([+attributes.BUEzQEErqa7, 11, 31]).format("YYYY-MM-DD"),
    incidentDate: moment([+attributes.BUEzQEErqa7, 11, 31]).format(
      "YYYY-MM-DD"
    ),
  };

  console.log("postTeiToServer", {
    currentTei,
    currentEnrollment,
    attributes,
    newEnrollment,
  });

  if (offlineStatus) {
    const teiWithEnrollment = currentTei;
    teiWithEnrollment.enrollments = [newEnrollment];

    console.log(teiWithEnrollment);

    yield call(trackedEntityManager.setTrackedEntityInstance, {
      trackedEntity: teiWithEnrollment,
    });
  } else {
    yield call(
      dataApi.pushTrackedEntityInstance,
      {
        trackedEntities: [currentTei],
      },
      programMetadataId
    );
    yield call(
      dataApi.pushEnrollment,
      {
        enrollments: [newEnrollment],
      },
      programMetadataId
    );
  }

  yield put(push(`/form?tei=${currentTei.trackedEntity}`));
}

export default function* submitAttributes() {
  yield takeLatest(SUBMIT_ATTRIBUTES, handleSubmitAttributes);
}
