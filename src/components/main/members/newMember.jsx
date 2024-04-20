import {Box, Button, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import {FieldArray, Formik} from "formik";
import React, {useEffect, useState} from 'react';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import {stockTypeChip} from "../utils";

const NewMember = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [stockType, setStockType] = useState();

  useEffect(() => {
    getStockType()
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

  async function createMember(member) {
    return fetch(`http://localhost:8080/admin/member`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(member)
    });
  }

  async function handleSubmit(values) {
   const response = await createMember(values)
    if (response?.ok) {
      props.continue();
    } else {
      props.error();
    }
  }

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
    const initialValues = {
      name: '',
      rut: '',
      phone: '',
      address: '',
      email: '',
      prescriptions: stockType,
    };
    return <Formik
      onSubmit={(values) => {
        handleSubmit(values)
      }}
      enableReinitialize={true}
      // initialValues={member}
      initialValues={initialValues}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FieldArray
                name="prescriptions"
                render={arrayHelpers => (
                  <div>
                    {values.prescriptions && values.prescriptions.length > 0 ?
                      values.prescriptions.map((prescription, index) => (
                        <div key={index}>
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
                            label={`Cantidad mensual de ${prescription.name}`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={prescription.quantity || prescription.maxPerMonth}
                            // defaultValue={prescription.maxPerMonth || 0}
                            name={`prescriptions[${index}].quantity`}
                            error={!!touched.rut && !!errors.rut}
                            helperText={touched.rut && errors.rut}
                          />
                        </div>
                      )) : (<div>sin recetas</div>)
                    }
                  </div>
                )}
              />
            </Grid>
            <Grid item xs={6}>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Crear
            </Button>
          </Box>
        </form>
      )}
    </Formik>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box m="10px">
          {backButton()}
          <Header
            title="Socios"
            subtitle="Información socio y dispensaciones"
          />
        </Box>
        {getMemberForm()}
      </Grid>
      <Grid item xs={6}>
        {/*<HomeSolicitudes canNew={false} selectedMember={member}/>*/}
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

export default NewMember;
