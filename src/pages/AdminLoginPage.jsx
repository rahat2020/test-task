

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdSDK from "../utils/MkdSDK";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import SnackBar from "../components/SnackBar";
import { GlobalContext, showToast } from "../globalContext";

const AdminLoginPage = () => {
  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required(),
      role: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // LOGIN FUNCATIONALITIES 
  const { dispatch, role } = React.useContext(AuthContext);
  const { dispatch: setDispatch } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false)
  const onSubmit = async (data) => {
    let sdk = new MkdSDK();
    const res = await sdk.login(data.email, data.password, data.role);
    console.log('res', res)
    if (res.token !== '') {
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.role });
      setDispatch({ type: 'SNACKBAR', payload: { message: 'logged in successfull' } });
      setLoggedIn(true);
      console.log(res)
      navigate('/admin/dashboard')
    }
  };


  return (
    <div className="w-full max-w-xs mx-auto">
      <SnackBar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 "
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email?.message ? "border-red-500" : ""
              }`}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="******************"
            {...register("password")}
            className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password?.message ? "border-red-500" : ""
              }`}
          />
          <p className="text-red-500 text-xs italic">
            {errors.password?.message}
          </p>
        </div>
        <div className="mb-6">
          <label htmlFor="cars" className="block text-gray-700 text-sm font-bold">Role</label>
          <select name="cars" id="cars" {...register("role")} className="border-2 text-gray-600 bg-white shadow-sm rounded w-full h-10">
            <option value="admin">choose user role</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          <p className="text-red-500 text-xs italic">
            {errors.role?.message}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Sign In"
          />
        </div>
      </form>
      {
        loggedIn === true ? <SnackBar /> : ''
      }
    </div>
  );
};

export default AdminLoginPage;
