import Locale from "../locales";
import { DataFileTypeEnum, Modal, ReactDropZone } from "./ui-lib";
import styles from "./file-upload.module.scss";
import { useChatStore } from "../store";

export function FileUploadModal(
  {onClose, jobId, onUploaded}: 
  {
    onClose: () => void, 
    jobId?: string,
    onUploaded: (message: string) => void
  }
) {
  const chatState = useChatStore.getState();
  async function onUpload(file: File, dataType: string, done: () => void) {
    try {
      const res = await chatState.requestUploadFile(file, dataType);
      const jsonBody = await res.json();
      onUploaded(jsonBody.message??"");
    } catch (e: any) {
      console.log(e);
    }
    done();
  }
  return (
    <div className="modal-mask">
      <Modal
        title="Upload File ..."
        onClose={onClose}
      >
        <div className={styles["file-upload-body"]}>
        <ReactDropZone
          accept={{ 
            "application/h5ad": [".h5ad"], 
            "application/Rdata": [".Rdata"], 
            "text/csv": ["text/csv"], 
            "text/mtx": [".mtx"]
          }}
          onUpload={onUpload}
          fileTypeLabel="h5ad, Rdata, csv, mtx"
        />
        </div>
    </Modal>
    </div>
  )
}

