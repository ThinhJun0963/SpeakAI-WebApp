import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { voucherApi } from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import { Trash2, Edit, Plus } from "lucide-react";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await voucherApi.getAll();
        setVouchers(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("Failed to load vouchers: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await voucherApi.delete(id);
        setVouchers(vouchers.filter((voucher) => voucher.voucherId !== id));
      } catch (err) {
        alert("Failed to delete voucher: " + err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Voucher Management</h1>
        <Link
          to="/vouchers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          <Plus className="mr-2" /> Add New Voucher
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <motion.div
            key={voucher.voucherId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {voucher.voucherCode}
              </h2>
              <p className="text-gray-600 mb-4">{voucher.description}</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Discount:</span>{" "}
                  {voucher.discountPercentage}%
                  {voucher.discountAmount > 0 &&
                    ` + $${voucher.discountAmount}`}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Valid:</span>{" "}
                  {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                  {new Date(voucher.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Quantity:</span>{" "}
                  {voucher.remainingQuantity}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      voucher.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {voucher.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-end p-4 bg-gray-50">
              <Link
                to={`/vouchers/edit/${voucher.voucherId}`}
                className="text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-300"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={() => handleDelete(voucher.voucherId)}
                className="text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VoucherPage;
