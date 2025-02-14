// export const Select = ({ label, options, error, ...props }) => {
//   return (
//     <div className="space-y-1">
//       {label && (
//         <label className="block text-sm font-medium text-gray-700">
//           {label}
//         </label>
//       )}
//       <select
//         className={`
//           w-full p-2 border rounded
//           ${error ? "border-red-500" : "border-gray-300"}
//           focus:outline-none focus:ring-2 focus:ring-blue-500
//         `}
//         {...props}
//       >
//         <option value="">Select an option</option>
//         {options.map((option) => (
//           <option key={option.id} value={option.id}>
//             {option.name}
//           </option>
//         ))}
//       </select>
//       {error && <p className="text-sm text-red-500">{error}</p>}
//     </div>
//   );
// };
