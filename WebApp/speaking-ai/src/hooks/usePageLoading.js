import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

export const usePageLoading = ({
  delay = 300, // Default delay in ms
  onLoadStart = () => {}, // Callback on load start
  onLoadEnd = () => {}, // Callback on load end
} = {}) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const prevPathnameRef = useRef("");
  const timeoutRef = useRef(null);
  const isFetchingRef = useRef(false); // Track active fetches

  // Handle page loading based on navigation and async operations
  const startLoading = useCallback(() => {
    if (!loading && !isFetchingRef.current) {
      onLoadStart();
      setLoading(true);
    }
  }, [loading, onLoadStart]);

  const endLoading = useCallback(() => {
    if (loading && !isFetchingRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        onLoadEnd();
        timeoutRef.current = null;
      }, delay);
    }
  }, [loading, delay, onLoadEnd]);

  // Track pathname changes
  useEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      startLoading();
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, startLoading]);

  // Manage async operation tracking
  const trackAsyncOperation = useCallback(
    (promise) => {
      isFetchingRef.current = true;
      startLoading();
      return promise.finally(() => {
        isFetchingRef.current = false;
        endLoading();
      });
    },
    [startLoading, endLoading]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    loading,
    setLoading, // Allow manual control if needed
    trackAsyncOperation, // Utility to track async operations
    getLoaderConfig: () => ({
      isLoading: loading,
      delay,
    }), // Provide config for loader rendering in JSX components
  };
};
