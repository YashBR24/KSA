
import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, Home, Users, Calendar, Landmark, LogOut, Phone, CalendarCheck, TicketCheck, Box, UserCheck, Building, Trophy, LandPlot, IndianRupee, FileClock,ReceiptIndianRupee } from 'lucide-react';
import AcademyManagement from "./AcademyManagement";
import AttendanceManagement from "./AttendanceManagement";
import AccountsOverview from "./AccountsOverview";
import BoxCricketManagement from "./BoxCricketManagement";
import ContactUsQueries from "./ContactUsQueries";
import EventManagement from "./EventManagement";
import EventParticipants from "./EventParticipants";
import GalleryManagement from "./GalleryManagement";
import GroundManagement from "./GroundManagement";
import InventoryManagement from "./InventoryManagement";
import StaffManagement from "./StaffManagement";
import StaffAttendance from "./StaffAttendance";
import ManagerHome from "./ManagerHome";
import PlanManagement from "./PlanManagement";
import ExtraPage from "../Admin/AdminExtraPage.jsx";
import PendingPayments from "./PendingPayments.jsx";
import InventoryTransactions from './InventoryTransactions'; 

const ADMIN_ID1 = import.meta.env.VITE_ADMIN_IDS;
const ADMIN_ID2 = import.meta.env.VITE_ADMIN_IDS1;
const ADMIN_ID3 = import.meta.env.VITE_ADMIN_IDS2;

function ManagerDashboard() {
  const [activeComponent, setActiveComponent] = useState(() => localStorage.getItem("activeComponent") || "ManagerHome");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const verifyUser = () => {
    try {
      const userid = localStorage.getItem('userid');
      if (!userid) {
        window.location.href = '/login';
        return;
      }

      if (userid === ADMIN_ID1 || userid === ADMIN_ID2 || userid === ADMIN_ID3) {
        setIsAdmin(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error verifying user:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const renderComponent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeComponent) {
      case "Academy": return <AcademyManagement />;
      case "PendingPayments": return<PendingPayments/>;
      case "Attendance": return <AttendanceManagement />;
      case "Accounts": return <AccountsOverview />;
      case "InventoryTransactions":return<InventoryTransactions/>;
      case "BoxCricket": return <BoxCricketManagement />;
      case "Plans": return <PlanManagement />;
      case "ContactUs": return <ContactUsQueries />;
      case "Events": return <EventManagement />;
      case "Gallery": return <GalleryManagement />;
      case "Inventory": return <InventoryManagement />;
      case "Staff": return <StaffManagement />;
      case "StaffAttendance": return <StaffAttendance />;
      case "ManagerHome": return <ManagerHome />;
      case "ExtraPage":
        return isAdmin ? <ExtraPage /> : (
          <div className="p-4 text-red-500 bg-red-50 rounded-lg">Unauthorized: Admin access required</div>
        );
      default: return <div className="text-gray-600">Select a module from the menu.</div>;
    }
  }, [activeComponent, isAdmin, isLoading]);

  const menuItems = [
    { label: "Home", key: "ManagerHome", icon: <Home size={18} /> },
    { label: "Academy", key: "Academy", icon: <Building size={18} /> },
    { label: "PendingPayments", key: "PendingPayments", icon: <ReceiptIndianRupee size={18} /> },
    { label: "Attendance", key: "Attendance", icon: <Calendar size={18} /> },
    { label: "Accounts Overview", key: "Accounts", icon: <IndianRupee size={18} /> },
    { label: "Inventory Transactions", key: "InventoryTransactions", icon: <TicketCheck size={18} /> },
    { label: "Plans Management", key: "Plans", icon: <LandPlot size={18} /> },
    { label: "Box Cricket Bookings", key: "BoxCricket", icon: <Trophy size={18} /> },
    // { label: "Contact Queries", key: "ContactUs", icon: <Phone size={18} /> },
    { label: "Events", key: "Events", icon: <CalendarCheck size={18} /> },
    // { label: "Gallery", key: "Gallery", icon: <Image size={18} /> },
    { label: "Inventory", key: "Inventory", icon: <Box size={18} /> },
    { label: "Staff Manage", key: "Staff", icon: <Users size={18} /> },
    { label: "Staff Attendance", key: "StaffAttendance", icon: <UserCheck size={18} /> },
  ];

  if (isAdmin) {
    menuItems.push({ label: "Logs & Users", key: "ExtraPage", icon: <FileClock size={18} /> });
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-white shadow-sm border-b px-4 py-3 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          KAVYA SPORTS ACADEMY
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Role: {isAdmin ? 'Administrator' : 'Manager'}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        <aside
          className={`fixed top-16 left-0 bg-white shadow-lg h-[calc(100vh-4rem)] w-64 z-40 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 overflow-y-auto`}
        >
          <nav className="p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveComponent(item.key);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    activeComponent === item.key
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-1 md:p-6 ml-0 md:ml-64">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {menuItems.find(item => item.key === activeComponent)?.label}
            </h2>
            <div className="text-gray-600">{renderComponent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManagerDashboard;