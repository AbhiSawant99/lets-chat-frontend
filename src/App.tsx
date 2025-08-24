import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import { lazy } from "react";
import SignUp from "./pages/sign-up";
import { AppProvider } from "./components/app-provider/app-provider";
import UsernameForm from "@/pages/username-form";

const ChatPage = lazy(() => import("./pages/chat"));

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
        <Route path="/username-form" element={<UsernameForm />} />
        <Route path="/profile" element={WithProvider(ProfilePage)} />
        <Route path="/chat" element={WithProvider(ChatPage)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
