import { createPersistStore } from "../utils/store";
import { StoreKey } from "../constant";

import { useChatStore } from "./chat";

export interface TaskData {
  taskId: string;
  jobId: string;
  status: string;
  // content: string;
}

export interface TaskListData {
  tasks: Array<TaskData>;
}

export const createEmptyTaskList = (): TaskListData => ({
  tasks: []
});

export const DEFAULT_TASKLIST_STATE = {
  taskList: createEmptyTaskList(),
}
export type TaskListState = typeof DEFAULT_TASKLIST_STATE;


export const useTaskListStore = createPersistStore(
  { ...DEFAULT_TASKLIST_STATE },
  (set, get) => {

    function getJobTasksStatus() {
      const chatStore = useChatStore.getState();
      const session = chatStore.currentSession();
      if (session.jobId === undefined) {
        return;
      }
      chatStore.requestJobTaskStatus().then((res: any) => {
        if (!res.results) {
          return;
        }
        if (res.results.length === 0) {
          set({taskList: {tasks: []}});
          return;
        }
        const taskIds = session.taskIds;
        const resTaskList = res.results.filter((item:any) => (item[0].toString() in taskIds));
        set({taskList: {tasks: resTaskList.map((item: any) => (
          {taskId: item[0].toString(), jobId: item[1].toString(), status: item[2]}
        ))}})
      });
      
    }
    const methods = {
      idleJobs() {
        getJobTasksStatus();
      },
      setTaskList(tasks: Array<TaskData>) {
        set({
            taskList: {tasks}
        });
      },
      getTaskList() {
        const state = get();
        const tl = state.taskList;
        return get().taskList;
      }
    };
    return methods;
  },
  {
    name: StoreKey.TaskList,
    version: 1.1,
    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as TaskListState;
      return newState as any;
    }
  }
)
