import {Box, Chip, IconButton, Typography, useTheme} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import {datagridCssTable, stockTypeChip} from "../utils";

const IndexMedicines = ({...props}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const medicineColumns = [
    {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
    {
      field: "stockType", headerName: "Tipo de stock", flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Chip variant="outlined" {...stockTypeChip(params)} />;
      }
    },
    {field: "quantity", headerName: "Cantidad", type: "number"},
    {field: "medicine_quantity", headerName: "Medicina socio", flex: 1},
    {field: "donation", headerName: "Donación", type: "number", flex: 0.5, cellClassName: "name-column--cell"},
  ];

  function medicineTable() {
    return (<>
      <Header
        title="Lista de medicinas seleccionadas para dispensar"
        subtitle="Confirma la medicina para el socio"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={datagridCssTable(colors)}
      >
        <DataGrid
          autoHeight
          rows={props.medicines}
          columns={medicineColumns}
          components={{Toolbar: GridToolbar}}
        />
      </Box>
    </>);
  }

  return (<Box m="10px">
    <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="end" mt="20px">
      <IconButton color="secondary" variant="contained" onClick={(e) => {
        props.confirmMedicines();
      }}>
        <Typography
          variant="h4"
          sx={{marginRight: "10px"}}>
          Confirmar medicina para el socio
        </Typography>
        <AddOutlined/>
      </IconButton>
    </Box>
    {medicineTable()}
  </Box>);
}

export default IndexMedicines;
