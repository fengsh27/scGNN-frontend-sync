import { Analytics } from "@vercel/analytics/react";
import { createServerComponentClient, User } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

const serverConfig = getServerSideConfig();

export default async function App() {
  // const supabase = createServerComponentClient({cookies});
  // const {data: {user}} = await supabase.auth.getUser();
  const user = "unknown";
  return (
    <>
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
