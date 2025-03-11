import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Customer from "./pages/Customer"
import Navbar from "./components/Navbar";
import NewPurchase from "./pages/NewPurchase";
import ProductReturn from "./components/ProductReturn"
import PurchaseHistory from "./components/PurchaseHistory";
import CustomerList from "./components/CustomerList";
import ProductView from "./pages/ProductView";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default

  return (
    <BrowserRouter>
      <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`mt-20 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/customer" element={<Customer/>} />
          <Route exact path="/newpurchase" element={<NewPurchase/>} />
          <Route exact path="/productreturn" element={<ProductReturn/>} />
          <Route exact path="/purchasehistory" element={<PurchaseHistory/>} />
          <Route exact path="/customerlist" element={<CustomerList/>} />
          <Route exact path="/productview" element={<ProductView/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
