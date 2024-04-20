import {useEffect, useState} from "react";
import IndexMembers from "./indexMembers";
import NewMember from "./newMember";
import ShowMember from "./showMember";
import IndexSolicitudes from "../solicitudes/indexSolicitudes";
import NewSolicitude from "../solicitudes/newSolicitude";
import {ShowSolicitude} from "../solicitudes/showSolicitude";
import {SnackBarComponent} from "../SnackBarComponent";
import NewIndexMember from "./newIndexMember";

const HomeMembers = ({...props}) => {
  const [mode, setMode] = useState('home');
  const [selectedMember, setSelectedMember] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");


  useEffect(() => {
    setMode('home');
  }, []);

  function setNewMode() {
    setMode('new')
  }

  function setHomeMode() {
    setMode('home');
  }

  function setSelectedMemberAndContinue(member) {
    setSelectedMember(member);
    setMode('show');
  }

  function setHomeModeFromSuccess() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('success');
    setSnackBarMessage('Éxito creando al socio');
  }

  function setHomeModeFromError() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('error');
    setSnackBarMessage('Error creando al socio')
  }

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  };
  function getDisplay() {
    switch (mode) {
      default:
      case 'home':
        // return <IndexMembers canNew={true} new={setNewMode} setSelectedMember={setSelectedMemberAndContinue}/>
        return <NewIndexMember canNew={true} new={setNewMode} setSelectedMember={setSelectedMemberAndContinue}/>;
      case 'show':
        return <ShowMember back={setHomeMode} selectedMemberId={selectedMember.id}/>
      case 'new':
        return <NewMember error={setHomeModeFromError} back={setHomeMode} continue={setHomeModeFromSuccess}/>
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
export default HomeMembers;
