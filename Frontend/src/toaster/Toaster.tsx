import { Toaster as HotToastToaster } from "react-hot-toast";

const Toaster = () => {
  return (
    <HotToastToaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
};

export default Toaster;
