import { ShieldCheck } from "lucide-react";

const VerificationIcon = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer light-green ring (smaller) */}
      <div
        aria-hidden
        className="absolute rounded-full w-28 h-28 md:w-40 md:h-40"
        style={{
          backgroundColor: "rgba(200, 244, 227, 0.85)",
        }}
      />

      {/* Glow halo */}
      <div
        aria-hidden
        className="absolute rounded-full w-28 h-28 md:w-40 md:h-40"
        style={{
          background:
            "radial-gradient(circle at center, rgba(200,244,227,0.5) 0%, rgba(200,244,227,0.12) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Blue center circle */}
      <div
        className="relative rounded-full flex items-center justify-center w-16 h-16 md:w-24 md:h-24 shadow-xl"
        style={{
          background: "linear-gradient(180deg, #2E7BF6 0%, #2463E6 100%)",
        }}
      >
        {/* Icon */}
        <ShieldCheck className="w-7 h-7 md:w-10 md:h-10 text-white" />

        {/* Subtle inner shine */}
        <span
          aria-hidden
          className="absolute rounded-full inset-0"
          style={{
            boxShadow: "inset 0 6px 14px rgba(255,255,255,0.08)",
          }}
        />
      </div>
    </div>
  );
};

export default VerificationIcon;
