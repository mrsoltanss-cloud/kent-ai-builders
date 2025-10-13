/**
 * Temporary minimal NextAuth options to satisfy imports during stabilization.
 * Replace with your real providers/callbacks later.
 */
export const authOptions: any = {
  session: { strategy: "jwt" },
  providers: [],
};
export default authOptions;
