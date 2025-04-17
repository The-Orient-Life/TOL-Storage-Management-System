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
import ProtectedRoute from "./components/ProtectedRoute"; // 👈 New import

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div>
      {!isLoginPage && (
        <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div className={`mt-20 transition-all duration-300 ${isSidebarOpen && !isLoginPage ? "ml-64" : "ml-0"}`}>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newpurchase"
            element={
              <ProtectedRoute>
                <NewPurchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productreturn"
            element={
              <ProtectedRoute>
                <ProductReturn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchasehistory"
            element={
              <ProtectedRoute>
                <PurchaseHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customerlist"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productview"
            element={
              <ProtectedRoute>
                <ProductView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productadd"
            element={
              <ProtectedRoute>
                <AddProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adduser"
            element={
              <ProtectedRoute>
                <UserRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approval"
            element={
              <ProtectedRoute>
                <Approval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repayment"
            element={
              <ProtectedRoute>
                <TransactionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restock"
            element={
              <ProtectedRoute>
                <Restock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
