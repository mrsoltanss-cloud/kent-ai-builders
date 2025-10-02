export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/quote",
    "/quote/:path*",
    "/api/aiQuote",
    "/api/aiQuote/:path*",
  ],
};
