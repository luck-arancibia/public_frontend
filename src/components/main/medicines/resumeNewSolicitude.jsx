import {Alert, Box, Chip, IconButton, Snackbar, Typography, useTheme} from "@mui/material";
import {AddOutlined, ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import React, {useState} from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import {datagridCssTable, stockTypeChip, toCurrency} from "../utils";
import Grid from "@mui/material/Grid";

const ResumeNewMedicineSolicitud = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  async function postSolicitude(memberId, medicines) {
    return fetch('http://localhost:8080/admin/solicitude', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "delivered": false,
        "medicines": medicines,
        "member_id": memberId,
        "paid": false
      })
    });
  }

  function getMedicines(medicines) {
    medicines.forEach(medicine => {
      medicine.quantity = parseInt(medicine.medicine_quantity);
    })
    return medicines.map(({name, quantity, stockType}) => ({name, quantity, stockType}))
  }

  async function createMedicineAndContinue() {
    const memberId = props.selectedMember.id;
    const memberNewMedicines = getMedicines(props.medicines);
    const request = postSolicitude(memberId, memberNewMedicines)
    const response = await request;
    if (response?.ok) {
      props.continue();
    } else {
      props.error();
    }
  }

  const stockColumns = [
    {
      field: "name", headerName: "Name", flex: 0.5, cellClassName: "name-column--cell",
      renderCell: (params) => {
        return (<>
          {stockTypeChip(params.row.stockType, false, true).icon}
          <div>{params.formattedValue}</div>
        </>)
      }
    },
    {field: "medicine_quantity", headerName: "Cantidad de Medicina", flex: 0.5, type: "number"},
    {
      field: "donation", headerName: "Donación", type: "number", flex: 0.5, renderCell: (params) => {
        const donation = params.value * params.row.medicine_quantity;
        return (<div>
          {toCurrency(donation)}
        </div>);
      },
    },
    {
      field: "quantity", headerName: "Cantidad restante de stock", type: "number", flex: 0.5, renderCell: (params) => {
        const quantity = params.formattedValue - params.row.medicine_quantity;
        return (<div>
          {quantity}
        </div>);
      },
    },
  ];

  function getTotalDonation() {
    let total = 0;
    props.medicines.forEach(medicine => {
      total = total + medicine.medicine_quantity * medicine.donation;
    });
    return `Total ${toCurrency(total)}`;
  }
  function stockTable() {
    console.log('props.medicines', props.medicines);
    console.log('props', props);
    // const subtitle = `Confirma medicinas para ${props.selectedMember.name} | rut ${props.selectedMember.rut}`;
    return (<Box m="20px">
      <Header
        title="Resumen medicinas"
        subtitle="Confirma medicinas para"
      />
      <Typography
        variant="h4"
        sx={{marginRight: "10px"}}>
        {props.selectedMember.name}
      </Typography>
      <Typography
        variant="h5"
        sx={{marginRight: "10px"}}>
         rut {props.selectedMember.rut}
      </Typography>
      <Typography
        variant="h5"
        align="right"
      >
        {getTotalDonation()}
      </Typography>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={datagridCssTable(colors)}
      >
        <DataGrid
          autoHeight
          rows={props.medicines}
          columns={stockColumns}
          components={{Toolbar: GridToolbar}}
        />
      </Box>
    </Box>);
  }

  function backContinueButtons() {
    return <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
          <IconButton color="secondary" variant="contained" onClick={(e) => {
            props.back();
          }}>
            <Typography
              variant="h4"
              sx={{marginRight: "10px"}}>
              Cancelar
            </Typography>
            <AddOutlined/>
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box  sx={{marginLeft: "auto"}} display="flex" justifyContent="end"
             mt="20px">
          <IconButton color="secondary" variant="contained" onClick={createMedicineAndContinue}>

            <Typography
              variant="h4"
              sx={{marginRight: "10px"}}>
              Continuar
            </Typography>
            <AddOutlined/>
          </IconButton>
        </Box>
      </Grid>
    </Grid>;
  }

  return (<>
    {backContinueButtons()}
    {stockTable()}
  </>);
}

export default ResumeNewMedicineSolicitud;

