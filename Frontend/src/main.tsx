import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Toaster from "./toaster/Toaster.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { NextUIProvider } from "@nextui-org/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NextUIProvider>
          <App />
          <Toaster />
        </NextUIProvider>
      </ThemeProvider>
    </StrictMode>
  </Provider>
);
