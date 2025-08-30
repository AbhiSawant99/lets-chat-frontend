import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@/App.css";
import LoginPage from "@/pages/login";
import { lazy } from "react";
import SignUp from "@/pages/sign-up";
import { AppProvider } from "@/components/app-provider/app-provider";
import NotFoundPage from "@/pages/not-found";

const ChatPage = lazy(() => import("@/pages/chat"));
const UsernameForm = lazy(() => import("@/pages/username-form"));

const WithProvider = (Component: React.FC) => (
  <AppProvider>
    <Component />
  </AppProvider>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/username-form" element={WithProvider(UsernameForm)} />
        <Route path="/chat" element={WithProvider(ChatPage)} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
