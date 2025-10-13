import TrustBoxV2 from "./TrustBoxV2.client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-4 text-xl font-semibold text-gray-800">Trust box — Preview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2" />
        <TrustBoxV2 />
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Preview only. Your main success page is unchanged.
      </p>
    </div>
  );
}
