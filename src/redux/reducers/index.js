import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import metadata from "./metadata";
import data from "./data/index";
import teis from "./teis";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    metadata,
    data,
    teis,
  });

export default createRootReducer;
