import {Box, Button, Chip, FormControl, Grid, IconButton, InputLabel, TextField} from "@mui/material";
import {ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import {Formik} from "formik";
import React, {useEffect, useState} from 'react';
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from "@mui/material/Typography";
import {stockTypeChip} from "../utils";

const NewStocks = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [stockType, setStockType] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState('');

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

  async function createStock(stock) {
    return fetch(`http://localhost:8080/admin/stock`, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(stock)
    });
  }

  async function handleSubmit(newStock) {
    newStock.stockType = selectedStockType;
    const response = await createStock(newStock);
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

  const handleStockType = (event) => {
    const selected = event.target.value;
    setSelectedStockType(selected);
  };

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

  function getStockForm() {
    const initialValues = {
      name: '',
      quantity: 0,
      // stockType: '',
    };
    return <Formik
      onSubmit={(values) => {
        handleSubmit(values)
      }}
      enableReinitialize={true}
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
              label="Nombre stock"
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
              type="number"
              label="Cantidad"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.quantity || 0}
              name="quantity"
              error={!!touched.quantity && !!errors.quantity}
              helperText={touched.quantity && errors.quantity}
              sx={{gridColumn: "span 2"}}
            />
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Donación"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.donation || 0}
              name="donation"
              error={!!touched.donation && !!errors.donation}
              helperText={touched.donation && errors.donation}
              sx={{gridColumn: "span 2"}}
            />

            <FormControl sx={{m: 1, minWidth: 120}}>
              <InputLabel id="stockType-label">Tipo stock</InputLabel>
              <Select
                labelId="stockType-label"
                id="stockType"
                name="stockType"
                // open={open}
                // onClose={handleClose}
                // onOpen={handleOpen}
                value={selectedStockType}
                label="Tipo stock"
                onChange={handleStockType}
              >
                {stockType.map(renderMenuItem)}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Crear
            </Button>
          </Box>
        </form>)}
    </Formik>;
  }

  return (<Grid container spacing={2}>
    <Grid item xs={6}>
      <Box m="10px">
        {backButton()}
        <Header
          title="Crea un nuevo stock"
          subtitle="Completa el formulario y crea un nuevo stock"
        />
      </Box>
      {getStockForm()}
    </Grid>
    <Grid item xs={6}>
    </Grid>
  </Grid>);
}

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  quantity: yup.string().required("required"),
  // stockType: yup.object().required('required stock type')
});

export default NewStocks;

