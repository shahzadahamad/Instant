import { useTheme } from "@/components/ui/theme-provider";
import { Toaster as HotToastToaster } from "react-hot-toast";

const Toaster = () => {
  const { theme } = useTheme();
  return (
    <HotToastToaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "transparent",
          borderWidth: "1px",
          color: `${theme === "dark" ? "white" : "black"}`,
        },
      }}
    />
  );
};

export default Toaster;
