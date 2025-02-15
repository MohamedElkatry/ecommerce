import { createContext, useState, useEffect } from 'react';

export let UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    

    if (token) setUserToken(token);
    if (name) setUserName(name);
    setIsLoading(false);
  }, []);

  // Keep localStorage in sync when userToken changes
  useEffect(() => {
    if (userToken) {
      localStorage.setItem('userToken', userToken);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [userToken]);

  return (
    <UserContext.Provider value={{ userToken, setUserToken, userName, setUserName, isLoading }}>
      {!isLoading && children} {/* Prevents rendering before auth is checked */}
    </UserContext.Provider>
  );
}