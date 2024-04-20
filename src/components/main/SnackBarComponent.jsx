import {Alert, Snackbar} from "@mui/material";
import React from "react";


export const SnackBarComponent = ({...props}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
  };

  return (<Snackbar open={props.openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleClose}>
    <Alert
      onClose={handleClose}
      severity={props.snackBarStatus}
      variant="filled"
      sx={{width: '100%'}}
    >
      {props.snackBarMessage}
    </Alert>
  </Snackbar>)
}
