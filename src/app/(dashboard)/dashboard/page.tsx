import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">
        Signed in as {session?.user?.email}
      </p>
      {/* TODO: add dashboard content */}
    </div>
  );
}
