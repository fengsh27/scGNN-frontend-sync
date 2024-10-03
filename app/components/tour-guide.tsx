import React from "react";
import { useEffect, useState } from "react";
import type { CallBackProps, Step } from "react-joyride";
import Joyride, { EVENTS, STATUS } from "react-joyride";
import Image from "next/image";

import LogsButtonIcon from "../icons/logs-button.png";

import { useAccessStore } from "../store/access";

interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

interface TourGuideProps {
  start: boolean;
  setStartTour: (value: boolean) => void;
  onTourEnd: () => void;
}

export function TourGuide ({ start, setStartTour, onTourEnd }: TourGuideProps) {
  const [progress, setProgress] = useState<number>(1);
  const totalSteps: number = 5;

  const generateSteps = (val: number): Step[] => [
    {
      content: (
        <div className="p-3">   
          <p>Click "New Chat" button to start a new conversation</p>      
          <div className="mt-4 border-b border-sessionbutton-foreground" />
          <div className="absolute bottom-[34px] left-[47%] text-sm text-neutral-400">
            {val} of {totalSteps}
          </div>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">Skip</strong> },
      styles: {
        options: {
          width: 500,
        },
      },
      placement: "top",
      target: "#new-conversation",
    },
    {
      content: (
        <div className="mb-4 flex flex-col gap-4 px-2 text-left">
          <p className="mr-2 text-sm">
          You can now upload a data file (h5ad, RData, CSV, or mtx). 
          </p>
          <p className="mr-2 text-sm">
          Alternatively, click the 'File Manager' button to manage your uploaded files.
          </p>
          <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
            {val} of {totalSteps}
          </div>
        </div>
      ),
      styles: {
        options: {
          width: 600,
        },
      },
      placement: "top",
      target: "#upload-file",
      title: "",
    },
    {
      content: (
        <div className="mb-4 flex flex-col gap-4 px-2 text-left">
          <p className="mr-4 text-base font-bold">After uploading your data files, let us know what you'd like to do. 
            For example, you can say, "Please run scGNN on the uploaded data file."</p>
          <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
            {val} of {totalSteps}
          </div>
        </div>
      ),
      styles: {
        options: {
          width: 680,
        },
      },
      placement: "top",
      target: "#chat-input",
      title: "",
    },
    {
      content: (
        <div className="mb-4 flex flex-col gap-4 px-2 text-left">
          <p className="mr-2 text-sm">
          While the command is running, the task status will be displayed in the task window.
          </p>
          <div className="absolute bottom-[30px] left-[8%] text-sm text-neutral-400">
            {val} of {totalSteps}
          </div>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: "left",
      target: "#task-window",
      title: "",
    },
    {
      content: (
        <div className="p-1">
          <p className="text-4xl">You can also view the task logs in the task logs window by clicking the "Logs" button.</p>
          <div className="w-full bg-white flex items-center justify-center">
          <Image
              src={LogsButtonIcon.src}
              alt="logs button"
              className="text-white"
              width={400}
              height={100}
              priority
            />
          </div>
        </div>
      ),
      styles: {
        options: {
          width: 700,
        },
      },
      placement: "left",
      target: "#logs-window",
      title: "",
    },
  ];

  const [{ run, steps }, setState] = useState<State>({
    run: start,
    stepIndex: 0,
    steps: generateSteps(progress),
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: generateSteps(progress),
    }));
  }, [progress]);

  useEffect(() => {
    if (start) {
      setState((prevState) => ({
        ...prevState,
        run: true,
        stepIndex: 0,
      }));
    }
  }, [start]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setState({ steps, run: false, stepIndex: 0 });
      setStartTour(false);
      onTourEnd();
    } else if (([EVENTS.STEP_BEFORE] as string[]).includes(type)) {
      setProgress(index + 1);
    }
  };

  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      run={run}
      steps={steps}
      scrollToFirstStep
      hideCloseButton={false}
      disableCloseOnEsc
      disableOverlayClose
      spotlightPadding={5}
      showProgress
      showSkipButton
      styles={{
        overlay: {
          // border: "6px solid lightblue",
        },
        spotlight: {
          // border: "2px solid lightblue",
        },
        buttonClose: {
          marginTop: "5px",
          marginRight: "5px",
          width: "12px",
        },
        buttonNext: {
          outline: "2px solid transparent",
          outlineOffset: "2px",
          backgroundColor: "#1c7bd4",
          borderRadius: "5px",
          color: "#FFFFFF",
        },
        buttonSkip: {
          color: "A3A3A3",
        },
        tooltipFooter: {
          //margin: "0px 16px 10px 10px",
        },
        // buttonBack: {
          // outline: "2px solid transparent",
          // outlineOffset: "2px",
        // },
        options: {
          zIndex: 100,
          arrowColor: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          textColor: "#000000",
          // overlayColor: "rgba(0, 0, 0, 0.0)",
          primaryColor: "#1c7bd4",
        },
      }}
      locale={{
        last: (<p className="py-10 font-bold focus:ring-transparent focus-visible:outline-none">
          End
        </p>),
        back: (
          <p className="font-bold focus:ring-transparent focus-visible:outline-none">
            {`Back`}
          </p>
        ),
      }}
    />
  );
};
