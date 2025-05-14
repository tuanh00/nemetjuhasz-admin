import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { Suspense } from "react";
// import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import AdoptablePetEditor from "./pages/pet/AdoptablePetEditor";

// const Login = lazy(() => import("./pages/Login"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const Pets = lazy(() => import("./pages/Pets"));
// const AddPets = lazy(() => import("./pages/AddPets"));
// const UpdatePets = lazy(() => import("./pages/UpdatePets"));
// const DeletePets = lazy(() => import("./pages/DeletePets"));

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/pet/Pets";
import AddPets from "./pages/pet/AddPets";
// import UpdatePets from "./pages/UpdatePets";
// import DeletePets from "./pages/DeletePets";
import UpdatePetDetails from "./pages/UpdatePetDetails";
// import UpdatePets from "./pages/UpdatePets";
import AddHomeSection from "./pages/home/AddHomeSection";
import EditHomeSection from "./pages/home/EditHomeSection";
import HomeSectionList from "./pages/home/HomeSectionList";
import AddAboutUsSection from "./pages/about/AddAboutUsSection";
import EditAboutUsSection from "./pages/about/EditAboutUsSection";
import AboutUsSectionList from "./pages/about/AboutUsSectionList";
import AddOurSponsorSection from "./pages/sponsor/AddOurSponsorSection";
import OurSponsorSectionList from "./pages/sponsor/OurSponsorSectionList";
import EditOurSponsorSection from "./pages/sponsor/EditOurSponsorSection";
import ManageAdoptionSections from "./pages/pet/adoption/ManageAdoptionSections";
import AddAdoptionSection from "./pages/pet/adoption/AddAdoptionSection";
import AddDonationSection from "./pages/donation/AddDonationSection";
import DonationSectionList from "./pages/donation/DonationSectionList";
import EditDonationSection  from "./pages/donation/EditDonationSection";

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
        {/* Add new routes for about us sections */}
        <Route
          path="/aboutus-sections"
          element={
            <ProtectedRoute>
              <AboutUsSectionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-aboutus-section"
          element={
            <ProtectedRoute>
              <AddAboutUsSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-aboutus-section/:id"
          element={
            <ProtectedRoute>
              <EditAboutUsSection />
            </ProtectedRoute>
          }
        />
        {/* Add new routes for our sponsor sections */}
        <Route
          path="/add-sponsor-section"
          element={
            <ProtectedRoute>
              <AddOurSponsorSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/our-sponsor-sections"
          element={
            <ProtectedRoute>
              <OurSponsorSectionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-sponsor-section/:sectionType/:id"
          element={
            <ProtectedRoute>
              <EditOurSponsorSection />
            </ProtectedRoute>
          }
        />
        {/* Route for Adoptable Pet Editor - uploading images for a pet*/}
        <Route
          path="/adoptable-pet-editor/:petId"
          element={
            <ProtectedRoute>
              <AdoptablePetEditor />
            </ProtectedRoute>
          }
        />
        {/* Adoption Management */}
        <Route
          path="/manage-adoption"
          element={
            <ProtectedRoute>
              <ManageAdoptionSections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-adoption"
          element={
            <ProtectedRoute>
              <AddAdoptionSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donation-sections"
          element={
            <ProtectedRoute>
              <DonationSectionList />
            </ProtectedRoute>
          }
        />
        
      <Route
      path="/edit-donation-section/:id"
      element={
        <ProtectedRoute>
          <EditDonationSection />
        </ProtectedRoute>
      }
      />

        <Route
          path="/add-donation-section"
          element={
            <ProtectedRoute>
              <AddDonationSection />
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
