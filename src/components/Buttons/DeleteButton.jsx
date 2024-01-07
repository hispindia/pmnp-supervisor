import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { Button, IconButton } from "@material-ui/core";

import withDeleteConfirmation from "../../hocs/withDeleteConfirmation";

// Icons
import ClearIcon from "@material-ui/icons/Clear";

const DeleteConfirmationButton = withDeleteConfirmation(IconButton);

const DeleteButton = ({ event, onHandleDelete }) => {
  return (
    <DeleteConfirmationButton
      variant="outline-danger"
      size="sm"
      // className={`${yearDeleteItem}`}
      // disableFocusRipple={true}
      // disableRipple={true}
      // disabled={event.status != "ACTIVE"}
      color="secondary"
      messageText={"This process cannot be undone!"}
      cancelText={"Cancel"}
      deleteText={"Delete"}
      onClick={(e) => e.stopPropagation()}
      onDelete={(e) => {
        onHandleDelete(e, event.event);
      }}
    >
      <ClearIcon fontSize="small" />
    </DeleteConfirmationButton>
  );
};

export default DeleteButton;
