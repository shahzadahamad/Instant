import { Toaster as HotToastToaster } from "react-hot-toast";

const Toaster = () => {
  return (
    <HotToastToaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
           background: "transparent",
           borderWidth: "1px",
           color: "white",
        }
      }}
    />
  );
};

export default Toaster;
