import {
  Avatar,
  Box,
  CardContent,
  Chip,
  IconButton, InputAdornment,
  List, ListItem,
  ListItemAvatar, ListItemText,
  Modal,
  TextField,
  useTheme
} from "@mui/material";
import {AddOutlined, ArrowBackOutlined} from "@mui/icons-material";
import Header from "../../indevelop/primitives/Header";
import React, {useEffect, useState} from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import {DataGrid} from "@mui/x-data-grid";
import {tokens} from "../../../theme";
import Typography from "@mui/material/Typography";
import {datagridCssTable, stockTypeChip, toCurrency} from "../utils";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import DeleteIcon from '@mui/icons-material/Delete';
import IndexMembers from "../members/indexMembers";
import clsx from "clsx";
import ServerPaginationGrid from "../tableComponent";

export default function NewNewMedicine({...props}) {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [member, setMember] = useState({
    leftPrescriptions: undefined
  });
  const [stocks, setStocks] = useState([]);
  const [validStock, setValidStock] = useState([]);
  const [selectedStock, setSelectedStock] = useState({});
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [newMedicineModal, setNewMedicineModal] = useState(false);
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
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => {
        // console.log('old', old);
        return {...old, isLoading: true};
      });
      const json = await getStocks();
      console.log('json', json);
      setPageState((old) => ({
        ...old,
        isLoading: false,
        rows: json.body,
        rowCount: json.totalElements,
        pageSize: json.pageable.pageSize,
        page: json.pageable.pageNumber,
        // rowCount: 100
      }));
      const selectedMember = await getMember();
      setMember(selectedMember);
    };
    fetchData();
  }, [pageState.pageSize, pageState.page]);

  async function getMember() {
    return fetch(`http://localhost:8080/admin/member/${props.selectedMemberId}`, {
      method: 'GET'
    })
      .then(data => data.json())
      .catch(e => {
        console.log('member get error ', e);
      })
  }

  async function getStocks() {
    return fetch(`http://localhost:8080/admin/stocks?page=${
      pageState.page}&pageSize=${pageState.pageSize}`, {method: 'GET'})
      .then(data => data.json())
      .then(data => {
        data.body = data.body.map(stock => ({...stock, medicine_quantity: 0}));
        console.log('data', data);
        return data;
      })
      .catch(e => {
        console.log('stocks get error ', e);
      })
  }

  const columns = [
    {field: "name", headerName: "Name", flex: 0.5, cellClassName: "name-column--cell"},
    {
      field: "quantity",
      headerName: "Cantidad",
      type: "number",
      editable: true,
      cellClassName: (params) =>
        clsx('super-app', {
          status_red: params.value - params.row.medicine_quantity < 0
        }),
      renderCell: (params) => {
        const quantity = params.value - params.row.medicine_quantity;
        return (<div>
          {quantity}
        </div>);
      },
    },
    {
      field: "donation", headerName: "Donación", type: "number", flex: 0.5, cellClassName: "name-column--cell",
      renderCell: (params) => (
        <div className="flex">
          {toCurrency(params.value)}
        </div>
      )
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

  const handleRowClick = (params) => {
    setSelectedStock(params.row);
    setNewMedicineModal(true);
  };

  const handleNewMedicineMemberQuantity = (e) => {
    const quantity = parseInt(e.target.value);
    const medicine = selectedStock;
    medicine.medicine_quantity = quantity;
    setSelectedStock(medicine);
  }

  const handleContinue = () => {
    const selected = selectedStocks;
    const foundStock = selectedStocks.find(stock => stock.id === selectedStock.id);
    if (!foundStock) {
      selected.push(JSON.parse(JSON.stringify(selectedStock)));
      setSelectedStocks(selected);
    } else {
      const sum = foundStock.medicine_quantity + selectedStock.medicine_quantity;
      foundStock.medicine_quantity = sum;
      selectedStock.medicine_quantity = sum;
      setSelectedStock(selectedStock);
      setSelectedStocks(selected);
    }
    console.log('selected', selected);
    setNewMedicineModal(false);
    checkIfError();
  }
  const handleBack = () => {
    deleteSelectedStock(selectedStock)
    setSelectedStock({});
    setNewMedicineModal(false);
  }

  function newMedicineModalComponent() {
    if (Object.keys(member).length === 0) return;
    if (Object.keys(selectedStock).length === 0) return;
    const leftPrescriptionAByType = member.leftPrescriptions.find(left => left.stockType === selectedStock.stockType);
    return (
      <Modal
        open={newMedicineModal}
        onClose={handleBack}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <TextField
            InputProps={{
              min: 0, max: leftPrescriptionAByType.leftPerMonth || 99,
              startAdornment: (
                <InputAdornment position="start">
                  {stockTypeChip(selectedStock.stockType, false, true).icon}
                </InputAdornment>
              ),
            }}
            fullWidth
            variant="filled"
            type="number"
            label={`Cantidad de ${selectedStock.name}`}
            onChange={handleNewMedicineMemberQuantity}
            name="medicine_quantity"
            sx={{gridColumn: "span 2"}}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
                <IconButton color="secondary" variant="contained" onClick={handleBack}>
                  <Typography
                    variant="h4"
                    sx={{marginRight: "10px"}}>
                    Cancelar
                  </Typography>
                  <ArrowBackOutlined/>
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start" mt="20px">
                <IconButton color="secondary" variant="contained" onClick={handleContinue}>
                  <Typography
                    variant="h4"
                    sx={{marginRight: "10px"}}>
                    Continuar
                  </Typography>
                  <AddOutlined/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  }

  function checkIfError(params) {
    // improve error with json
    if (params !== undefined && params.length < 1) {
      setValidStock([]);
      return;
    }
    if (selectedStocks.length === 0) {
      setValidStock([]);
      return;
    }
    const errors = [];
    selectedStocks.forEach(selectedStock => {
      if (selectedStock.quantity - selectedStock.medicine_quantity < 0) {
        errors.push({message: 'Stock insuficiente para: ' + selectedStock.name})
      }
      const prescription = member.leftPrescriptions.find(stock => stock.stockType === selectedStock.stockType);
      if (prescription.leftPerMonth < selectedStock.medicine_quantity) {
        errors.push({message: 'Membrecia insuficiente del tipo: ' + prescription.name})
      }
    })
    setValidStock(errors);
  }

  function displayError() {
    if (validStock.length === 0) return;
    return (
      <>
        <Header
          subtitle="Error en la dispensación"
        />
        {validStock.map((valid, index) => {
          return (
            <div key={index}>
              <Typography variant="h5" color={colors.greenAccent[500]}>
                {valid.message}
              </Typography>
            </div>)
        })}

      </>
    )
  }

  function stockTableAndPrescriptions() {
    if (Object.keys(member).length === 0) return;
    if (member.leftPrescriptions === undefined) return;
    return (<Box m="10px">
      <Header
        title="Lista de stock disponible para dispensar"
        subtitle="Selecciona la medicina del socio"
      />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {member.leftPrescriptions.map((prescription, index) => {
            const defaultValue = `Total mensual: ${prescription.maxPerMonth} | Restante: ${prescription.leftPerMonth}`;
            return (
              <div key={index}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                  sx={{
                    "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
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
                    type="text"
                    label={`Total ${prescription.name}`}
                    defaultValue={defaultValue}
                    name={`prescriptions[${index}].maxPerMonth`}
                    inputProps={{readOnly: true}}
                  />
                </Box>
              </div>)
          })}
        </Grid>
        <Grid item xs={4}>
          {validStock.length > 0 ? displayError() : <></>}
        </Grid>
      </Grid>
      <Box m="40px 0 0 0" height="75vh" sx={datagridCssTable(colors)}>
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
    </Box>);
  }

  function backContinueButtons() {
    return <Grid container spacing={2}>
      <Grid item xs={8}>
        <Grid item xs={6}>
          <Box sx={{marginLeft: "auto"}} display="flex" justifyContent="start">
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
          </Box>
        </Grid>
        <Grid item xs={6}>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        {validStock.length < 1 && selectedStocks.length > 0 ?
          <Box sx={{marginRight: "auto"}} display="flex" justifyContent="start">
            <IconButton color="secondary" variant="contained" onClick={(e) => {
              props.continue(selectedStocks);
            }}>
              <Typography
                variant="h4"
                sx={{marginRight: "10px"}}>
                Continuar
              </Typography>
              <AddOutlined/>
            </IconButton>
          </Box>
          : <></>
        }
      </Grid>
    </Grid>;
  }

  function getDisplay() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {stockTableAndPrescriptions()}
        </Grid>
        <Grid item xs={3}>
          <Box m="10px">
            {getSelectedStocks()}
          </Box>
        </Grid>
      </Grid>
    );
  }

  function deleteSelectedStock(medicine) {
    const toEditStocks = pageState.rows;
    const editedStock = toEditStocks.find(stock => stock.id === medicine.id);
    editedStock.medicine_quantity = 0;
    setStocks(toEditStocks)
    const filteredSelectedStock = selectedStocks.filter(entry => (entry.id !== medicine.id));
    setSelectedStocks(filteredSelectedStock);
    checkIfError(filteredSelectedStock);
  }

  function getSelectedStocks() {
    const selected = selectedStocks;
    if (selected && selected.length > 0) {
      return <>
        <Header
          title="Lista de stock seleccionado"
        />
        <Box
          height="75vh"
          sx={datagridCssTable(colors)}
        >
          <List sx={{width: '100%'}}
                dense={false}
          >
            {selected.map((medicine, index) => (
              <div key={Math.random()}>
                <ListItem
                  sx={{width: '100%'}}
                  secondaryAction={
                    <IconButton edge="end" onClick={(e) => {
                      deleteSelectedStock(medicine);
                    }} color="secondary" variant="contained">
                      <DeleteIcon fontSize={"medium"}/>
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    {stockTypeChip(medicine.stockType, false, true).icon}
                  </ListItemAvatar>
                  <Typography
                    paragraph
                    variant="h4"
                    fontWeight="300"
                  >
                    {`Nombre ${medicine.name}`}
                  </Typography>
                  <ListItemText
                    primary={`Cantidad ${medicine.medicine_quantity}`}
                    secondary={`Donación ${toCurrency(medicine.medicine_quantity * medicine.donation)}`}
                  />
                </ListItem>
                <Divider/>
                <br/>
              </div>
            ))}
          </List>
        </Box>
      </>;
    } else {
      return <Header
        subtitle="Pincha una medicina y elige la cantidad de stock"
      />;
    }
  }

  return (
    <>
      {backContinueButtons()}
      {getDisplay()}
      {newMedicineModalComponent()}
    </>
  );
}
