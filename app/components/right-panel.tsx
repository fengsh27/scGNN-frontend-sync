import dynamic from "next/dynamic";

import { useLogsStore } from "../store/logs";
import ClearIcon from "../icons/clear.svg";
import LoadingIcon from "../icons/three-dots.svg";
import { useTaskListStore } from "../store/tasklist";

import styles from "./right-panel.module.scss";
import { IconButton } from "./button";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <LoadingIcon />,
});

export function RightPanel(
  {className}: {className?: string}
) {

  const taskListStore = useTaskListStore();
  const tasks = taskListStore.getTaskList().tasks;

  const logsStore = useLogsStore();
  function onClearLogs() {
    logsStore.setLogs("");
  }
  const logs = logsStore.getLogs();
  const taskId = logs.taskId;
  const logsContent = logs.content;
  const display_logs = taskId && logsContent.length > 0 ? `***task ${taskId}*** \n ${logsContent}` : "";

  let taskStatusContent = "";
  const sortedTasks = tasks.sort((a: any, b: any) => (a.taskId - b.taskId))
  sortedTasks.forEach((task) => {
    taskStatusContent += `* task ${task.taskId} - ${task.status} \n`
  });
  return(
    <div className={`${styles["right-panel"]} ${className}`}>
      <div className={styles['panel-item']}>
        <div className={styles["panel-item-header"]}>
        <div className={styles["panel-item-title"]}>
          Tasks: 
        </div>
        </div>
        <div id="task-window" className={styles["panel-item-body"]}>
        <div className={styles["logs-area"]} > 
          <Markdown
            content={taskStatusContent}
          ></Markdown>
        </div>
        </div>
      </div>
      <div id="logs-window" className={styles['panel-item']}>
        <div className={styles["panel-item-header"]}>
        <div className={styles["panel-item-title"]}>
          Logs: 
        </div>
        <div className={styles["panel-item-clear"]}>
          <IconButton
            className={styles["clear-button"]}
            text="Clear"
            icon={<ClearIcon />}
            onClick={onClearLogs}
          ></IconButton>
        </div>
        </div>
        <div className={styles["panel-item-body"]}>
        <div className={styles["logs-area"]} > 
          <Markdown
            content={display_logs}
          ></Markdown>
        </div>
        </div>
      </div>
    </div>
  );
}
