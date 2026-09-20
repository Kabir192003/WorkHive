import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Chrome from './components/Chrome';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import WhyWorkHive from './pages/WhyWorkHive';
import ForEmployers from './pages/ForEmployers';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Search from './pages/Search';
import JobDetail from './pages/JobDetail';
import Connections from './pages/Connections';
import Company from './pages/Company';
import Ratings from './pages/Ratings';
import Salaries from './pages/Salaries';
import Cost from './pages/Cost';
import Relocation from './pages/Relocation';
import Insights from './pages/Insights';
import Messages from './pages/Messages';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Apply from './pages/Apply';
import Mentorship from './pages/Mentorship';
import Alumni from './pages/Alumni';
import Internships from './pages/Internships';
import Events from './pages/Events';
import About from './pages/About';

const App = () => (
    <AuthProvider>
    <ToastProvider>
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute><Chrome /></ProtectedRoute>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/why-work-hive" element={<WhyWorkHive />} />
                    <Route path="/for-employers" element={<ForEmployers />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/job/:jobId" element={<JobDetail />} />
                    <Route path="/connections" element={<Connections />} />
                    <Route path="/company/:slug" element={<Company />} />
                    <Route path="/ratings" element={<Ratings />} />
                    <Route path="/salaries" element={<Salaries />} />
                    <Route path="/cost" element={<Cost />} />
                    <Route path="/relocation" element={<Relocation />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/apply/:jobId" element={<Apply />} />
                    <Route path="/mentorship" element={<Mentorship />} />
                    <Route path="/alumni" element={<Alumni />} />
                    <Route path="/internships" element={<Internships />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/about" element={<About />} />
                </Route>
            </Routes>
        </HashRouter>
    </ToastProvider>
    </AuthProvider>
);

export default App;
