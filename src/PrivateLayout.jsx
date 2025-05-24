import { Outlet } from "react-router-dom";
import Sidebar from "../src/components/sidebar";
import Header from "../src/components/header";
import "./global.css"

const PrivateLayout = () => {
  return (
    <div className="">
      <Header />

      <div className="Main">
        <Sidebar />

        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
