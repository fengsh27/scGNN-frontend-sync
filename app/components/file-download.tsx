
import { useEffect, useState } from "react";
import Locale from "../locales";
import { useChatStore } from "../store";
import DeleteIcon from "../icons/delete.svg";
import DownloadIcon from "../icons/download.svg";
import JobIcon from "../icons/job.svg";
import TasksIcon from "../icons/tasks.svg";
import { List, ListItem, Modal, showConfirm } from "./ui-lib";
import styles from "./file-download.module.scss"
import { IconButton } from "./button";

interface JobFile {
  filename: string;
  filesize?: number;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileDownloadModal (
  { onClose, onDownloaded }: {
    onClose: () => void,
    onDownloaded: (message: string) => void
  }
) {
  const chatStore = useChatStore.getState();
  const session = useChatStore().currentSession();
  const jobId = session.jobId !== undefined ? (`${session.jobId}`) : undefined;
  const [jobFiles, setJobFiles] = useState<Array<JobFile>>([]);
  async function onDownload(filename: string) {
    try {
      await chatStore.requestDownloadJobFile(filename);
    } catch (e: any) {
      console.error(e);
    }
  }
  async function onDownloadTaskResultFile (
    taskId: string, filename: string
  ) {
    try {
      await chatStore.requestDownloadTaskResultFile(taskId, filename);
    } catch(e: any) {
      console.error(e);
    }
  }
  async function onRemoveFile(filename: string) {
    const theId = jobId??"";
    if (theId.length === 0 || filename.length === 0) {
      return;
    }
    if (!await showConfirm(`Are you sure to remove the file?`)) {
      return;
    }
    try {
      await chatStore.requestRemoveJobFile(filename);
      await updateJobFiles();
    } catch (e: any) {
      console.error(e);
    }
  }

  async function updateJobFiles() {
    if (jobId && jobId.length > 0) {
      const res = await chatStore.requestJobFiles();
      try {
        const {job_files: files} = await res?.json();
        setJobFiles(files as Array<JobFile>);
        console.dir(files);
      } catch (e: any) {
        console.log(e);
      }
    }
  }
  useEffect(() => {
    updateJobFiles();
  }, []);

  const TasksFiles = () => {
    const tasksDict = session.taskIds;
    const tasks: Array<any> = [];
    Object.keys(tasksDict).forEach(id => {
      if (tasksDict[id] !== null && tasksDict[id].length > 0) {
        tasks.push({id, files: tasksDict[id]})
      }
    });
    return (tasks.length === 0) ? (<div />) : (
      <>
      {tasks.map((task) => (
        <div className={styles['task-container']}>
          <div className={styles['task-title']}>{`task ${task.id}`}</div>
          <List>{task.files.map((f: string) => (
            <ListItem
              title={f}
              key={`TaskFile-${f}`}
            >
              <div>
                <IconButton
                  text="Download"
                  icon={<DownloadIcon />}
                  onClick={() => (onDownloadTaskResultFile(task.id, f))}
                />
              </div>
            </ListItem>
          ))}</List>
        </div>
      ))}
      </>
    )
  };

  return (
    <div className="modal-mask">
      <Modal
        title="Job Files"
        onClose={onClose}
      >

        <div className={styles['container']}>
          <div className={styles['item-container']}>
            <div className={styles['item-container-title']}>
              <div className={styles['title-icon']}><JobIcon /></div>
              <div className={styles['title-label']}>Job Files</div>
            </div>
            <div className={styles['item-container-body']}>
              {jobFiles === undefined || jobFiles.length === 0 ? (
                <div>No job files found</div>
              ): (
                <List>
                  { jobFiles.map((jobFile: JobFile) => (
                    <ListItem
                      title={jobFile.filename}
                      subTitle={`size: ${formatFileSize(jobFile.filesize??0)}`}
                      key={`JobFile-${jobFile.filename}`}
                    >
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <IconButton
                          text="Delete"
                          icon={<DeleteIcon />}
                          onClick={async () => (onRemoveFile(jobFile.filename))}
                        />
                        <IconButton
                          text="Download"
                          icon={<DownloadIcon />}
                          onClick={() => (onDownload(jobFile.filename))}
                        />
                    </div>
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          </div>
          <div className={styles['item-container']}>
            <div className={styles['item-container-title']}>
              <div className={styles['title-icon']}><TasksIcon /></div>
              <div className={styles['title-label']}>Tasks Files</div>
            </div>
            <div className={styles['item-container-body']}>
              <TasksFiles />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

