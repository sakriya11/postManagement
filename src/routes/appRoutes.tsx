import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import EmailConfirmation from "../pages/emailConfirmation";
import FaceRecognize from "../pages/faceRecognize";
import Home from "../pages/home";
import AddPost from "../pages/addPost";
import PrivateRoute from "../utils/privateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-confirm" element={<EmailConfirmation />} />
      <Route path="/face-register" element={<FaceRecognize />} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/add-post" element={<AddPost />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
