import React, { useEffect, useState } from "react";
import { skNodesMachine } from "../../store";
import "./index.scss";
import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";

export default function NodeStatus() {
  const [current] = useMachine(skNodesMachine);
  const [t] = useTranslation();
  const [time, settime] = useState(Date.now());
  useEffect(() => {
    setTimeout(() => {
      settime(Date.now());
    }, 1000);
  }, []);
  const node = current.context.chain.sk;
  return (
    <div className="status-box">
      <h3>{t("node_status")}</h3>
      <div className="status-item">
        <span>{t("sliceName")}: </span>
        <span>{node.slice.slice}</span>
      </div>
      <div className="status-item">
        <span>{t("slicePreeSize")}: </span>
        <span>{node.slice.curPeers.size}</span>
      </div>
    </div>
  );
}
