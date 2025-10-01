// src/components/PrivateRoute.tsx (YANGI VA TO'G'RI VERSION)

import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // <-- YANGI IMPORT

interface PrivateRouteProps {
  children: ReactNode;
  role: "ADMIN" | "CUSTOMER";
}

// Tokenning ichidagi ma'lumotlar uchun tip
interface JwtPayload {
  id: number;
  role: string;
  exp: number;
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const token = localStorage.getItem("token");

  // Agar token umuman bo'lmasa, login sahifasiga
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Tokenni "ochib" o'qiymiz
    const decodedToken = jwtDecode<JwtPayload>(token);
    const userRole = decodedToken.role.toUpperCase();

    // Tokenning muddati o'tganini tekshiramiz
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // Muddati o'tgan tokenni o'chiramiz
      return <Navigate to="/login" replace />;
    }

    // Agar kerakli rol mos kelmasa, bosh sahifaga
    if (role && userRole !== role) {
      return <Navigate to="/" replace />;
    }

    // Agar hamma narsa to'g'ri bo'lsa, sahifani ochamiz
    return <>{children}</>;

  } catch (error) {
    // Agar token yaroqsiz bo'lsa (buzilgan bo'lsa), login sahifasiga
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}