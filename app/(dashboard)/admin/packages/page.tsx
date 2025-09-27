import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Pagination from "@/components/PaginationComponents";
import { allPackagesPage } from "@/config/packges";
import CreatePackageDialog from "./components/add-package";
import PackageList from "./components/package-list";
export const dynamic = "force-dynamic";
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = (searchParams?.page as string) || "1";
  const limit = (searchParams?.limit as string) || "10";
  const { data: products } = await allPackagesPage({ page, limit });
  const { pagination } = products || {};
  return (
    <div className="border p-4 bg-card rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-medium  bg-card  ">
          All Packages
        </h1>
        <CreatePackageDialog />
      </div>
      <hr className="pb-4" />
      <ScrollArea className="pb-4">
        <PackageList products={products?.data} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pagination && pagination?.total > pagination?.limit && (
        <nav className="mt-24" aria-label="Pagination navigation">
          <Pagination
            currentPage={pagination?.page}
            totalPages={pagination?.totalPages}
          />
        </nav>
      )}
    </div>
  );
}
