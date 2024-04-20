import {Box, IconButton, Typography} from "@mui/material";
import {AddOutlined, ArrowBackOutlined} from "@mui/icons-material";
import React, {useState} from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import IndexMembers from "../members/indexMembers";
import HomeMedicines from "../medicines/homeMedicines";
import Grid from "@mui/material/Grid";
import Header from "../../indevelop/primitives/Header";
import NewIndexMember from "../members/newIndexMember";

const NewSolicitude = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [mode, setMode] = useState('member');
  const [medicines, setMedicines] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  function setMedicinesAndContinue(medicines) {
    setMedicines(medicines);
    setMode('show')
  }

  function continueAndStartOver() {
    setMedicines([]);
    setSelectedMember({});
    props.continue();
  }

  function removeMedicinesAndStartOver() {
    setMedicines([]);
    setSelectedMember({});
    setMode('member')
  }

  function setSelectedMemberAndContinue(member) {
    setSelectedMember(member);
    setMode('medicine');
  }

  const indexComponent = () => {
    return <Grid container spacing={2}>
      <Grid item xs={8}>

        <Box m="10px">
          <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
            <IconButton color="secondary" variant="contained" onClick={(e) => {
              props.back();
            }}>
              <Typography
                variant="h4"
                sx={{marginRight: "10px"}}>
                Volver
              </Typography>
              <ArrowBackOutlined/>
            </IconButton>
          </Box>
          <NewIndexMember canNew={false} setSelectedMember={setSelectedMemberAndContinue}/>
          {/*<IndexMembers canNew={false} setSelectedMember={setSelectedMemberAndContinue}/>*/}
        </Box>

      </Grid>
      <Grid item xs={4}>
        <Header
          title="Selecciona un usuario"
          subtitle="Pincha un usuario para elegir su medicina"
        />
      </Grid>
    </Grid>;
  };

  switch (mode) {
    default:
    case 'member':
      return indexComponent();
    case 'medicine':
      return <HomeMedicines
        error={props.error}
        setMedicines={setMedicinesAndContinue}
        back={removeMedicinesAndStartOver}
        continue={continueAndStartOver}
        selectedMember={selectedMember}
      />
  }
}

export default NewSolicitude;
