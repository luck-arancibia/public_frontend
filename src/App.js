import {createContext, useContext, useEffect, useState} from "react";
import React from "react";
import {Route, Routes} from "react-router-dom";
import Topbar from "./components/indevelop/pre/global/Topbar";
import Sidebar from "./components/indevelop/pre/global/Sidebar";
import Dashboard from "./components/indevelop/pre/dashboard";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";

import HomeMembers from "./components/main/members/homeMembers";
import HomeSolicitudes from "./components/main/solicitudes/homeSolicitudes";
import HomeStocks from "./components/main/stocks/homeStocks";

import Keycloak from 'keycloak-js';
import {KeycloakProvider, useKeycloak} from "keycloak-react-web"

function App({...props}) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);


  function logout() {
    // this.props.history.push('/')
    props.keycloak.logout();
  }

  return (
    <React.StrictMode>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <div className="app">
            <Sidebar keycloak={props.keycloak} isSidebar={isSidebar}/>
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} logout={logout}/>
              {/*<KeycloakProvider client={authInstance}>*/}
              <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/members" element={<HomeMembers/>}/>
                <Route path="/stocks" element={<HomeStocks/>}/>
                <Route path="/solicitudes" element={<HomeSolicitudes canNew={true} showMemberInformation={true}/>}/>
              </Routes>
              {/*</KeycloakProvider>*/}
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </React.StrictMode>
  );
}

export default App;

