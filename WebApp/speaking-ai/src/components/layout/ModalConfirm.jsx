import { Modal, Button } from "antd";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom for navigation

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
          Có
        </Button>
        <Button key="cancel" onClick={() => Modal.destroyAll()}>
          Không
        </Button>
      </div>
    ),
  });
};

export default handleLogout;
