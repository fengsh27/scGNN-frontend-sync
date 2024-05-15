import { ApiPath, SAMPLE_DATA_FILENAME } from "@/app/constant";
import { getFetchUrl } from "@/app/utils/utils";

function get_json_header(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-requested-with": "XMLHttpRequest",
  };
}

export const requestUploadFile = async (
  jobId: string,
  file: File,
  dataType: string,
  demoMode: boolean,
  subPath: string,
) => {
  const FILEUPLOAD = ApiPath.JobFile;
  let uploadPath = getFetchUrl(subPath, FILEUPLOAD);
  const data = new FormData();
  data.set('file', file);
  data.set('jobId', jobId);
  data.set("dataType", dataType);
  data.set("example_mode", demoMode.toString())
  const res = await fetch(uploadPath, {
    method: "POST",
    body: data,
  });
  return res;
}

export const requestLogs = async (
  taskId: string, demoMode: boolean, subPath: string,
) => {
  const LOGS = ApiPath.Logs;
  let fetchPath = getFetchUrl(subPath, LOGS as string);
  if (!fetchPath.endsWith('/')) {
    fetchPath += "/";
  }
  fetchPath += taskId;
  const response = await fetch(fetchPath, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({example_mode: demoMode})
  });
  return response;
}

export const requestJobFiles = async (jobId: string, demoMode: boolean, subPath: string) => {
  const FILEURL = getFetchUrl(subPath, ApiPath.JobFiles + '/' + jobId);
  try {
    const res = await fetch(FILEURL, {
      method: "POST",     
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({example_mode: demoMode}) 
    })
    return res;
  } catch (e: any) {
    console.log(e);
  }
}

export const requestDownloadJobFile = async (
  jobId: string, filename: string, demoMode: boolean, subPath: string
) => {
  const fetchUrl = getFetchUrl(subPath, ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
    example_mode: demoMode.toString(),
  }));
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
}

export const requestDownloadSampleDataFile = async (demoMode: boolean, subPath: string) => {
  const fetchUrl = getFetchUrl(subPath, ApiPath.SampleDataFile + '?' + new URLSearchParams({
    example_mode: demoMode.toString(),
  }));
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = SAMPLE_DATA_FILENAME;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
};

export const requestDownloadTaskResultFile = async (
  taskId: string, filename: string, demoMode: boolean, subPath: string,
) => {
  const fetchUrl = getFetchUrl(
    subPath, 
    `${ApiPath.TaskResultFile}/${taskId}/${filename}?example_mode=${demoMode}`
  );
  try {
    const res = await fetch(fetchUrl, {method: "GET"});
    const data = await res.blob();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error(e);
  }
};

export const requestRemoveJobFile = async (
  jobId: string, filename: string, demoMode: boolean, subPath: string,
) => {
  const fetchUrl = getFetchUrl(subPath, ApiPath.JobFile + '?' + new URLSearchParams({
    jobId,
    filename,
  }));
  try {
    const res = await fetch(fetchUrl, {
      method: "DELETE", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({example_mode: demoMode})
    });
  } catch (e: any) {
    console.error(e);
  }  
}

export const requestJobId = async(demoMode: boolean, subPath: string) => {
  const fetchUrl = getFetchUrl(subPath, ApiPath.JobId);
  try {
    const res = await fetch(fetchUrl, {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({example_mode: demoMode})
    });
    const jsonBody = await res.json();
    const jobId = jsonBody.jobId;
    return jobId;
  } catch( e: any) {
    console.error(e);
  }
}

export const requestTaskResults = async (taskId: string, demoMode: boolean, subPath: string) => {
  const RESULTS = ApiPath.ObtainResults;
  let fetchPath = getFetchUrl(subPath, RESULTS as string);
  if (!fetchPath.endsWith("/")) {
    fetchPath += "/";
  }
  fetchPath += taskId;
  const response = await fetch (fetchPath, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({example_mode: demoMode})
  });
  if (response.ok) {
    const jsonObj = await response.json();
    return jsonObj;
  }
  return {results: []};
};

export const requestJobTasksStatus = async (jobId: string, demoMode: boolean, subPath: string) => {
  const JOBTASKSSTATUS = getFetchUrl(subPath, ApiPath.ObtainStatus);
  let fetchPath = JOBTASKSSTATUS as string;
  if (!fetchPath.endsWith("/")) {
    fetchPath += "/";
  }
  fetchPath += jobId;
  const theJsonObj = JSON.stringify({example_mode: demoMode});
  console.log(theJsonObj);

  const response = await fetch (fetchPath, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: theJsonObj,
  });
  if (response.ok) {
    const jsonObj = await response.json();
    return jsonObj;
  }
  return {results: []};
};
