import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ListingDetail from "../pages/ListingDetail";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import AddListing from "../pages/AddListing";
import EditListing from "../pages/EditListing";
import HostDashboard from "../pages/HostDashboard";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="profile" element={<Profile />} />
        {/* Protected routes */}
        <Route
          path="add-listing"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <AddListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-listing/:id"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <EditListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <HostDashboard />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
