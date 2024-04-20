import React, {useState} from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import NewMedicine from "./newMedicine";
import ResumeNewMedicineSolicitud from "./resumeNewSolicitude";
import NewNewMedicine from "./newNewMedicine";

const HomeMedicines = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [medicines, setMedicines] = useState([]);
  const [mode, setMode] = useState('new');

  function setContinue() {
    props.continue();
    // new medicine success snackbar open
  }

  function setNewSolicitudeMemberMode() {
    props.back();
  }

  function setHomeResumeMode(medicines) {
    console.log('home medicines resume', medicines);
    const filteredMedicines = filterStockByMemberQuantity(medicines);
    setMedicines(filteredMedicines);
    setMode('resume');
  }

  switch (mode) {
    default:
    case 'new':
      // return <NewMedicine
      //   continue={setHomeResumeMode}
      //   back={setNewSolicitudeMemberMode}
      //   selectedMemberId={props.selectedMember.id}
      // />
      return <NewNewMedicine
        continue={setHomeResumeMode}
        back={setNewSolicitudeMemberMode}
        selectedMemberId={props.selectedMember.id}
      />;
    case 'resume':
      return <ResumeNewMedicineSolicitud
        error={props.error}
        medicines={medicines}
        selectedMember={props.selectedMember}
        back={setNewSolicitudeMemberMode}
        continue={setContinue}
      />
  }
}

function filterStockByMemberQuantity(rawMedicines) {
  return rawMedicines.filter(rawMedicines => rawMedicines.medicine_quantity > 0);
}

export default HomeMedicines;
