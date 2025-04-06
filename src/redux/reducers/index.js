import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import metadata from "./metadata";
import data from "./data/index";
import teis from "./teis";
import common from "./common";
import me from "./me";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    metadata,
    data,
    teis,
    common,
    me,
  });

export default createRootReducer;
