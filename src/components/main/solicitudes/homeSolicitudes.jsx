import {useEffect, useState} from "react";
import IndexSolicitudes from "./indexSolicitudes";
import NewSolicitude from "./newSolicitude";
import {ShowSolicitude} from "./showSolicitude";
import {SnackBarComponent} from "../SnackBarComponent";
import NewIndexSolicitudes from "./newIndexSolicitudes";

const HomeSolicitudes = ({...props}) => {
  const [mode, setMode] = useState('home');
  const [selectedSolicitude, setSelectedSolicitude] = useState('home');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");


  useEffect(() => {
  }, []);

  function setNewMode() {
    setMode('new');
  }

  function setHomeMode() {
    setMode('home');
  }

  function setHomeModeFromSuccess() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('success');
    setSnackBarMessage('Éxito al ingresar la solicitud');
  }

  function setHomeModeFromError() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('error');
    setSnackBarMessage('Error al ingresar la solicitud, sobrepasa límite mensual')
  }

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  };


  function setSelectedSolicitudeAndContinue(solicitude) {
    setSelectedSolicitude(solicitude);
    setMode('show');
  }

  function getDisplay() {
    switch (mode) {
      default:
      case 'home':
        // return <IndexSolicitudes canNew={props.canNew} new={setNewMode}
        //                          member={props.selectedMember}
        //                          setSelectedSolicitude={setSelectedSolicitudeAndContinue}/>;
        return <NewIndexSolicitudes canNew={props.canNew} new={setNewMode}
                                 member={props.selectedMember}
                                 setSelectedSolicitude={setSelectedSolicitudeAndContinue}/>;
      case 'new':
        return <NewSolicitude continue={setHomeModeFromSuccess} back={setHomeMode}
        error={setHomeModeFromError}/>;
      case 'show':
        return <ShowSolicitude showMemberInformation={props.showMemberInformation} back={setHomeMode}
                               solicitudeId={selectedSolicitude.id}/>
    }
  }

  return (<>
    <SnackBarComponent
      openSnackbar={openSnackbar}
      onClose={handleCloseSnackBar}
      snackBarStatus={snackBarStatus}
      snackBarMessage={snackBarMessage}
    />
    {getDisplay()}
  </>)
};

export default HomeSolicitudes;
