import { put, takeLatest, call } from "redux-saga/effects";
import { dataApi, metadataApi } from "../../api";
import { GET_USERS } from "../actions/metadata/type";
import { setUsers } from "../actions/metadata";

function* getUsers({orgUnitId}) {
  try {
    const orgUnitUsers = yield call(
        metadataApi.getOUUsers,
        orgUnitId
    );
    const ouUsers = orgUnitUsers?.users.map(user => user.id) || [];

    const userList = yield call(
        metadataApi.getUsers,
        ouUsers.join(',')
    );
    
    const userGroup = userList.users.filter(u => u.userGroups?.some(g => g.id === "VfVrBMOl8tH"))
    .map(u => ({ ...u, value: u.username, label: u.name }));
    
    yield put(setUsers(userGroup));

  } catch (e) {
    const result = yield e.json();

    if (result.message) {
        console.log(result.message)
    //   yield put(getTeisErrorMessage(result.message));
    } else {
        console.log(e.message)
    //   yield put(getTeisErrorMessage(e.message));
    }
  } 
}


export default function* getUsersSaga() {
  yield takeLatest(GET_USERS, getUsers);
}
