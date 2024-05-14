import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

function get_baseurl(): string {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  return baseUrl;
}


async function handlePost(request: NextRequest) {
  const baseUrl = get_baseurl();
  const path = scGNNPath.JobId;
  // const jsonObj = await request.json();
  // const example_mode = jsonObj.example_mode ?? false;
  const fetchUrl = `${baseUrl}/${path}`;
  try {
    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: request.body, // JSON.stringify({example_mode}),
      // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
      redirect: "manual",
      // @ts-ignore
      duplex: "half",
    });
    const jsonBody = await res.json();
    return NextResponse.json({jobId: jsonBody.job_id});
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}


export const POST = handlePost;