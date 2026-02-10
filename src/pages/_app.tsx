import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { WALLET_FEATURES_ENABLED } from "@/utils/walletMode";

export default function App({ Component, pageProps }: AppProps) {
  // Runtime guards for wallet SDK integration (kept for compatibility)
  useEffect(() => {
    let isMounted = true;
    const originalError = console.error;

    // Pre-initialize libsodium to avoid intermittent wallet runtime crashes.
    const initSodium = async () => {
      try {
        const sodium = await import("libsodium-wrappers-sumo");
        await sodium.ready;
      } catch (error) {
        if (isMounted) {
          console.warn("libsodium initialization skipped:", error);
        }
      }
    };
    initSodium();

    const onWindowError = (event: ErrorEvent) => {
      const message = `${event.message || ""} ${event.error || ""}`;
      if (message.includes("libsodium was not correctly initialized")) {
        event.preventDefault();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = `${event.reason || ""}`;
      if (reason.includes("libsodium was not correctly initialized")) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    // Suppress wallet-related noise that is handled internally by Mesh SDK.
    console.error = (...args: any[]) => {
      const errorString = args[0]?.toString?.() || "";
      if (
        errorString.includes("invalidated") ||
        errorString.includes("postMessage") ||
        errorString.includes("account changed") ||
        errorString.includes("account_changed") ||
        errorString.includes("libsodium was not correctly initialized")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    // Patch postMessage to handle cloning issues
    const originalPostMessage = window.postMessage.bind(window);

    // @ts-expect-error override browser postMessage wrapper signature for safety patch
    window.postMessage = function (
      message: any,
      targetOrigin: string,
      transfer?: any
    ) {
      try {
        if (typeof message === "object" && message !== null) {
          const safeMessage = JSON.parse(JSON.stringify(message));
          originalPostMessage(safeMessage, targetOrigin, transfer);
        } else {
          originalPostMessage(message, targetOrigin, transfer);
        }
      } catch {
        try {
          originalPostMessage(message, targetOrigin, transfer);
        } catch {
          return;
        }
      }
    };

    const onWalletMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "account_changed" ||
        event.data?.type === "accountChanged"
      ) {
        return;
      }
    };
    window.addEventListener("message", onWalletMessage);

    return () => {
      isMounted = false;
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("message", onWalletMessage);
      window.postMessage = originalPostMessage as any;
      console.error = originalError;
    };
  }, []);

  return (
    <AuthProvider>
      {!WALLET_FEATURES_ENABLED && null}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
