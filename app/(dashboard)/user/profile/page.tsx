import { getUser } from "@/config/users";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/user-starts";
import { redirect } from "next/navigation";
import UserProfile from "../dashboard/components/profile";
export const dynamic = "force-dynamic";
export default async function page() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/");
  }
  const userData = await getUser(user?.email);
  const userStarts = await getUserStats(user?.id);

  return <UserProfile user={userData?.user} userStart={userStarts} />;
}
