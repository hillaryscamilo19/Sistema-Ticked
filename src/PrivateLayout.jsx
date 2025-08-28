import { Outlet } from "react-router-dom";
import Sidebar from "../src/components/sidebar";

import "./global.css"

const PrivateLayout = () => {
  return (
    <div className="">


      <div className="Main">
<Outlet />

        <main className="">
  
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
