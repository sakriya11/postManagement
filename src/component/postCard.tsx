import axios from "axios";
import React from "react";
import { API_URL } from "../config";
import { handleAxiosError, showSuccessToast } from "../utils/toastUtils";

interface Post {
  _id: string;
  img?: string;
  pdf?: string;
  title: string;
  date: string;
  description: string;
  role: string;
}

interface PostCardProps {
  post: Post;
  type?: "image" | "pdf";
  isAdmin: boolean;
}

const url = "http://localhost:3000";

const baseUrl = (path: string) => {
  return `${url}/${path.replace(/\\/g, "/")}`;
};

//delete post
const handelDelete = async (id: string) => {
  try {
    const userToken = localStorage.getItem("accessToken");
    const response = await axios.delete(`${API_URL}/admin/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.data) {
      showSuccessToast(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (error: unknown) {
    handleAxiosError(error);
  }
};

const PostCard: React.FC<PostCardProps> = ({ post, type, isAdmin }) => {
  const pdfUrl = post.pdf ? baseUrl(post.pdf) : "";

  return (
    <div className="bg-white shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden mb-10">
      {type === "image" && post.img && (
        <img
          src={baseUrl(post.img)}
          alt={post.title}
          className="w-full h-64 object-cover"
          crossOrigin="anonymous"
        />
      )}

      {type === "pdf" && pdfUrl && (
        <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-100 text-center">
          <p className="text-gray-600 mb-2">PDF Available</p>
          <div className="flex gap-4">
            <a
              href={pdfUrl}
              download
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Download PDF
            </a>
          </div>
        </div>
      )}

      <div className="flex mx-4 justify-between items-center mt-2">
        <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
        {post.date && <div>{post.date}</div>}
      </div>

      <div className="mx-4 mb-2">
        {post.description && (
          <p className="text-gray-700 text-sm mb-2">{post.description}</p>
        )}
        <div className="flex justify-between items-center">
          <div>Post from: {post.role}</div>
          {isAdmin && (
            <button
              onClick={() => handelDelete(post._id)}
              className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
