import Sidebar from "../components/Sidebar";
import "../styles/Home.css";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <Sidebar />

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
