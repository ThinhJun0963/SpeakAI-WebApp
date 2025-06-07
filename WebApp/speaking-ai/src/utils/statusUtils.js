export const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
    case "Inactive":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
  }
};
