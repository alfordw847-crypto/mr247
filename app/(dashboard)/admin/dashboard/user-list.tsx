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
import { User } from "@prisma/client";

const UserList = ({ users }: { users?: User[] }) => {
  if (!users || users.length === 0) {
    return <NotFound title="Users not found" />;
  }

  return (
    <Table className="min-w-full whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">User Name</TableHead>
          <TableHead>Total Earn</TableHead>
          <TableHead>Total Withdraw</TableHead>
          <TableHead>Total Invest</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users?.map((user) => (
          <TableRow key={user?.id} className="hover:bg-muted">
            <TableCell className="font-medium text-card-foreground/80">
              <div className="flex gap-3 items-center">
                <Avatar className="rounded-full">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-base text-card-foreground">
                  {user.name}
                </span>
              </div>
            </TableCell>

            <TableCell>{user?.totalEarnings}</TableCell>
            <TableCell>{user?.totalWithdrawals}</TableCell>
            <TableCell>{user?.totalDeposits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
