import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import {
  showSuccessToast,
  showErrorToast,
  handleAxiosError,
} from "../utils/toastUtils";

function Register() {
  const navigate = useNavigate();

  interface registerState {
    fullname: string;
    email: string;
    password: string;
    confirmpassword: string;
    role: string;
  }
  const [register, setRegister] = useState<registerState>({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "",
  });

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (register.password !== register.confirmpassword) {
      showErrorToast("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/create/user`, register);
      if (response.data) {
        showSuccessToast(response.data.message);
        navigate("/email-confirm");
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handelSubmit}
        className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            type="input"
            name="fullname"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={register.fullname}
            onChange={handelChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={register.email}
            onChange={handelChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Role
          </label>
          <select
            id="category"
            name="role"
            value={register.role}
            onChange={handelChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose an option --</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="child">Child</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={register.password}
            onChange={handelChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmpassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={register.confirmpassword}
            onChange={handelChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          >
            Register
          </button>
        </div>

        <div className="flex items-center gap-4 my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="mt-4 text-left ">
          Register using {""}
          <Link to={"/face-register"}>
            <b>Face recognize</b>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
