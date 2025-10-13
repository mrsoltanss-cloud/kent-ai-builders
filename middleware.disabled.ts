import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/api/auth/signin" },
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname || "/";
      // Only guard /trade/**
      if (!path.startsWith("/trade")) return true;

      // Require authenticated user with appropriate role
      const role = (token as any)?.role as string | undefined;
      if (!token) return false;
      if (role === "BUILDER" || role === "ADMIN") return true;

      // Block all others (e.g., CUSTOMER)
      return false;
    },
  },
});

// Next.js matcher for the protected area
export const config = {
  matcher: ["/trade/:path*"],
};
