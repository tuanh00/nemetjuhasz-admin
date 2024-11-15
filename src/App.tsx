import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { Suspense } from "react";
// import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import AdoptablePetEditor  from './pages/AdoptablePetEditor';

// const Login = lazy(() => import("./pages/Login"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Pets = lazy(() => import("./pages/Pets"));
// const AddPets = lazy(() => import("./pages/AddPets"));
// const UpdatePets = lazy(() => import("./pages/UpdatePets"));
// const DeletePets = lazy(() => import("./pages/DeletePets"));

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import AddPets from "./pages/AddPets";
// import UpdatePets from "./pages/UpdatePets";
// import DeletePets from "./pages/DeletePets";
import UpdatePetDetails from "./pages/UpdatePetDetails";
// import UpdatePets from "./pages/UpdatePets";
import AddHomeSection from "./pages/AddHomeSection";
import EditHomeSection from "./pages/EditHomeSection";
import HomeSectionList from "./pages/HomeSectionList";
const App = () => {
  return (
    <Router>
      {/* <Suspense fallback={<Loader />}>
       
      </Suspense> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pet"
          element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-pet"
          element={
            <ProtectedRoute>
              <AddPets />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/update-pet"
          element={
            <ProtectedRoute>
              <UpdatePets />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/delete-pet"
          element={
            <ProtectedRoute>
              <DeletePets />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/update-pet/:id"
          element={
            <ProtectedRoute>
              <UpdatePetDetails />
            </ProtectedRoute>
          }
        />
        {/* Route for Adoptable Pet Editor - uploading images for a pet*/}
        <Route
          path="/adoptable-pet-editor/:petId"
          element={
            <ProtectedRoute>
              <AdoptablePetEditor  />
            </ProtectedRoute>
          }
        />
 {/* Add new routes for home sections */}
 <Route path="/home-sections" element={<HomeSectionList />} />
        <Route path="/add-home-section" element={<AddHomeSection />} />
        <Route path="/edit-home-section/:id" element={<EditHomeSection />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
