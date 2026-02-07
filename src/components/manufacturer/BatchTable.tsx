import React from "react";
import { Eye, Send, Calendar, Package, Plus } from "lucide-react";
import { Batch } from "@/utils/types";

interface BatchTableProps {
  batches: Batch[];
  mintedBatchIds: Set<string>;
  onViewBatch: (batch: Batch) => void;
  onTransferBatch: (batch: Batch) => void;
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
  mintedBatchIds,
  onViewBatch,
  onTransferBatch,
  onCreateBatch,
}) => {
  if (batches.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Batches Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first batch to get started
        </p>
        <button
          onClick={onCreateBatch}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create First Batch
        </button>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50/80">
        <tr>
          <th className="px-6 py-4 text-left text-gray-700 text-xs font-bold uppercase tracking-wider">
            Batch ID
          </th>
          <th className="px-6 py-4 text-left text-gray-700 text-xs font-bold uppercase tracking-wider">
            Composition
          </th>
          <th className="px-6 py-4 text-left text-gray-700 text-xs font-bold uppercase tracking-wider">
            Expiry Date
          </th>
          <th className="px-6 py-4 text-left text-gray-700 text-xs font-bold uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-4 text-left text-gray-700 text-xs font-bold uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {batches.map((batch, index) => (
          <tr
            key={batch.id}
            className="hover:bg-blue-50/30 transition-colors duration-150 group"
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
            }}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                <span className="text-sm font-bold text-gray-900">
                  {batch.id}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-700">{batch.composition}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {batch.expiryDate}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border ${getStatusColor(
                  batch.status
                )}`}
              >
                {batch.status}
              </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => onViewBatch(batch)}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  View
                </button>
                <button
                  onClick={() => onTransferBatch(batch)}
                  disabled={!mintedBatchIds.has(batch.id)}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    mintedBatchIds.has(batch.id)
                      ? "text-purple-600 hover:text-purple-700 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  title={
                    mintedBatchIds.has(batch.id)
                      ? "Transfer batch"
                      : "Only minted batches can be transferred"
                  }
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  Transfer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BatchTable;
