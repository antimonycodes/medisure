import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";

const APIDebugger = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (
    test: string,
    status: "success" | "error" | "warning",
    message: string,
    data?: any,
  ) => {
    setResults((prev) => [
      ...prev,
      { test, status, message, data, time: new Date().toISOString() },
    ]);
  };

  const testAPI = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Check environment variable
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
    addResult(
      "Environment Variable",
      apiUrl ? "success" : "error",
      apiUrl || "NOT SET",
      {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      },
    );

    // Test 2: Check if backend is reachable
    try {
      const baseUrl = apiUrl || "http://localhost:8000/api";
      addResult(
        "Testing Backend",
        "warning",
        `Attempting to reach: ${baseUrl}`,
      );

      const response = await fetch(`${baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        addResult("Health Check", "success", "Backend is reachable!", data);
      } else {
        addResult(
          "Health Check",
          "error",
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error: any) {
      addResult(
        "Health Check",
        "error",
        `Cannot reach backend: ${error.message}`,
        {
          errorType: error.name,
          message: error.message,
        },
      );
    }

    // Test 3: Try to reach /mint/ endpoint
    try {
      const baseUrl = apiUrl || "http://localhost:8000/api";
      const testPayload = {
        batch_id: "TEST-" + Date.now(),
        medicine_name: "Test Medicine",
        composition: "Test Composition",
        manufacturer_id: "test-manufacturer",
        manufactured_date: "2024-01-01",
        expiry_date: "2025-01-01",
        quantity: "100",
        manufacturer_wallet: "addr_test1xxx",
        tx_hash: "test-hash-" + Date.now(),
      };

      addResult(
        "Testing Mint Endpoint",
        "warning",
        "Sending test payload...",
        testPayload,
      );

      const response = await fetch(`${baseUrl}/mint/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      });

      const responseData = await response.json();

      if (response.ok) {
        addResult(
          "Mint Endpoint",
          "success",
          "Endpoint responded successfully!",
          responseData,
        );
      } else {
        addResult(
          "Mint Endpoint",
          "error",
          `HTTP ${response.status}: ${response.statusText}`,
          responseData,
        );
      }
    } catch (error: any) {
      addResult(
        "Mint Endpoint",
        "error",
        `Failed to reach mint endpoint: ${error.message}`,
        {
          errorType: error.name,
          message: error.message,
        },
      );
    }

    // Test 4: Check CORS
    addResult(
      "CORS Check",
      "warning",
      "If you see CORS errors in console, backend needs CORS configuration",
    );

    setTesting(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Loader className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Debugger
          </h1>
          <p className="text-gray-600 mb-6">
            Test your backend API connection and endpoints
          </p>

          <button
            onClick={testAPI}
            disabled={testing}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {testing ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Run API Tests"
            )}
          </button>

          {results.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Test Results:</h2>

              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${getBackgroundColor(
                    result.status,
                  )}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(result.status)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {result.test}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                        {result.message}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(result.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">
              Troubleshooting Tips:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Check if{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  NEXT_PUBLIC_API_URL
                </code>{" "}
                is set in your .env file
              </li>
              <li>
                • Ensure your backend server is running (usually on port 8000)
              </li>
              <li>• Check browser console for CORS errors</li>
              <li>• Verify backend has CORS headers configured</li>
              <li>
                • Try both{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">localhost</code>{" "}
                and{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">127.0.0.1</code>
              </li>
              <li>• Restart Next.js dev server after changing .env</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDebugger;
