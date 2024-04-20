import {Box, Chip, IconButton, Typography, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import Header from "../../indevelop/primitives/Header";
import React, {useEffect, useState} from "react";
import {datagridCssTable, stockTypeChip, toCurrency} from "../utils";
import {green} from "@mui/material/colors";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import ServerPaginationGrid from "../tableComponent";

export default function NewIndexStocks({...props}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageState, setPageState] = useState({
    page: 0,
    pageSize: 10,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  const setPageSize = (pageSize) => {
    setPageState({...pageState, pageSize: pageSize, page: 0});
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => {
        return {...old, isLoading: true};
      });
      const json = await getStocks();
      setPageState((old) => ({
        ...old,
        isLoading: false,
        rows: json.body,
        rowCount: json.totalElements,
        pageSize: json.pageable.pageSize,
        page: json.pageable.pageNumber,
        // rowCount: 100
      }));
    };
    fetchData();
  }, [pageState.pageSize, pageState.page]);

  async function getStocks() {
    return fetch(`http://localhost:8080/admin/stocks?page=${
      pageState.page}&pageSize=${pageState.pageSize}`, {method: 'GET'})
      .then(data => data.json())
      .catch(e => {
        console.log('stocks get error ', e);
      })
  }

  const handleRowClick = (params) => props.setSelectedStock(params.row);

  const columns = [
    {field: "id", headerName: "ID", flex: 0.5},
    {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
    {
      field: "quantity", headerName: "Cantidad", type: "number", headerAlign: "left", align: "center",
      renderCell: (params) => {
        return <>{params.value}</>;
      }
    },
    {
      field: "donation", headerName: "Donación", type: "number", flex: 0.5, cellClassName: "name-column--cell",
      renderCell: (params) => {
        return toCurrency(params.value);
      }
    },
    {
      field: "stockType", headerName: "Tipo de stock", flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (<>
            {stockTypeChip(params.row.stockType, false, true).icon}
          <Header/>
        </>)
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
        <ServerPaginationGrid
          page={pageState.page}
          loading={pageState.isLoading}
          pageSize={pageState.pageSize}
          rows={pageState.rows}
          handleRowClick={handleRowClick}
          rowCount={pageState.rowCount}
          columns={columns}
          onPageSizeChange={setPageSize}
          onPageAlter={(newPage) => setPageState({...pageState, page: newPage})}
        />
      </Box>
    </>;
  }

  function canNew() {
    if (!props.new) return;
    return (<Box sx={{marginLeft: "auto"}} display="flex" justifyContent="end" mt="20px">
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

