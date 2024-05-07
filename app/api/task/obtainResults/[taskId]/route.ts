import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { SCGNNServerResponse } from "@/app/api/common";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

async function requestTaskResults(
  taskId: string
) {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;
  const dt = new Date();
  console.log(`[Debug] ${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}  - task id: ${taskId}`);

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const path = scGNNPath.QueryResults;
  const fetchUrl = `${baseUrl}/${path}/${taskId}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 1 * 60 * 1000);
  const fetchOptions: RequestInit = {
    method: "POST",
  };
  try {
    const res = await fetch(fetchUrl, fetchOptions);
    const jsonBody = await res.json();
    if (jsonBody.results) {
      return NextResponse.json(jsonBody);
    } else if (jsonBody.error) {
      return NextResponse.json(jsonBody);
    } else {
      return NextResponse.json({error: "Unkonwn error occurred in server."})
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handle(_request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const taskId = params.taskId;
    
    const res = await requestTaskResults(taskId);
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}

export const POST = handle;
