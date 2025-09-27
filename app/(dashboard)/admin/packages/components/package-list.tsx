"use client";

import { NotFound } from "@/components/not-found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "@prisma/client";
import EditPackageDialog from "./edit-package-dialog";

const PackageList = ({ products }: { products?: Package[] }) => {
  if (!products || products.length === 0) {
    return <NotFound title="Packages not found" />;
  }

  return (
    <Table className="min-w-full whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Product Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total Earn</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products?.map((product) => (
          <TableRow key={product.id} className="hover:bg-muted">
            <TableCell className="font-medium text-card-foreground/80">
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full">
                  <AvatarImage src={product?.image || ""} />
                  <AvatarFallback>{product?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-base text-card-foreground">
                  {product.name}
                </span>
              </div>
            </TableCell>

            <TableCell>{product.price}</TableCell>
            <TableCell>{product?.totalEarnings}</TableCell>

            <TableCell className="flex gap-2">
              <EditPackageDialog pkg={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PackageList;
