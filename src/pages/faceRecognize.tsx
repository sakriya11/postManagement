import axios from "axios";
import { useState } from "react";
import { API_URL } from "../config";
import { showSuccessToast, handleAxiosError } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

interface faceRegisterState {
  fullname: string;
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
  file: File | null;
}
function FaceRecognize() {
  const navigate = useNavigate();

  const [faceRecognize, setFaceRecognize] = useState<faceRegisterState>({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "",
    file: null,
  });

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setFaceRecognize((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFaceRecognize((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", faceRecognize.fullname);
    formData.append("email", faceRecognize.email);
    formData.append("password", faceRecognize.password);
    formData.append("confirmpassword", faceRecognize.confirmpassword);
    formData.append("role", faceRecognize.role);
    if (faceRecognize.file) {
      formData.append("image", faceRecognize.file); 
    }

    try {
      const response = await axios.post(
        `${API_URL}/face/registration`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        showSuccessToast(response.data.message);
        navigate("/");
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
            value={faceRecognize.fullname}
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
            value={faceRecognize.email}
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
            value={faceRecognize.role}
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
            value={faceRecognize.password}
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
            value={faceRecognize.confirmpassword}
            onChange={handelChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-">
            Face Recognition
          </label>
          <input
            type="file"
            id="imageUpload"
            name="image"
            accept="image/*"
            onChange={handelChange}
            className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
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
      </form>
    </div>
  );
}

export default FaceRecognize;
