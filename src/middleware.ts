export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/quote", "/quote/:path*"],
};
