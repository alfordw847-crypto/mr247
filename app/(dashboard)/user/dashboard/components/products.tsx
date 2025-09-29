import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users } from "lucide-react";
import GeneralPackageTab from "../general-package-card";
import CompactPackage from "./contrubuted-package";

export default async function Products() {
  return (
    <div className="container mb-24">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Tabs */}
      <Tabs defaultValue="top" className="w-full">
        <TabsList
          className="
          grid sm:grid-cols-2 w-full max-w-md mx-auto h-auto gap-2 mb-8
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
        <GeneralPackageTab />
        {/* Contributed Products */}
        <CompactPackage />
      </Tabs>
    </div>
  );
}
