import { ErrorBoundary } from "./error";
import Locale from "../locales";

import styles from "./welcome.module.scss";
import { MarkdownContent } from "./markdown";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { showConfirm } from "./ui-lib";
import { useAppConfig, useUpdateStore, useAccessStore } from "../store";

import React, { useState, useEffect } from 'react';

export function Welcome() {
  const config = useAppConfig();
  const navigate = useNavigate();

  const updateStore = useUpdateStore();
  const accessStore = useAccessStore();

  function checkUpdate(force = false) {
    updateStore.getLatestVersion(force).then(() => {
      console.log("[Update] local version ", updateStore.version);
      console.log("[Update] remote version ", updateStore.remoteVersion);
    });
  }

  useEffect(() => {
    checkUpdate();
  }, []);

  const [currentWhatMessageIndex, setCurrentWhatMessageIndex] = useState(0);
  const [currentHowMessageIndex, setCurrentHowMessageIndex] = useState(0);

  const handleWhatClick = () => {
    setCurrentWhatMessageIndex((prevIndex) => (prevIndex + 1) % (whatMessages?.length ?? 1));
  };

  const handleHowClick = () => {
    setCurrentHowMessageIndex((prevIndex) => (prevIndex + 1) % (howMessages?.length ?? 1));
  };

  return (
    <ErrorBoundary>
      <div className={styles["welcome-page"]}>
        <div className="window-header">
          <div className="window-header-title">
            <div className="window-header-main-title">
              Welcome to scGNN+
            </div>
          </div>
          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                text={Locale.Welcome.Page.NotShow}
                onClick={async () => {
                  if (await showConfirm(Locale.NewChat.ConfirmNoShow)) {
                    config.update(
                      (config) => (config.dontShowWelcomeSplashScreen = true),
                    );
                    navigate(Path.Chat)
                  }
                }} />
            </div>
            <div className="window-action-button">
              <IconButton
                icon={<CloseIcon />}
                bordered
                onClick={() => { navigate(Path.Chat) }}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}