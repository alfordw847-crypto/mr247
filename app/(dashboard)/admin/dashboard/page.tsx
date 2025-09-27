import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Pagination from "@/components/PaginationComponents";
import { getAllUsers } from "@/config/users";
import UserList from "./user-list";
export const dynamic = "force-dynamic";
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = (searchParams?.page as string) || "1";
  const limit = (searchParams?.limit as string) || "10";
  const data = await getAllUsers({ page, limit });
  const { pagination } = data?.meta || {};

  return (
    <div className="border p-4 bg-card rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-medium  bg-card  ">All Users</h1>
      </div>
      <hr className="pb-4" />
      <ScrollArea className="pb-4">
        <UserList users={data?.data} />
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
