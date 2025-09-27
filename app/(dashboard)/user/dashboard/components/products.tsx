import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { Star, Users } from "lucide-react";
import GeneralPackageTab from "../general-package-card";
import CompactPackage from "./contrubuted-package";

export default async function Products() {
  const user = await getCurrentUser();

  const packagesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/packages`
  );
  const data = await packagesResponse.json();
  const orderResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders?userId=${user?.id}`
  );
  const orderData = await orderResponse.json();

  return (
    <div className="max-w-6xl mx-auto p-6 mb-24">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Tabs */}
      <Tabs defaultValue="top" className="w-full">
        <TabsList
          className="
          grid grid-cols-2 w-full max-w-md mx-auto mb-8
          rounded-2xl p-1
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          shadow-lg
        "
        >
          <TabsTrigger
            value="top"
            className="
            flex items-center justify-center gap-2
            font-semibold px-4 py-2 rounded-xl
            text-white dark:text-gray-200
            data-[state=active]:bg-white data-[state=active]:text-indigo-600
            dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-indigo-400
            transition-all duration-200
          "
          >
            <Star className="w-4 h-4" />
            Top Products
          </TabsTrigger>

          <TabsTrigger
            value="contributed"
            className="
            flex items-center justify-center gap-2
            font-semibold px-4 py-2 rounded-xl
            text-white dark:text-gray-200
            data-[state=active]:bg-white data-[state=active]:text-purple-600
            dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-purple-400
            transition-all duration-200
          "
          >
            <Users className="w-4 h-4" />
            Contributed
          </TabsTrigger>
        </TabsList>
        {/* Top Products */}
        <GeneralPackageTab packages={data?.data?.data} />
        {/* Contributed Products */}
        <CompactPackage pcks={orderData?.data?.data} />
      </Tabs>
    </div>
  );
}
