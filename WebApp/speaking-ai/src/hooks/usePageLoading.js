import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const usePageLoading = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const prevPathnameRef = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Chỉ chạy khi pathname thay đổi
    if (location.pathname !== prevPathnameRef.current) {
      console.log("[usePageLoading] Location changed:", location.pathname);

      // Xóa timeout cũ nếu có
      if (timeoutRef.current) {
        console.log("[usePageLoading] Clearing previous timeout");
        clearTimeout(timeoutRef.current);
      }

      // Đặt loading và timer mới
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        console.log("[usePageLoading] Loading finished");
        setLoading(false);
        timeoutRef.current = null;
      }, 500);

      // Cập nhật prevPathnameRef
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        console.log("[usePageLoading] Cleaning up timeout on unmount");
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return loading;
};
