import UpdateDatabase from "../components/UpdateDatabase";
import { auth, currentUser } from "@clerk/nextjs";
import { createUser } from "@/lib/supabaseClient";

export default async function Onboarding() {
  const { userId, getToken } = auth();
  const user = await currentUser();
  const token = await getToken({ template: "supabase" });

  if (token && userId && user?.firstName) {
    try {
      const dbUser = await createUser(
        token,
        userId,
        user?.id,
        user?.firstName,
        user?.emailAddresses[0].emailAddress,
        user?.profileImageUrl
      );
      console.log("create user status: ", dbUser);
    } catch (error) {
      console.error("error on create user: ", error);
    }
  }

  return (
    <section>
      <div>
        <UpdateDatabase />
      </div>
    </section>
  );
}
