import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const withDeleteConfirmation =
  (Component) =>
  ({
    onCancel,
    onDelete,
    onClick,
    cancelText,
    deleteText,
    messageText,
    ...props
  }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      onClick && onClick(event);
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
      <>
        <Component onClick={handleClick} {...props} />
        <Popover
          elevation={1}
          onExit={(e) => {
            // console.log(e);
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box p={1}>
            <Typography color="secondary" component="h5">
              {messageText}
            </Typography>
            <Box>
              <Grid container justify="flex-end">
                <ButtonGroup size="small">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose(e);
                      onCancel && onCancel(e);
                    }}
                    size="small"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={(e) => {
                      onDelete && onDelete(e);
                      handleClose(e);
                    }}
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    {deleteText}
                  </Button>
                </ButtonGroup>
              </Grid>
            </Box>
          </Box>
        </Popover>
      </>
    );
  };

export default withDeleteConfirmation;
