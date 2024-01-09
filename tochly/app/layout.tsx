import { ToastContainer } from "react-toastify";
import CustomProvider from "@/redux/provider";

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
          <ToastContainer />
          {children}
        </CustomProvider>
      </body>
    </html>
  );
}
