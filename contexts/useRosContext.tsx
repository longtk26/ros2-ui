"use client";

import useRosbridge from "@/hooks/useRosbridge";
import { createContext, useContext } from "react";
import { RosContextType } from "./useRosContext.type";

const RosContext = createContext<RosContextType>(
    {} as RosContextType
)

const RosProvider = ({ children }: { children: React.ReactElement }) => {
    const { connected, detectedImage, rosPublish } = useRosbridge(
        "ws://localhost:9090"
    );

    return (
        <RosContext.Provider
            value={{
                connected,
                detectedImage,
                rosPublish,
            }}
        >
            {children}
        </RosContext.Provider>
    );
};

export const useRosContext = () => {
  const context = useContext(RosContext);

  if (!context) {
    throw new Error("useRosContext must be used within a RosProvider");
  } 

  console.log("Context::: ", context);

  return context;
};

export default RosProvider;
