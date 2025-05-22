import { toast } from "react-toastify";
import axios from "axios";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data.message) {
      showErrorToast(error.response.data.message);
      console.error("Axios Error:", error);
    }
  } else {
    console.error("Unexpected error occurred:", error);
  }
};
