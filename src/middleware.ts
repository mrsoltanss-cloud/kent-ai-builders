export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/quote",
    "/quote/:path*",
    // add more protected areas as needed:
    // "/homeowner/:path*",
    // "/trade/:path*",
  ],
};
