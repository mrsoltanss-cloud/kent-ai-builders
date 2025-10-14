"use client";
type AnyMod = Record<string, any>;
export function mount(mod: AnyMod) {
  const Comp =
    mod.default ??
    mod.Account ??
    mod.AccountPage ??
    mod.AccountStep ??
    mod.OnboardingAccount ??
    (Object.values(mod).find((v) => typeof v === "function") as any);

  return function OnboardingAccountMounted() {
    if (!Comp) {
      return (
        <main className="p-6">
          <h1>Onboarding Account</h1>
          <p className="text-sm text-red-600">
            Could not resolve a component from the selected module.
          </p>
        </main>
      );
    }
    return <Comp />;
  };
}
