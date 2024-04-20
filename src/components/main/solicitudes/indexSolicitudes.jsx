import {Box, IconButton, Typography, useTheme} from "@mui/material";
import Header from "../../indevelop/primitives/Header";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import {tokens} from "../../../theme";
import {datagridCssTable, toCurrency} from "../utils";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Divider from "@mui/material/Divider";

const IndexSolicitudes = ({...props}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState();
  const [showMember, setShowMember] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSolicitudes()
  }, []);

  async function getSolicitudes() {
    let url;
    if (props.member) {
      url = `admin/solicitudes/${props.member.id}`;
      setShowMember(false);
    } else {
      url = 'admin/solicitudes';
    }
    return fetch(`http://localhost:8080/${url}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .then(response => {
        setData(response);
        setLoading(false);
      }).catch(e => {
        console.log('solicitudes get error ', e);
      });
  }

  const columns = [
    {field: "id", headerName: "ID", flex: 0.2},
    {field: "paid", headerName: "Donación", type: "boolean", headerAlign: "left", align: "left"},
    {field: "delivered", headerName: "Entregado", type: "boolean", headerAlign: "left", align: "left"},
    {
      field: "medicines", headerName: "Medicinas", flex: 1, cellClassName: "name-column--cell",
      renderCell: (params) => (
        <ul className="flex">
          {params.value.map((medicine, index) => (
            <li
              key={index}>{medicine.name + " | cantidad  " + medicine.quantity + " | donación " + toCurrency(medicine.donation)}</li>
          ))}
        </ul>
      ),
    },
    {
      field: "totalDonation", headerName: "Donación total", flex: 1, cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div className="flex">
          {toCurrency(params.value)}
        </div>
      ),
    },
  ];
  if (showMember) {
    columns.push({
      field: "member", headerName: "Socio", flex: 1, cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div className="flex">
          {params.value.name} | Rut: {params.value.rut}
        </div>
      ),
    });
  }

  const handleRowClick = (params) => props.setSelectedSolicitude(params.row);

  function solicitudesTable() {
    return <>
      <Header
        title="Solicitudes"
        subtitle="Lista de solicitudes de dispensación Dispensario LATAM"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={datagridCssTable(colors)}
      >
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          onRowClick={handleRowClick}
          rows={getTableData()}
          columns={columns}
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
    if (!props.canNew) return;
    return <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="end" mt="20px">
      <IconButton color="secondary" variant="contained" onClick={(e) => {
        props.new();
      }}>
        <Typography
          variant="h4"
          sx={{marginRight: "10px"}}>
          Crear
        </Typography>
        <MedicalServicesIcon sx={{marginLeft: "auto"}} fontSize={"large"}/>
      </IconButton>
    </Box>;
  }

  if (loading) return <div>loading</div>;
  return (<Box m="10px">
    {canNew()}
    {solicitudesTable()}
  </Box>);
}

export default IndexSolicitudes;
