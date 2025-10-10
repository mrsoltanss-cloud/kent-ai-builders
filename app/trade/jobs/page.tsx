import SavedSearches from "./SavedSearches";
import FiltersBar from "./FiltersBar";
import ClientJobList from "./ClientJobList";

export default async function JobsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-2">Jobs</h1>
      <p className="text-sm text-gray-600 mb-4">
        Save a search, share it, or tweak filters — clicking a job opens the details to bid.
      </p>
      <SavedSearches />
      <FiltersBar />
      <ClientJobList />
    </div>
  );
}
