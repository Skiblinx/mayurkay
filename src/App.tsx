
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
import NotFound from "./pages/NotFound";

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
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/categories/new" element={<AdminCategoryFormPage />} />
          <Route path="/admin/categories/edit/:id" element={<AdminCategoryFormPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
