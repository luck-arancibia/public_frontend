import {Box, Button, Chip, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import {FieldArray, Formik} from "formik";
import React, {useEffect, useState} from 'react';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
import HomeSolicitudes from "../solicitudes/homeSolicitudes";
import {stockTypeChip} from "../utils";

const ShowMember = ({...props}) => {
  const [member, setMember] = useState({});
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    getMember()
      .then(response => {
        setMember(response);
      });
  }, []);

  async function getMember() {
    return fetch(`http://localhost:8080/admin/member/${props.selectedMemberId}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .catch(e => {
        console.log('member get error ', e);
      })
  }

  async function updateMember(member) {
    return fetch(`http://localhost:8080/admin/member`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(member)
    }).catch(e => {
      console.log('update member error ', e);
    });
  }

  const handleSubmit = (values) => {
    updateMember(values)
      .then(() => {
        console.log('updated member');
      })
  };

  function backButton() {
    return (<Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
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
    </Box>);
  }

  function getMemberForm() {
    return <Formik
      onSubmit={(values) => {
        handleSubmit(values)
      }}
      enableReinitialize={true}
      initialValues={member}
      // initialValues={initialValues}
      validationSchema={checkoutSchema}
    >
      {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
            }}
          >

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Rut"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.rut || ''}
              name="rut"
              error={!!touched.rut && !!errors.rut}
              helperText={touched.rut && errors.rut}
              sx={{gridColumn: "span 2"}}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nombre"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name || ''}
              name="name"
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{gridColumn: "span 2"}}
            />

            <TextField
              fullWidth
              variant="filled"
              type="email"
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email || ''}
              name="email"
              error={!!touched.email && !!errors.email}
              sx={{gridColumn: "span 2"}}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Número telefono móbil"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone || ''}
              name="phone"
              error={!!touched.phone && !!errors.phone}
              helperText={touched.phone && errors.phone}
              sx={{gridColumn: "span 2"}}
            />

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Dirección"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.address || ''}
              name="address"
              error={!!touched.address && !!errors.address}
              helperText={touched.address && errors.address}
              sx={{gridColumn: "span 2"}}
            />
          </Box>
          <Divider textAlign="center"> Recetas </Divider>

          {/*<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>*/}
          <h2>Total mensual</h2>

          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(1, minmax(0, 1fr))"
            sx={{
              "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
            }}
          >
            {values.prescriptions && values.prescriptions.length > 0 ?
              values.prescriptions.map((prescription, index) => {
                const leftPrescriptions = values.leftPrescriptions;
                const leftPrescriptionAByType = leftPrescriptions.find(left => left.stockType === prescription.stockType);
                return (
                  <div key={index}>
                    <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                      sx={{
                        "& > div": {gridColumn: isNonMobile ? undefined : "span 2"},
                      }}
                    >
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {stockTypeChip(prescription.stockType, false, true).icon}
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        variant="filled"
                        type="number"
                        label={`Total ${prescription.name}`}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={prescription.maxPerMonth || ''}
                        name={`prescriptions[${index}].maxPerMonth`}
                        error={!!touched.rut && !!errors.rut}
                        helperText={touched.rut && errors.rut}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={`Restante mensual ${leftPrescriptionAByType.name}`}
                        inputProps={{readOnly: true}}
                        defaultValue={leftPrescriptionAByType.leftPerMonth || ''}
                        name="rut"
                      />
                    </Box>
                  </div>)
              }) : (
                <div>sin recetas</div>)}
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Editar
            </Button>
          </Box>
        </form>
      )}
    </Formik>;
  }

  if (Object.keys(member).length === 0) {
    return;
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Box m="10px">
          {backButton()}
          <Header
            title="Socios"
            subtitle="Información socio y dispensaciones"
          />
        </Box>
        {getMemberForm()}
      </Grid>
      <Grid item xs={8}>
        <HomeSolicitudes showMemberInformation={false} canNew={false} selectedMember={member || {}}/>
      </Grid>
    </Grid>
  );
}







const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  rut: yup.string().required("required"),
  phone: yup.string().required("required"),
  address: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  prescriptions: yup.array().required("required"),
});

export default ShowMember;
