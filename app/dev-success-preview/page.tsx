import BrixelSuccessPanel from "../../src/components/brixel/BrixelSuccessPanel";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Brixel Success Panel — Preview</h1>
      <BrixelSuccessPanel
        reference="BK-Y5FIRBTY"
        service="Loft Conversion"
        town="Maidstone"
        summary="Detached house, rear dormer considered, budget range £55-70k."
      />
      <p className="mt-6 text-sm text-gray-500">
        Preview route only. Your existing success page is unchanged.
      </p>
    </div>
  );
}
