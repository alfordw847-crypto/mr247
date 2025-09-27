import AddBannerDialog from "./components/add-banner";
import EditBannerDialog from "./components/edit-dialog";
export const dynamic = "force-dynamic";
export default async function page() {
  const bannersResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/banners`
  );
  const banners = await bannersResponse.json();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
        <AddBannerDialog />
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners?.data?.length === 0 ? (
          <p className="text-gray-500 col-span-full">No banners found.</p>
        ) : (
          banners?.data?.map((banner: any) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner Image */}
              {banner.url && (
                <img
                  src={banner.url}
                  alt={banner.name}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Banner Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {banner.name || "Unnamed Banner"}
                </h2>
                <EditBannerDialog banner={banner} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
