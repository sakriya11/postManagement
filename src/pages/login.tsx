import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { handleAxiosError, showSuccessToast } from "../utils/toastUtils";

function Login() {
  const navigate = useNavigate();

  interface login {
    email: string;
    password: string;
  }

  interface faceLogin {
    file: File | null;
  }

  const [login, setLogin] = useState<login>({
    email: "",
    password: "",
  });

  const [faceLogin, setFaceLogin] = useState<faceLogin>({
    file: null,
  });

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setFaceLogin((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setLogin((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevents reload after submission
    try {
      const response = await axios.post(`${API_URL}/login`, login);
      if (response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("username", response.data.user.fullname);

        showSuccessToast(response.data.message);
        navigate("/home");
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handelFaceLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (faceLogin.file) {
      formData.append("image", faceLogin.file);
    } else {
      handleAxiosError(
        new Error("Please select an image file for face login.")
      );
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/face/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("responseeeeee",response)
      if (response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("username", response.data.user.fullname);
        showSuccessToast(response.data.message);
        navigate('/home');
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    
    <div className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-sm">
      <form onSubmit={handelSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={login.email}
            onChange={handelChange}
            placeholder="Email"
            name="email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={login.password}
            onChange={handelChange}
            placeholder="Password"
            name="password"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          >
            Log In
          </button>
        </div>

        <div className="mt-4 text-left">
          Don't have an account?{" "}
          <Link to={"/register"}>
            <b>Register</b>
          </Link>
        </div>

        <div className="flex items-center gap-4 my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
      </form>

      {/* -------- Face Login Form -------- */}
      <form onSubmit={handelFaceLoginSubmit}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Login using Face Recognition
        </label>
        <input
          type="file"
          id="imageUpload"
          name="image"
          accept="image/*"
          className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-3 w-full"
          onChange={handelChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          Login with Face
        </button>
      </form>
    </div>
  </div>
);

}

export default Login;
