import {Box, IconButton, Typography, useTheme} from "@mui/material";
import Header from "../../indevelop/primitives/Header";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import {tokens} from "../../../theme";
import {datagridCssTable, toCurrency} from "../utils";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Divider from "@mui/material/Divider";
import ServerPaginationGrid from "../tableComponent";

export default function NewIndexSolicitudes({...props}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState();
  const [showMember, setShowMember] = useState(true);
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
        // console.log('old', old);
        return {...old, isLoading: true};
      });
      const json = await getSolicitudes();
      console.log('json', json)
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

  async function getSolicitudes() {
    let url;
    if (props.member) {
      url = `admin/solicitudes/${props.member.id}`;
      setShowMember(false);
    } else {
      url = 'admin/solicitudes';
    }
    url = `${url}?page=${pageState.page}&pageSize=${pageState.pageSize}`
    return fetch(`http://localhost:8080/${url}`, {
      method: 'GET'
    })
      .then(data => data.json())
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
      renderCell: (params) => {
        return (
          <div className="flex">
            {toCurrency(params.value)}
          </div>
        );
      },
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
  columns.push({
      field: 'createdDate',
      headerName: 'Fecha',
      width: 100,
      valueFormatter: params => {
        console.log('params', params);
        return new Date(params?.value).toLocaleString();
      }
      // valueFormatter: params => moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
  );

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

  return (<Box m="10px">
    {canNew()}
    {solicitudesTable()}
  </Box>);
}

