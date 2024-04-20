import {Box} from "@mui/material";
import Header from "../../primitives/Header";
import PieChart from "../../primitives/PieChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart"/>
      <Box height="75vh">
        <PieChart/>
      </Box>
    </Box>
  );
};

export default Pie;
