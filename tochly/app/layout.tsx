"use client";
import { ToastContainer } from "react-toastify";
import CustomProvider from "@/redux/provider";

import { Authenticate } from "@/app/auth/components";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/themes.scss";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  
  return (
    <html lang="en">
      <body data-bs-theme="light">
        <CustomProvider>
          <Authenticate />
          <ToastContainer />
          {children}
        </CustomProvider>
      </body>
    </html>
  );
}
