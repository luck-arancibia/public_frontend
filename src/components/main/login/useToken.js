import {useState} from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.accessToken
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.accessToken);
  };

  const deleteToken = () => {
    localStorage.removeItem('token');
  }

  return {
    deleteToken,
    getToken,
    setToken: saveToken,
    token
  }
}












