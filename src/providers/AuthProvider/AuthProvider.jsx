import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./../../firebase/firebase.config";
import axios from "axios";

export const UserContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("New User");
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const loggedUser = currentUser?.email;
      console.log(loggedUser);
      //  AXIOS REQUEST FOR GENERATE TOKEN IF CURRENT USER EXIST
      if (currentUser) {
        const loadToken = async () => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_URL}/jwt`,
              { loggedUser },
              { withCredentials: true }
            );
            console.log(res?.data);
          } catch (err) {
            console.error(err);
          }
        };
        loadToken();
      }
    });
    return () => unSubscribe();
  }, []);

  const userInfo = { user, createUser, loginUser, logOut };
  return (
    <div>
      <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
    </div>
  );
};

export default AuthProvider;
