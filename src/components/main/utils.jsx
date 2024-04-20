import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import {brown, green, yellow} from "@mui/material/colors";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import React from "react";

export const stockTypeChip = (params, fromTable = true, noLabel = false) => {
  let type = params;
  let label = params;
  const style = {
    width: 'auto',
    height: '30px',
    paddingLeft: '15px',
    marginRight: '10px',
    backgroundColor: 'transparent'
  };
  if (fromTable) {
    type = params.row.stockType;
    label = params.row.name;
  }
  if (noLabel) {
    label = undefined;
  }
  let icon;
  switch (type) {
    default:
    case "FLOWER":
      icon = <FilterVintageIcon style={{fill: green[500]}}/>;
      break;
    case "OIL":
      icon = <WaterDropIcon style={{fill: yellow[300]}}/>;
      break;
    case "EDIBLE":
      icon = <RestaurantIcon style={{fill: brown[400]}}/>;
      break;
  }
  return {icon, label, style}
}

export const datagridCssTable = (colors) => ({
  "& .MuiDataGrid-root": {
    border: "none",
  }, "& .MuiDataGrid-cell": {
    borderBottom: "none",
  }, "& .name-column--cell": {
    color: colors.greenAccent[300],
  }, "& .MuiDataGrid-columnHeaders": {
    backgroundColor: colors.blueAccent[700], borderBottom: "none",
  }, "& .MuiDataGrid-virtualScroller": {
    backgroundColor: colors.primary[400],
  }, "& .MuiDataGrid-footerContainer": {
    borderTop: "none", backgroundColor: colors.blueAccent[700],
  }, "& .MuiCheckbox-root": {
    color: `${colors.greenAccent[200]} !important`,
  }, "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: `${colors.grey[100]} !important`,
  },
});

export const toCurrency = (donation) => {
  const total = new Intl.NumberFormat('en-DE').format(donation);
  return `$ ${total}`;
}
