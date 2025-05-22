import axios from "axios";
import { useState } from "react";
import { API_URL } from "../config";
import { handleAxiosError, showSuccessToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

function EmailConfirmation() {
  const navigate = useNavigate();

  const [emailCode, setEmailCode] = useState({
    verificationCode: "",
  });

  const handelChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmailCode((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/user/email/verification`,
        emailCode
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
        <h2 className="text-2xl font-bold mb-6 text-center">Confirm Email</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter the code
          </label>
          <input
            name="verificationCode"
            type="string"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={emailCode.verificationCode}
            onChange={handelChange}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailConfirmation;
