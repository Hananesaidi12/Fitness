import React from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contacts from './pages/Contacts';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashbord from './pages/dashbord';
import DashbordLite from './pages/dashbordLite';
import Workouts from './pages/workouts';
import YogaPage from './pages/YogaPage';
import Pompes from './pages/Pompes';
import Cardio from './pages/Cardio';
import SquatPage from './pages/SquatPage';
import Stretching from './pages/stretching';
import StrenghtTraining from './pages/StrengthTraining';
import Meditation from './pages/meditation'
import Nutrition from './pages/Nutrition';
import Progress from './pages/progress';
import Settings from './pages/settings';
import Logout from './pages/logout';
import Profile from './pages/Profile';
import Community from './pages/community';
import UsersPage from "./pages/admin/UsersPage";

import SettingsPage from "./pages/admin/SettingsPage";
import DashboardAdmin from "./pages/admin/dashboard";
import Notifications from "./pages/admin/Notifications";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contacts />} />
      <Route path="/sigin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashbord" element={<Dashbord />} />
      <Route path="/dashbordLite" element={<DashbordLite />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/workouts/yoga/:exerciseId" element={<YogaPage />} />
      <Route path="/workouts/squats/:exerciseId" element={<SquatPage />} />
      <Route path="/workouts/Pompes/:exerciseId" element={<Pompes />} />
      <Route path="/workouts/cardio/:exerciseId" element={<Cardio />} />
      <Route path="/workouts/strength/:exerciseId" element={<StrenghtTraining/>} />
      <Route path="/workouts/stretching/:exerciseId" element={<Stretching />} />
      <Route path="/workouts/meditation/:exerciseId" element={<Meditation />} />      {/* À placer tout à la fin pour ne pas intercepter les autres */}
      <Route path="/workouts/:catalogueId" element={<YogaPage />} />
      <Route path="/Nutrition" element={<Nutrition />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/community" element={<Community />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/users" element={<UsersPage />} />

      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/notifications" element={<Notifications />} />

      

      
    </Routes>
 
  );
}

export default App;
