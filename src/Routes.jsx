import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Nav from "./Nav/Nav";
import Home from "./Home/Home";
import Create from "./Create/Create";
import PostById from "./Post_By_Id/Post_By_Id";
import Profile from "./Profile/Profile";
import EditProfile from "./EditProfile/EditProfile";
import Router from "../Router";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/create" element={<Create />} />
          <Route exact path="/post/:id" element={<PostById />} />
          <Route exact path="/profile/:username" element={<Profile />} />
          <Route
            exact
            path="/:username/editprofile"
            element={<EditProfile />}
          />
          <Route exact path="/router" element={<Router />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
