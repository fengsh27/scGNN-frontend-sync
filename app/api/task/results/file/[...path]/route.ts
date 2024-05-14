import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { SCGNNServerResponse } from "@/app/api/common";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

async function requestTaskResultFile(
  taskId: string,
  filename: string,
  example_mode: boolean,
) {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;
  const dt = new Date();
  console.log(`[Debug] ${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}  - task id: ${taskId}, filename: ${filename}`);

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const path = scGNNPath.ResultFile;
  const fetchUrl = `${baseUrl}/${path}/${taskId}/${filename}?example_mode=${example_mode}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 1 * 60 * 1000);
  const fetchOptions: RequestInit = {
    method: "GET",
  };
  try {
    const res = await fetch(fetchUrl, fetchOptions);
    const blob = await res.blob();
    const type = res.headers.get("Content-Type") ?? "application/octet-stream";
    if (blob) {
      return new NextResponse(blob, {status: 200, statusText: "OK", headers: {
        "Content-Type": type,
      }})
    } else {
      return NextResponse.json({error: "Unkonwn error occurred in server."})
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function handleGetFile(request: NextRequest, { params }: { params: {path: any} }) {
  try {
    const taskId = params.path[0];
    const filename = params.path[1];

    const url = new URL(request.url)

  const example_mode = url.searchParams.get("example_mode") === "true";
    
    console.log(`${taskId} - ${filename}`)
    const res = await requestTaskResultFile(taskId, filename, example_mode);    
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handleGetFile;
