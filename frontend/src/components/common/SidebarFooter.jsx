// components/common/SidebarFooter.jsx
import React, { useContext } from "react";
import { useData } from "../../context/DataContext.jsx";
import { useNavigate } from "react-router-dom";

const SidebarFooter = () => {
  const { logoutUser } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className=" fixed bottom-0 left-0 md:w-64 w-full bg-gray-800 text-white py-3 flex justify-center border-t border-gray-700">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default SidebarFooter;
