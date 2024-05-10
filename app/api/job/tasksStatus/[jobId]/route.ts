import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";
import { ERROR_INVALID_INPUT, ERROR_OK, LOCAL_BASE_URL, scGNNPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

const handlePOST = async (request: NextRequest, {params}: { params: { jobId: string } }) => {
  try {
    const jobId = params.jobId;  
    
    if (jobId.length === 0) {
      return NextResponse.json({code: ERROR_INVALID_INPUT, });
    }
    const filePath = scGNNPath.JobTasksStatus;
    let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;

    if (!baseUrl.startsWith("http")) {
      baseUrl = `http://${baseUrl}`;
    }

    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    const fetchUrl = `${baseUrl}/${filePath}/${jobId}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10 * 60 * 1000);
    const res = await fetch(fetchUrl, {
      method: "POST",
      signal: controller.signal
    })
    const content = await res.json();
    return NextResponse.json(content);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(prettyObject(e));
  }
}

export const POST = handlePOST;