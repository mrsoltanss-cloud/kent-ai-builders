/**
 * Temporary minimal authOptions stub to satisfy imports during stabilization.
 * Replace with your real NextAuth options when wiring auth.
 */
export const authOptions: any = {
  session: { strategy: "jwt" },
  providers: [],
};
export default authOptions;
