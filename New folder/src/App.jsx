import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChasePage from "./pages/Home";
import TransferForm from "./pages/Transfer";
import ChaseDashboard from "./pages/Dashboard";
import HomeLayout from "./layouts/HomeLayout";
import MainLayout from "./layouts/MainLayout";
import ChaseProfileSection from "./pages/Profile";
import ChaseStatements from "./pages/Statement&documents";
import ProtectedLayout from "./layouts/ProtectedLayout";
import TransferActivity from "./pages/TranferActivity";





export default function App() {

  
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <HomeLayout>
          <ChasePage/>
          </HomeLayout>
      } />

<Route element={<ProtectedLayout />}>

        <Route path="/dashboard" element={
          <MainLayout>
          <ChaseDashboard/>
          </MainLayout>
          
        } />
        <Route path="/Profile" element={
          <MainLayout>

          <ChaseProfileSection/>
          </MainLayout>
          
        } />
        <Route path="/statement&documents" element={
          <MainLayout>

          <ChaseStatements/>
          </MainLayout>
          
        } />


        <Route path="/transfer" element={
          <MainLayout>

          <TransferForm/>
          </MainLayout>
          
        } />
        <Route path="/transferactivity" element={
          <MainLayout>

          <TransferActivity/>
          </MainLayout>
          
        } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}