/**
 * Shim for legacy imports that expect ./lib/auth/options.ts
 * We now centralize in src/lib/authOptions.ts
 */
export { authOptions } from "@/lib/authOptions";
import { authOptions as _authOptions } from "@/lib/authOptions";
export default _authOptions;
