"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster position="bottom-center" 
       toastOptions={{
    style: {
      color: "oklch(58.5% 0.233 277.117)",
      background: "#fff",
    },
     iconTheme: {
    secondary: "#ffffff",   // check icon color
    primary: "oklch(58.5% 0.233 277.117)", // circle background
  },
  }}/>
    </>
  );
}
