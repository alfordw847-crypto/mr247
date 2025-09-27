export interface DoctorPageProps {
  params: { doctorId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

import { Prisma } from "@prisma/client";

export type OrderWithPackage = Prisma.OrderGetPayload<{
  include: { package: true };
}>;

// or with user too
export type OrderWithPackageAndUser = Prisma.OrderGetPayload<{
  include: { package: true; user: true };
}>;
