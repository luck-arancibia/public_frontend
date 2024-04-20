import React, {useState} from 'react';
import './Login.css';
import {ColorModeContext, tokens, useMode} from "../../../theme";
import {Box, Button, CssBaseline, TextField, ThemeProvider} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Header from "../../indevelop/primitives/Header";
import * as yup from "yup";
import {Formik} from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";


async function loginUser(credentials) {
  return fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

//export default function Login({ setToken, success }) {
const Login = ({...props}) => {
  const [theme, colorMode] = useMode();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    console.log(values);
    console.log(props);
  };

  //async function handleSubmit(values) {
  const handleSubmit = (values) => {
    console.log(values);
    //e.preventDefault();
    //const token = await loginUser({
    loginUser({
      email: values.email,
      password: values.password,
    }).then(response => {
      props.success(response)
    }).catch(e => {
      props.logout();
    });

  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app login-wrapper">
          <Box m="100px" sx={{
            width: 1 / 4,
          }}>
            <Header title="Login" subtitle="Admin login"/>
            <Box
              gridColumn="span 8"
              gridRow="span 2"
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Formik
                  onSubmit={(values) => {
                    handleSubmit(values)
                  }}
                  initialValues={initialValues}
                  validationSchema={checkoutSchema}
                >
                  {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                    }) => (
                    <form onSubmit={handleSubmit}>
                      <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                          "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                      >

                        <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label="Email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={!!touched.email && !!errors.email}
                          sx={{gridColumn: "span 4"}}
                        />
                        <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label="Password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          name="password"
                          error={!!touched.password && !!errors.password}
                          sx={{gridColumn: "span 4"}}
                        />
                      </Box>
                      <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained">
                          Login
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </Box>
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
/*
        <!--
          <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
              <label>
                <p>Username</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
              </label>
              <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
              </label>
              <div>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        -->
 */
const checkoutSchema = yup.object().shape({
  //email: yup.string().email("invalid email").required("required"),
  email: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  email: "",
  password: ""
};

export default Login;
