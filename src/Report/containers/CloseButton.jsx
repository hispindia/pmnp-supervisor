import React from "react";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const useButtonStyle = makeStyles({
  root: {
    fontSize: "2.5rem"
  }
});

function CloseButton(props) {
  const buttonStyle = useButtonStyle();
  return (
    <IconButton
      size="small"
      component="span"
      onClick={() => {
        props.history.push("/list");
      }}
    >
      <Close classes={buttonStyle} />
    </IconButton>
  );
}

CloseButton.propTypes = {};
CloseButton.defaultProps = {};

export default CloseButton;
