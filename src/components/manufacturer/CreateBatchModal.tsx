import React from "react";
import {
  CheckCircle,
  X,
  Package,
  Calendar,
  Beaker,
  Hash,
  Pill,
} from "lucide-react";

interface FormData {
  batchId: string;
  drugName: string;
  manufactureDate: string;
  expiryDate: string;
  chemicalComposition: string;
  quantity: string;
}

interface CreateBatchModalProps {
  setShowModal: (show: boolean) => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  showSuccess: boolean;
}

const CreateBatchModal = ({
  setShowModal,
  formData,
  handleInputChange,
  handleSubmit,
  showSuccess,
}: CreateBatchModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center h-screen z-50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Create New Batch
                </h3>
                <p className="text-sm text-blue-100 mt-1">
                  Mint a new medicine batch on the blockchain
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Batch ID */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Hash className="w-4 h-4 mr-2 text-blue-600" />
                Batch ID <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleInputChange}
                placeholder="e.g., BATCH-2024-001"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                required
              />
            </div>

            {/* Drug Name - ADDED THIS FIELD */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Pill className="w-4 h-4 mr-2 text-blue-600" />
                Drug/Medicine Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="drugName"
                value={formData.drugName}
                onChange={handleInputChange}
                placeholder="e.g., Paracetamol, Aspirin, Amoxicillin"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                required
              />
            </div>

            {/* Manufacture Date and Expiry Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  Manufacture Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={formData.manufactureDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                  Expiry Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Chemical Composition */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Beaker className="w-4 h-4 mr-2 text-purple-600" />
                Chemical Composition{" "}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="chemicalComposition"
                value={formData.chemicalComposition}
                onChange={handleInputChange}
                placeholder="e.g., Paracetamol 500mg, Caffeine 65mg"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Quantity (Units) */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Package className="w-4 h-4 mr-2 text-orange-600" />
                Quantity (Units) <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 10000"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 animate-slideDown shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="font-bold text-green-900 text-lg">
                    Success!
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Batch has been created successfully and minted on the
                    blockchain.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Note:</span> This
              action will create an NFT on the Cardano blockchain
            </p>
            <button
              onClick={handleSubmit}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Mint Batch
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateBatchModal;
