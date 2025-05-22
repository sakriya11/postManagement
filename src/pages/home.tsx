import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import PostCard from "../component/postCard";
import "../../src/index.css";
import { useNavigate } from "react-router-dom";

type Post = {
  _id: string;
  img?: string;
  pdf?: string;
  title: string;
  date: string;
  description: string;
  role: string;
};

const HomePage = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [pdfPosts, setPdfPosts] = useState<Post[]>([]);
  const [option, setOption] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value);
  };

  //for img content
  useEffect(() => {
    const contentData = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        const userToken = localStorage.getItem("accessToken");

        const datas = await axios.get(
          `${API_URL}/view/img-content/${userRole}`,

          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (datas.data) {
          setPosts(datas.data.finalData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    contentData();
  }, []);

  //for pdf content
  useEffect(() => {
    const contentData = async () => {
      try {
        const userRole = localStorage.getItem("userRole");
        const userToken = localStorage.getItem("accessToken");

        const datas = await axios.get(
          `${API_URL}/view/pdf-content/${userRole}`,

          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (datas.data) {
          setPdfPosts(datas.data.finalData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    contentData();
  }, []);

  const logout = async () => {
    localStorage.clear();
    navigate("/");
  };

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("username");



  return (
    <div className="mx-auto p-4 bg-gray-50 min-h-screen w-full">
      <div className="flex  justify-between items-center w-full mb-2">
        <div>
          <div>
            Welcome <br />
            {userName}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/add-post")}
            className="bg-blue-500 hover:bg-blue-700 shadow-2xl text-white lg:font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          >
            Add Post
          </button>
          <button onClick={logout} className="Btn">
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>

            <div className="text">Logout</div>
          </button>
        </div>
      </div>

      <div className="lg:flex justify-between items-center w-full mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Latest Announcements
        </h1>
        <div className="flex space-x-4">
          <select
            id="category"
            value={option}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Choose a post --</option>
            <option value="image">Post</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
      </div>

      {/* Render Posts */}
      {(() => {
        const selectedPosts = option === "pdf" ? pdfPosts : posts;

        if (selectedPosts.length === 0) {
          return (
            <p className="text-center">
              No {option === "pdf" ? "PDF" : "Post"} posts available
            </p>
          );
        }

        return (
          <div className="lg:grid grid-cols-3 items-stretch gap-x-10">
            {selectedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                type={option === "pdf" ? "pdf" : "image"}
                isAdmin={userRole === "admin"}
               
              />
            ))}
          </div>
        );
      })()}
    </div>
  );
};

export default HomePage;
