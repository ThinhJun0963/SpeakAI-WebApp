import React, { useContext } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { Dropdown, Menu, Avatar, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import ApiContext from "../../context/ApiContext";

const Header = ({ className }) => {
  const navigate = useNavigate();
  const { authApi } = useContext(ApiContext);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm logout",
      content: "Are you sure you want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        await authApi.logout();
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  const profileMenu = (
    <Menu className="w-48">
      <Menu.Item key="profile" icon={<User className="h-4 w-4" />}>
        Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogOut className="h-4 w-4" />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header
      className={`bg-white shadow-sm p-4 border-b border-gray-100 ${className}`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4"></div>
        <div className="flex items-center space-x-4">
          <Dropdown
            menu={profileMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300">
              <Avatar
                src="https://i.pravatar.cc/150?img=3"
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
