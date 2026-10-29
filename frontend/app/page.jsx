import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const instant = false;

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let response;

  try {
    response = await fetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to connect to authentication API:", error);
    throw new Error("Could not connect to the authentication server");
  }

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Authentication request failed: ${response.status}`);
  }

  const data = await response.json();
  const user = data.user;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Welcome, {user.name}!
        </h1>

        <p className="text-gray-600">
          You are logged in.
        </p>
      </div>
    </main>
  );
}