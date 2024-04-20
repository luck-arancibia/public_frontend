import {useState} from "react";
import IndexStocks from "./indexStocks";
import NewStocks from "./newStocks";
import ShowStocks from "./showStocks";
import {SnackBarComponent} from "../SnackBarComponent";
import IndexSolicitudes from "../solicitudes/indexSolicitudes";
import NewSolicitude from "../solicitudes/newSolicitude";
import {ShowSolicitude} from "../solicitudes/showSolicitude";
import NewIndexStocks from "./newIndexStocks";

const HomeStocks = () => {
  const [mode, setMode] = useState('home');
  const [selectedStock, setSelectedStock] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  function setNewMode() {
    setMode('new')
  }

  function setHomeMode() {
    setMode('home');
  }

  function setSelectedStockAndContinue(stock) {
    setSelectedStock(stock);
    setMode('show');
  }

  function setHomeModeFromSuccess() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('success');
    setSnackBarMessage('Éxito creando el stock');
  }

  function setHomeModeFromError() {
    setMode('home');
    setOpenSnackbar(true);
    setSnackBarStatus('error');
    setSnackBarMessage('Error creando el stock')
  }

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  };

  function getDisplay() {
    switch (mode) {
      default:
      case 'home':
        // return <IndexStocks canNew={true} new={setNewMode} setSelectedStock={setSelectedStockAndContinue}/>
        return <NewIndexStocks canNew={true} new={setNewMode} setSelectedStock={setSelectedStockAndContinue}/>
      case 'show':
        return <ShowStocks back={setHomeMode} selectedStockId={selectedStock.id}/>
      case 'new':
        return <NewStocks back={setHomeMode} continue={setHomeModeFromSuccess}
                          error={setHomeModeFromError}/>
    }
  }

  return (<>
    <SnackBarComponent
      openSnackbar={openSnackbar}
      onClose={handleCloseSnackBar}
      snackBarStatus={snackBarStatus}
      snackBarMessage={snackBarMessage}
    />
    {getDisplay()}
  </>)
};

export default HomeStocks;
