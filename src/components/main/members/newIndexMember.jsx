import React, {useState, useEffect} from "react";
import ServerPaginationGrid from "../tableComponent";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Header from "../../indevelop/primitives/Header";
import {datagridCssTable, stockTypeChip} from "../utils";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
export default function NewIndexMember({...props}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageState, setPageState] = useState({
    page: 0,
    pageSize: 2,
    rows: [],
    rowCount: 0,
    isLoading: false
  });

  const setPage = (page) => {
    setPageState({...pageState, page: page});
  };

  const setPageSize = (pageSize) => {
    setPageState({...pageState, pageSize: pageSize, page: 0});
  };

  const columns = [
    {field: "id", headerName: "ID", flex: 0.5},
    {field: "rut", headerName: "Rut", flex: 1.0},
    {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell"},
    {field: "email", headerName: "Email", flex: 1},
    {field: "phone", headerName: "Phone Number", flex: 1},
    {field: "address", headerName: "Address", flex: 1, renderCell: (params) => {
        return (<>
          <div>{params.formattedValue}</div>
          <Header/>
        </>)
      }
    },
  ];

  async function getMembers() {
    return fetch(`http://localhost:8080/admin/members?page=${
        pageState.page
      }&pageSize=${pageState.pageSize}`,
      {
        method: 'GET'
      }).then(data => data.json())
  }

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => {
        return {...old, isLoading: true};
      });
      const json = await getMembers();
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

  const handleRowClick = (params) => props.setSelectedMember(params.row);

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
    </>
  }
  return <Box m="10px">
    {canNew()}
    {memberTable()}
  </Box>;
}
