import CropRecommendation from "./CropRecommendation.js";
import DiagnoseNow from "./DiagnoseNow.js";
import Navbar from "./Navbar.js";
import ContactPage from "./ContactPage.js";
import Footer from "./Footer.js"
import { Outlet } from "react-router-dom";

function Body() {
  return (
    <div>
      <Navbar />
      <Outlet/>
      <Footer />
    </div>
  );
}

export default Body;
