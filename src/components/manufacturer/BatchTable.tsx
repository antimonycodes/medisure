import React from "react";
import { Eye, Calendar, Package, Plus } from "lucide-react";
import { Batch } from "@/utils/types";

interface BatchTableProps {
  batches: Batch[];
  onViewBatch: (batch: Batch) => void;
  onCreateBatch: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Minted":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "In Transit":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Expired":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  onViewBatch,
  onCreateBatch,
}) => {
  if (batches.length === 0) {
    return (
      <div className="text-center py-14">
        <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No batches yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Create your first medicine batch to start tracking on the blockchain.
        </p>
        <button
          onClick={onCreateBatch}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Batch
        </button>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Batch ID
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Composition
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Expiry Date
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Status
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {batches.map((batch) => (
          <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-5 whitespace-nowrap">
              <span className="text-base font-semibold text-gray-900">
                {batch.id}
              </span>
            </td>
            <td className="px-6 py-5">
              <span className="text-base text-gray-700">
                {batch.composition}
              </span>
            </td>
            <td className="px-6 py-5 whitespace-nowrap">
              <span className="text-base text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {batch.expiryDate}
              </span>
            </td>
            <td className="px-6 py-5 whitespace-nowrap">
              <span
                className={`px-3 py-1.5 inline-flex text-sm font-medium rounded-full border ${getStatusColor(
                  batch.status
                )}`}
              >
                {batch.status}
              </span>
            </td>
            <td className="px-6 py-5 whitespace-nowrap">
              <button
                className="flex items-center text-sm font-medium text-gray-900 hover:text-blue-700 transition-colors"
                onClick={() => onViewBatch(batch)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BatchTable;
