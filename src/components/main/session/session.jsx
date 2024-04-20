import App from "../../../App";
import React, {useEffect, useState} from "react";
import Keycloak from "keycloak-js";

const Session = () => {
  const [keycloak, setKeycloak] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  let initOptions = {
    url: 'http://localhost:9090',
    realm: 'test',
    clientId: 'test',
    onLoad: 'login-required', // check-sso | login-required
    KeycloakResponseType: 'code',
  }

  function initKeycloak() {
    const keycloak = new Keycloak(initOptions);
    keycloak
      .init({
        onLoad: 'login-required',
      })
      .then(function (authenticated) {
        setKeycloak(keycloak);
        setAuthenticated(authenticated);
        keycloak.redirectUri = window.location.origin + "/"
      })
      .catch(function (e) {
        console.log('Failed to initialize keycloak', e);
      });
  }

  // useEffect(() => {
  //   initKeycloak();
  // }, []);
  if (!authenticated) {
    return initKeycloak();
  } else {
    return <App keycloak={keycloak}/>;

  }
};

export default Session;

// async function fetchUsers() {
//   const response = await fetch('/api/users', {
//     headers: {
//       accept: 'application/json',
//       authorization: `Bearer ${keycloak.token}`
//     }
//   });
//
//   return response.json();
// }
//
// try {
//   await keycloak.updateToken(30);
// } catch (error) {
//   console.error('Failed to refresh token:', error);
// }
//
// const users = await fetchUsers();

// this.props.keycloak.loadUserInfo().then(userInfo => {
//   this.setState({name: userInfo.name, email: userInfo.email, id: userInfo.sub})
// });
