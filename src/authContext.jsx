import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: localStorage.getItem('user') || '',
  role: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      //TODO
      return {
        ...state,
        isAuthenticated: true,
        role: action.payload
      };
      case "TOKEN_EXPIRED":{
        return{
          ...state,
          isAuthenticated: false,
          role:null,
          token:null
        }
      }
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        token:null,
      };
      
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    //TODO
    localStorage.setItem('user', state.user);
  }, [state.user]);
  React.useEffect(() => {
    //TODO
    localStorage.setItem('role', state.role);
  }, [state.role]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
