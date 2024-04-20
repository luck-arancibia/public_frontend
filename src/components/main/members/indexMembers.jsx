import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import Header from "../../indevelop/primitives/Header";
import React, {useEffect, useState} from "react";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {datagridCssTable} from "../utils";

const IndexMembers = ({...props}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rowCountState, setRowCountState] = useState(25);
  const [data, setData] = useState({});
  const [paginationModel, setPaginationModel] = useState({pageSize: 25, page: 0});

  useEffect(() => {
    getMembers()
      .then(response => {
        setData(response);
        setRowCountState(25);
      }).catch(e => {
      console.log('members get error ', e);
    })
  }, []);

  async function getMembers() {
    return fetch('http://localhost:8080/admin/members', {
      method: 'GET'
    }).then(data => data.json())
  }

  const handleRowClick = (params) => props.setSelectedMember(params.row);

  const columns = [
    {field: "id", headerName: "ID", flex: 0.5}, {field: "rut", headerName: "Rut", flex: 1.0},
    {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
    {field: "email", headerName: "Email", flex: 1},
    {field: "phone", headerName: "Phone Number", flex: 1},
    {field: "address", headerName: "Address", flex: 1},
  ];

  function memberTable() {
    return <>
      <Header
        title="Miembros"
        subtitle="Lista de miembros Dispensario LATAM"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={datagridCssTable(colors)}
      >
        <DataGrid
          autoHeight
          onRowClick={handleRowClick}
          rows={getTableData()}
          columns={columns}
          components={{Toolbar: GridToolbar}}
          // rowCount={rowCountState}
          // paginationModel={paginationModel}
          // onPaginationModelChange={setPaginationModel}
          // paginationMode="server"
        />
      </Box>
    </>
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
    if (!props.canNew) return;
    return (<Box sx={{marginLeft: "auto"}} display="flex" justifyContent="end" mt="20px">
      <IconButton color="secondary" variant="contained" onClick={(e) => {
        props.new();
      }}>
        <Typography
          variant="h4"
          sx={{marginRight: "10px"}}>
          Crear
        </Typography>
        <PersonAddAlt1Icon fontSize={"large"}/>
      </IconButton>
    </Box>);
  }

  return <Box m="10px">
    {canNew()}
    {memberTable()}
  </Box>;

};

export default IndexMembers;
