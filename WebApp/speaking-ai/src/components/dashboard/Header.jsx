import React from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { Dropdown, Avatar, Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Hàm lấy avatar
const getAvatar = () => {
  const googleAvatar = localStorage.getItem("googleAvatar");
  if (googleAvatar) {
    return googleAvatar; // Avatar từ Google
  }
  return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"; // Avatar phổ thông
};

const Header = ({ className }) => {
  const navigate = useNavigate();
  const { authApi } = useContext(ApiContext);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm logout",
      content: "Are you sure you want to log out?",
      width: 400,
      style: { borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
      footer: (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            padding: "8px",
          }}
        >
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              toast.success("Log out successfully!");
              Modal.destroyAll();
            }}
          >
            Yes
          </Button>
          <Button key="cancel" onClick={() => Modal.destroyAll()}>
            No
          </Button>
        </div>
      ),
    });
  };

  // Định nghĩa menu cho Dropdown (bỏ Profile)
  const menu = {
    items: [
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogOut className="h-4 w-4" />,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <header
      className={`bg-white shadow-sm p-4 border-b border-gray-100 ${className}`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4"></div>
        <div className="flex items-center space-x-4">
          <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
              <Avatar
                src={getAvatar()}
                size={32}
                className="hover:scale-110 transition-transform duration-300"
              />
              <span className="font-medium text-gray-700">Admin</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
