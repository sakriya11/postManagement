import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../config";
import { handleAxiosError, showSuccessToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

function AddPost() {
  const navigate = useNavigate();

  interface generateState {
    text: string;
  }

  interface FormSectionState {
    title: string;
    date: string;
    description: string;
    file: File | null;
    previewUrl: string;
    role: string;
  }

  interface FormDataState {
    image: FormSectionState;
    pdf: FormSectionState;
  }

  const [showModal, setShowModal] = useState(false);
  const [descriptionType, setDescriptionType] = useState<
    "image" | "pdf" | null
  >(null);
  const [prompt, setPrompt] = useState<generateState>({
    text: "",
  });
  const [formData, setFormData] = useState<FormDataState>({
    image: {
      title: "",
      date: "",
      description: "",
      file: null as File | null,
      previewUrl: "",
      role: "",
    },
    pdf: {
      title: "",
      date: "",
      description: "",
      file: null as File | null,
      previewUrl: "",
      role: "",
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);

  //generate text
  const handelGenerateTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    try {
      const { value } = e.target;
      setPrompt((prev) => ({
        ...prev,
        text: value,
      }));
    } catch (error) {
      console.log("Error generating text:", error);
    }
  };

  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/generate/text`, prompt);
      if (response.data?.generatedText && descriptionType) {
        setFormData((prev) => ({
          ...prev,
          [descriptionType]: {
            ...prev[descriptionType],
            description: response.data.generatedText,
          },
        }));
      }
      setShowModal(false);
      setPrompt({ text: "" });
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  //form data input

  const handleInputChange = (
    type: "image" | "pdf",
    field: string,
    value: unknown,
    isFile = false
  ) => {
    if (isFile) {
      const file = value;
      const previewUrl = file ? URL.createObjectURL(file as Blob) : "";
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          file,
          previewUrl,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userRole = localStorage.getItem("userRole");

      const form = new FormData();

      form.append("title", formData.image.title);
      form.append("date", formData.image.date);
      form.append("description", formData.image.description);
      form.append("role", userRole || ""); // Add the role to the form data
      if (formData.image.file) {
        form.append("image", formData.image.file);
      }

      const response = await axios.post(`${API_URL}/upload/image`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        showSuccessToast(response.data.message);
        navigate("/home");
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleSubmitPdf = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userRole = localStorage.getItem("userRole");

      const form = new FormData();

      form.append("title", formData.pdf.title);
      form.append("date", formData.pdf.date);
      form.append("description", formData.pdf.description);
      form.append("role", userRole || "");
      if (formData.pdf.file) {
        form.append("pdf", formData.pdf.file);
      }

      const response = await axios.post(`${API_URL}/upload/pdf`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        showSuccessToast(response.data.message);
        navigate("/home");
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="mx-auto p-8 bg-gray-100 min-h-screen w-screen max-w-7xl space-y-10">
      {/* IMAGE FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Image Post</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              value={formData.image.title}
              name="title"
              onChange={(e) =>
                handleInputChange("image", "title", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.image.date}
              onChange={(e) =>
                handleInputChange("image", "date", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mt-6 relative">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            rows={6}
            value={formData.image.description}
            name="description"
            placeholder="Type your description here..."
            onChange={(e) =>
              handleInputChange("image", "description", e.target.value)
            }
            className="w-full border p-2 rounded resize-none mt-2"
          ></textarea>
          <button
            className="absolute top-1 right-1 text-sm bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => {
              setDescriptionType("image");
              setShowModal(true);
            }}
          >
            Generate Text
          </button>
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-1">Add Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            className="text-sm  text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
            onChange={(e) =>
              handleInputChange(
                "image",
                "file",
                e.target.files?.[0] || null,
                true
              )
            }
          />
          {formData.image.previewUrl && (
            <div className="mt-4">
              <img
                src={formData.image.previewUrl}
                alt="Preview"
                className="max-h-64 rounded shadow"
              />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-left justify-between mt-5">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>

      {/* PDF FORM */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Upload PDF Post</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              value={formData.pdf.title}
              name="title"
              onChange={(e) =>
                handleInputChange("pdf", "title", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              value={formData.pdf.date}
              name="date"
              onChange={(e) => handleInputChange("pdf", "date", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mt-6 relative">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            rows={6}
            name="description"
            value={formData.pdf.description}
            onChange={(e) =>
              handleInputChange("pdf", "description", e.target.value)
            }
            className="w-full border p-2 rounded resize-none mt-2"
          ></textarea>
          <button
            className="absolute top-1 right-1 text-sm bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => {
              setDescriptionType("pdf");
              setShowModal(true);
            }}
          >
            Generate Text
          </button>
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-1">Add PDF</label>
          <input
            type="file"
            accept="application/pdf"
            name="pdf"
            className="text-sm  text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
            onChange={(e) =>
              handleInputChange(
                "pdf",
                "file",
                e.target.files?.[0] || null,
                true
              )
            }
          />
          {formData.pdf.previewUrl && (
            <div className="mt-4">
              <iframe
                src={formData.pdf.previewUrl}
                title="PDF Preview"
                className="w-full h-96 rounded border"
              ></iframe>
            </div>
          )}
          <form onSubmit={handleSubmitPdf}>
            <div className="flex items-left justify-between mt-5">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
              >
                Add Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL */}
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Enter a Prompt</h3>
            <textarea
              rows={4}
              value={prompt.text}
              name="text"
              onChange={handelGenerateTextChange}
              className="w-full border p-2 rounded mb-4 resize-none"
              placeholder="Type your prompt here..."
              disabled={isGenerating}
            />
            {isGenerating && (
              <p className="text-sm text-gray-500 mb-3">
                Generating description...
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateText}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPost;
