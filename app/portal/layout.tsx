import { getUser } from "@/lib/dal";

export default async function Layout({
  children,
  admin,
  instructor,
}: {
  children: React.ReactNode
  admin: React.ReactNode
  instructor: React.ReactNode
}) {

    const user = await getUser();

    switch (user?.role) {
        case 1:
            return admin;
        case 2:
            return instructor;
        default:
            return children;
    }
}