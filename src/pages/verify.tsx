import { useState } from "react";
import { AlertTriangle, CheckCircle2, Pill, Factory } from "lucide-react";

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/verify_drug?assetId=${input}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ isValid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f6",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* LOGO AREA */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#2563eb", margin: "0" }}>MediSure</h1>
          <p style={{ color: "#64748b" }}>Patient Verification Portal</p>
        </div>

        {/* INPUT AREA */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            Scan or Enter Batch ID
          </label>
          <input
            type="text"
            placeholder="Paste ID (or type 'demo')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "2px solid #cbd5e1",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? " Verifying..." : "Check Authenticity"}
        </button>

        {/* RESULT AREA */}
        {result && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "15px",
              backgroundColor: result.isValid ? "#ecfdf5" : "#fef2f2",
              border: result.isValid
                ? "2px solid #10b981"
                : "2px solid #ef4444",
            }}
          >
            {result.isValid ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                  <CheckCircle2 size={50} color="#10b981" />
                </div>
                <h2 style={{ color: "#065f46", margin: "0 0 10px 0" }}>
                  Verified Authentic
                </h2>
                <div
                  style={{
                    textAlign: "left",
                    marginTop: "20px",
                    color: "#1f2937",
                  }}
                >
                  <p>
                    <strong>
                      <Pill size={14} style={{ display: "inline", marginRight: "4px" }} />
                      Drug:
                    </strong>{" "}
                    {result.drugName}
                  </p>
                  <p>
                    <strong>
                      <Factory size={14} style={{ display: "inline", marginRight: "4px" }} />
                      Manufacturer:
                    </strong>{" "}
                    {result.manufacturer}
                  </p>
                  <p>
                    <strong>Batch ID:</strong> {result.batchId}
                  </p>
                  <p>
                    <strong>Expiry:</strong> {result.expiry}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                  <AlertTriangle size={50} color="#ef4444" />
                </div>
                <h2 style={{ color: "#991b1b" }}>Warning: Not Found</h2>
                <p style={{ color: "#7f1d1d" }}>
                  This product ID does not exist on the blockchain. It may be
                  counterfeit.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
