import {Box, Chip, IconButton, Typography, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import Header from "../../indevelop/primitives/Header";
import React, {useEffect, useState} from "react";
import {datagridCssTable, stockTypeChip, toCurrency} from "../utils";
import {green} from "@mui/material/colors";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";

const IndexStocks = ({...props}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState({});

  useEffect(() => {
    getStocks()
      .then(response => {
        setData(response);
      })
  }, []);

  async function getStocks() {
    return fetch('http://localhost:8080/admin/stocks', {
      method: 'GET'
    })
      .then(data => data.json())
      .catch(e => {
        console.log('stocks get error ', e);
      })
  }

  const handleRowClick = (params) => props.setSelectedStock(params.row);

  const stockColumns = [
    {field: "id", headerName: "ID", flex: 0.5},
    {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
    {field: "quantity", headerName: "Cantidad", type: "number", headerAlign: "left", align: "center",
      renderCell: (params) => {
        return <>{params.value}</>;
      }},
    {field: "donation", headerName: "Donación", type: "number", flex: 0.5, cellClassName: "name-column--cell",
      renderCell: (params) => {
        return toCurrency(params.value);
      }
    },
    {
      field: "stockType", headerName: "Tipo de stock", flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <Chip variant="outlined" {...stockTypeChip(params)} />;
      }
    },
  ];

  function stockTable() {
    return <>
      <Header
        title="Stock"
        subtitle="Stock Dispensario LATAM"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={datagridCssTable(colors)}
      >
        <DataGrid
          autoHeight
          rows={getTableData()}
          columns={stockColumns}
          onRowClick={handleRowClick}
          components={{Toolbar: GridToolbar}}
        />
      </Box>
    </>;
  }

  function getTableData() {
    if (!data || Object.keys(data).length === 0) {
      return [];
    }
    if (data.length > 0) {
      return data;
    } else {
      return [data];
    }
  }

  function canNew() {
    if (!props.new) return;
    return (<Box  sx={{marginLeft: "auto"}} display="flex" justifyContent="end" mt="20px">
      <IconButton color="secondary" variant="contained" onClick={(e) => {
        props.new();
      }}>
        <Typography
          variant="h4"
          sx={{marginRight: "10px"}}>
          Crear
        </Typography>
        <FilterVintageIcon style={{fill: green[500]}} fontSize={"large"}/>
      </IconButton>
    </Box>);
  }

  return <Box m="10px">
    {canNew()}
    {stockTable()}
  </Box>
};

export default IndexStocks;
