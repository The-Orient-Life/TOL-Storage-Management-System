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
import AddProductForm from "./components/AddProductForm";
import UserRegister from "./pages/UserRegister";
import LoginPage from "./pages/LoginPage"

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
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/customer" element={<Customer/>} />
          <Route exact path="/newpurchase" element={<NewPurchase/>} />
          <Route exact path="/productreturn" element={<ProductReturn/>} />
          <Route exact path="/purchasehistory" element={<PurchaseHistory/>} />
          <Route exact path="/customerlist" element={<CustomerList/>} />
          <Route exact path="/productview" element={<ProductView/>} />
          <Route exact path="/productadd" element={<AddProductForm/>} />
          <Route exact path="/adduser" element={<UserRegister/>} />
          <Route exact path="/" element={<LoginPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
