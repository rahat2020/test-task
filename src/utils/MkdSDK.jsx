

import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../authContext';

export default function MkdSDK() {
  this._baseurl = "https://reacttask.mkdlabs.com";
  this._project_id = "reacttask";
  this._secret = "d9hedycyv6p7zw8xi34t9bmtsjsigy5t7";
  this._table = "";
  this._custom = "";
  this._method = "";

  const raw = this._project_id + ":" + this._secret;
  let base64Encode = btoa(raw);

  this.setTable = function (table) {
    this._table = table;
  };

  this.getHeader = function () {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "x-project-id": this._project_id,
    };
  };


  // const { dispatch } = useContext(AuthContext)

  this.login = async function (email, password, role) {
    try {
      const obj = { email, password, role };
      const response = await axios.post(
        `${this._baseurl}/v2/api/lambda/login`, obj, { headers: this.getHeader() }
      );

      // Assuming the API response includes a token
      const token = response.data.token;

      // Save token to localStorage or your state management
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      throw new Error("Login failed. Invalid credentials.");
    }
  };

  this.getHeader = function () {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "x-project": base64Encode,
    };
  };

  this.baseUrl = function () {
    return this._baseurl;
  };

  this.callRestAPI = async function (payload, method) {
    const header = {
      "Content-Type": "application/json",
      ...this.getHeader(),
    };

    switch (method) {
      case "GET":
        const getResult = await fetch(
          `${this._baseurl}/v1/api/rest/${this._table}/GET`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonGet = await getResult.json();

        if (getResult.status === 401) {
          throw new Error(jsonGet.message);
        }

        if (getResult.status === 403) {
          throw new Error(jsonGet.message);
        }
        return jsonGet;

      case "PAGINATE":
        if (!payload.page) {
          payload.page = 1;
        }
        if (!payload.limit) {
          payload.limit = 10;
        }
        const paginateResult = await fetch(
          `${this._baseurl}/v1/api/rest/${this._table}/${method}`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonPaginate = await paginateResult.json();

        if (paginateResult.status === 401) {
          throw new Error(jsonPaginate.message);
        }

        if (paginateResult.status === 403) {
          throw new Error(jsonPaginate.message);
        }
        return jsonPaginate;
      default:
        break;
    }
  };

  this.check = async function (role) {
    
    try {
      const response = await axios.get(`${this._baseurl}/v2/api/lambda/check`, {
        headers: this.getHeader(),
      });
      console.log('role check frm sdk', response)
      const userRole = role; 
      return userRole === "admin";
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  };

  return this;
}

