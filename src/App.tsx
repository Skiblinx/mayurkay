
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminCategoryFormPage from "./pages/AdminCategoryFormPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminHeroSlidesPage from "./pages/AdminHeroSlidesPage";
import AdminHeroSlideFormPage from "./pages/AdminHeroSlideFormPage";
import AdminContentPage from "./pages/AdminContentPage";
import AdminContentFormPage from "./pages/AdminContentFormPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserFormPage from "./pages/AdminUserFormPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
          <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />

          {/* Admin routes with AuthProvider */}
          <Route path="/admin/login" element={
            <AdminAuthProvider>
              <AdminLoginPage />
            </AdminAuthProvider>
          } />
          <Route path="/admin/*" element={
            <AdminAuthProvider>
              <Routes>
                <Route path="/" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="/products" element={
                  <ProtectedAdminRoute>
                    <AdminProductsPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/products/new" element={
                  <ProtectedAdminRoute>
                    <AdminProductFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/products/edit/:id" element={
                  <ProtectedAdminRoute>
                    <AdminProductFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/categories" element={
                  <ProtectedAdminRoute>
                    <AdminCategoriesPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/categories/new" element={
                  <ProtectedAdminRoute>
                    <AdminCategoryFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/categories/edit/:id" element={
                  <ProtectedAdminRoute>
                    <AdminCategoryFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedAdminRoute>
                    <AdminOrdersPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/hero-slides" element={
                  <ProtectedAdminRoute>
                    <AdminHeroSlidesPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/hero-slides/new" element={
                  <ProtectedAdminRoute>
                    <AdminHeroSlideFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/hero-slides/edit/:id" element={
                  <ProtectedAdminRoute>
                    <AdminHeroSlideFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/content" element={
                  <ProtectedAdminRoute>
                    <AdminContentPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/content/new" element={
                  <ProtectedAdminRoute>
                    <AdminContentFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/content/edit/:id" element={
                  <ProtectedAdminRoute>
                    <AdminContentFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/users" element={
                  <ProtectedAdminRoute>
                    <AdminUsersPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/users/new" element={
                  <ProtectedAdminRoute>
                    <AdminUserFormPage />
                  </ProtectedAdminRoute>
                } />
                <Route path="/users/:id/edit" element={
                  <ProtectedAdminRoute>
                    <AdminUserFormPage />
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </AdminAuthProvider>
          } />

          {/* Catch all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
