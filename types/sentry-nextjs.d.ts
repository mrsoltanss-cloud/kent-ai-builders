declare module '@sentry/nextjs' {
  export function init(...args: any[]): void;
  export const captureException: (...args: any[]) => void;
  export const captureMessage: (...args: any[]) => void;
  export const withSentryConfig: (...args: any[]) => any;
  const _default: any;
  export default _default;
}
