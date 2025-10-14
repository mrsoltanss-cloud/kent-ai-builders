import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth/signin" }, // where unauth users go for protected routes
});

export const config = {
  matcher: [
    "/my/:path*",
    "/trade/profile",
    "/trade/leads/my",
    "/trade/jobs/:path*",
  ],
};
