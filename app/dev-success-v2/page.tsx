import PreviewSuccessV2 from "./preview-success-v2.client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PreviewSuccessV2
        reference="BK-TEST123"
        service="Loft Conversion"
        town="Maidstone"
        summary="Detached, rear dormer considered"
      />
      <p className="mt-6 text-sm text-gray-500">
        Preview only. Your main success page is unchanged.
      </p>
    </div>
  );
}
