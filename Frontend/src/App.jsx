import { Routes, Route, useLocation } from "react-router-dom"; 
import { useState } from "react"; 
import "./App.css"; 
import Home from "./pages/Home"; 
import Customer from "./pages/Customer"; 
import Navbar from "./components/Navbar"; 
import NewPurchase from "./pages/NewPurchase"; 
import ProductReturn from "./components/ProductReturn"; 
import PurchaseHistory from "./components/PurchaseHistory"; 
import CustomerList from "./components/CustomerList"; 
import ProductView from "./pages/ProductView"; 
import AddProductForm from "./components/AddProductForm"; 
import UserRegister from "./pages/UserRegister"; 
import LoginPage from "./pages/LoginPage"; 
import Dashboard from "./pages/Dashboard";
import Approval from "./pages/ApprovalPage";
import PaymentUpdate from "./pages/PaymentUpdate";
import TransactionList from "./components/TransactionList";
import Restock from "./pages/RestockPage";
import Report from "./pages/ReportPage";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default
  const location = useLocation();  // Now useLocation can work because it's inside the Router

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/";

  return (
    <div>
      {/* Only render Navbar and Sidebar if not on the login page */}
      {!isLoginPage && (
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div className={`mt-20 transition-all duration-300 ${isSidebarOpen && !isLoginPage ? "ml-64" : "ml-0"}`}>
        <Routes>
          {/* Routes for different pages */}
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/customer" element={<Customer />} />
          <Route exact path="/newpurchase" element={<NewPurchase />} />
          <Route exact path="/productreturn" element={<ProductReturn />} />
          <Route exact path="/purchasehistory" element={<PurchaseHistory />} />
          <Route exact path="/customerlist" element={<CustomerList />} />
          <Route exact path="/productview" element={<ProductView />} />
          <Route exact path="/productadd" element={<AddProductForm />} />
          <Route exact path="/adduser" element={<UserRegister />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/approval" element={<Approval/>} />
          <Route exact path="/payment" element={<PaymentUpdate/>} />
          <Route exact path="/payback" element={<TransactionList/>} />
          <Route exact path="/restock" element={<Restock/>} />
          <Route exact path="/report" element={<Report/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
