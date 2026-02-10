import React from "react";
import { X, Send, Wallet, AlertCircle } from "lucide-react";
import { Batch } from "@/utils/types";

interface TransferModalProps {
  batch: Batch;
  recipientAddress: string;
  transferring: boolean;
  onClose: () => void;
  onAddressChange: (address: string) => void;
  onTransfer: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  batch,
  recipientAddress,
  transferring,
  onClose,
  onAddressChange,
  onTransfer,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-slideUp overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Transfer Batch
                </h3>
                <p className="text-sm text-purple-100 mt-1">
                  Send to distributor or pharmacy
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Batch Info */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-purple-900 mb-2">
              Batch Details
            </h4>
            <div className="space-y-1 text-sm">
              <p className="text-purple-700">
                <strong>ID:</strong> {batch.id}
              </p>
              <p className="text-purple-700">
                <strong>Composition:</strong> {batch.composition}
              </p>
              <p className="text-purple-700">
                <strong>Status:</strong> {batch.status}
              </p>
            </div>
          </div>

          {/* Recipient Address Input */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Wallet className="w-4 h-4 mr-2 text-purple-600" />
              Recipient Wallet Address{" "}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="addr_test1... or addr1..."
              className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the Cardano wallet address of the recipient
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Important
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This action will transfer the NFT to the recipient. Make sure
                  the address is correct before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onTransfer}
            disabled={transferring || !recipientAddress}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {transferring ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Transferring...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer Batch
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
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

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TransferModal;
