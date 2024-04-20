import {useEffect, useState} from "react";
import {Menu, MenuItem, ProSidebar} from "react-pro-sidebar";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {Link} from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {tokens} from "../../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MedicationIcon from '@mui/icons-material/Medication';
import githubLogo from '../../../../assets/github-logo.png';

const Item = ({title, to, icon, selected, setSelected}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to}/>
    </MenuItem>
  );
};

const Sidebar = ({...props}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState({});

  useEffect(() => {
      let tokenUser = {};
      if (Object.keys(props.keycloak).length !== 0) {
        tokenUser = props.keycloak.tokenParsed;
      }
      if (Object.keys(tokenUser).length !==0) {
        setUser(tokenUser);
      }
  }, []);
  if (Object.keys(props.keycloak).length === 0) {
    return;
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon/> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {/*ADMIN*/}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon/>
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={githubLogo || ''}
                  style={{cursor: "pointer", borderRadius: "50%"}}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{m: "10px 0 0 0"}}
                >
                  {user.given_name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{m: "15px 0 5px 20px"}}
            >
              Gestión del club
            </Typography>
            <Item
              title="Socios"
              to="/members"
              icon={<PeopleOutlinedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Stock"
              to="/stocks"
              icon={<LocalFloristIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Solicitudes"
              to="/solicitudes"
              icon={<MedicationIcon/>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Información general"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
