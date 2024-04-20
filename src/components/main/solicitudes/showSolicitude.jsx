import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton, InputAdornment,
  InputLabel,
  TextField
} from "@mui/material";
import {ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import React, {useEffect, useState} from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {stockTypeChip} from "../utils";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export const ShowSolicitude = ({...props}) => {
  const [solicitude, setSolicitude] = useState({});
  const [paid, setPaid] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [stockType, setStockType] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    getSolicitude()
      .then(response => {
        setSolicitude(response);
        setPaid(response.paid)
        setDelivered(response.delivered)
      })
      .then(() => getStockType())
      .then(response => setStockType(response));
  }, []);

  async function getStockType() {
    return fetch('http://localhost:8080/admin/stock/types', {
      method: 'GET'
    }).then(data => data.json())
      .catch(e => {
        console.log('stock type get error ', e);
      })
  }

  async function getSolicitude() {
    return fetch(`http://localhost:8080/admin/solicitude/${props.solicitudeId}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .catch(e => {
        console.log('solicitude get error ', e);
      })
  }

  async function getMember() {
    return fetch(`http://localhost:8080/admin/member/${props.selectedMemberId}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .catch(e => {
        console.log('member get error ', e);
      })
  }

  async function putDelivered(delivered) {
    return fetch(`http://localhost:8080/admin/solicitude/delivered/${props.solicitudeId}/`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({delivered})
    }).catch(e => {
      console.log('solicitude delivered error ', e);
    })
  }

  async function putPaid(paid) {
    return fetch(`http://localhost:8080/admin/solicitude/paid/${props.solicitudeId}/`, {
      method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({paid})
    }).catch(e => {
      console.log('solicitude paid error ', e);
    })
  }

  const handleChangePaid = (event) => {
    const checked = event.target.checked;
    putPaid(checked)
      .then(() => setPaid(checked))
  };

  const handleChangeDelivered = (event) => {
    const checked = event.target.checked;
    putDelivered(checked)
      .then(() => setDelivered(checked))
  };

  function getMemberForm() {
    if (Object.keys(solicitude).length === 0) return;
    return (<>
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
        }}
      >
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Rut"
          inputProps={{readOnly: true}}
          defaultValue={solicitude.member.rut || ''}
          name="rut"
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Nombre"
          inputProps={{readOnly: true}}
          defaultValue={solicitude.member.name || ''}
        />

        <TextField
          fullWidth
          variant="filled"
          type="email"
          label="Email"
          inputProps={{readOnly: true}}
          defaultValue={solicitude.member.email || ''}
          name="email"
        />

        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Número telefono móbil"
          inputProps={{readOnly: true}}
          defaultValue={solicitude.member.phone || ''}
          name="phone"
        />
      </Box>
      {/*<Divider textAlign="center"> Recetas </Divider>*/}
      {/*<Box*/}
      {/*  display="grid"*/}
      {/*  gap="30px"*/}
      {/*  gridTemplateColumns="repeat(2, minmax(0, 1fr))"*/}
      {/*  sx={{*/}
      {/*    "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {solicitude.member.prescriptions.map((prescription, index) => (*/}
      {/*    <div key={index}>*/}
      {/*      <h2> Cantidad mensual de {prescription.name} </h2>*/}
      {/*      <TextField*/}
      {/*        fullWidth*/}
      {/*        variant="filled"*/}
      {/*        type="number"*/}
      {/*        label={`tipo ${prescription.name}`}*/}
      {/*        inputProps={{readOnly: true}}*/}
      {/*        defaultValue={prescription.maxPerMonth || ''}*/}
      {/*        name={`prescriptions[${index}].maxPerMonth`}*/}
      {/*        sx={{gridColumn: "span 2"}}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</Box>*/}
    </>);
  }

  const renderMenuItem = (value) => {
    return (
      <MenuItem key={value.stockType} value={value.stockType}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>{value.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Chip {...stockTypeChip(value.stockType, false, true)} />
          </Grid>
        </Grid>
      </MenuItem>
    );
  };

  function getSolicitudeForm() {
    return (<>
      <FormGroup>
        <FormControlLabel control={
          <Checkbox
            name={'paid'}
            checked={paid}
            onChange={handleChangePaid}
            inputProps={{'aria-label': 'controlled'}}
          />
        } label="Donación"/>
        <FormControlLabel control={
          <Checkbox
            name={'delivered'}
            checked={delivered}
            onChange={handleChangeDelivered}
            inputProps={{'aria-label': 'controlled'}}
          />
        } label="Entregado"/>
      </FormGroup>
      <Divider variant="middle" textAlign="center"> Medicinas </Divider>
      <div>
        {solicitude.medicines && solicitude.medicines.length > 0 ?
          solicitude.medicines.map((medicine, index) => (
            <div key={index}>

              <Box m="10px">
                <Grid container spacing={2}>

                  <Grid item xs={4}>
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {stockTypeChip(medicine.stockType, false, true).icon}
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{readOnly: true}}
                      defaultValue={medicine.name || ''}
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Nombre stock"
                      name="name"
                      // sx={{gridColumn: "span 2"}}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      inputProps={{readOnly: true}}
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Cantidad stock"
                      defaultValue={medicine.quantity || 0}
                      name="quantity"
                      // sx={{gridColumn: "span 2"}}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      inputProps={{readOnly: true}}
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Donación"
                      defaultValue={medicine.donation || 0}
                      name="donation"
                      // sx={{gridColumn: "span 2"}}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          )) : (<div>sin medicinas</div>)
        }
      </div>
    </>);
  }

  function canBack() {
    if (!props.back) return;
    return <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
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
    </Box>;
  }

  function getDisplay() {
    if (props.showMemberInformation) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box m="10px">
              <Header
                subtitle="Información de la dispensación"
              />
            </Box>
            {getSolicitudeForm()}
          </Grid>
          <Grid item xs={6}>
            <Header
              subtitle="Información socio"
            />
            {getMemberForm()}
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box m="10px">
              <Header
                subtitle="Información de la dispensación"
              />
            </Box>
            {getSolicitudeForm()}
          </Grid>
        </Grid>
      );
    }

  }
  const title = `Información de la solicitud ID ${solicitude.id}`
  return (
    <Box m="10px">
      {canBack()}
      <Header
        title={title}
      />
      {getDisplay()}
    </Box>
  );
}
