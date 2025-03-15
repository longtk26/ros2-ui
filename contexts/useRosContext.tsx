"use client";

import useRosbridge from "@/hooks/useRosbridge";
import { createContext, useContext } from "react";
import { RosContextType } from "./useRosContext.type";

const RosContext = createContext<RosContextType>({} as RosContextType);
// 0.003654708520179372 RATIO
//  246.2576687116565 FOCAL LENGTH
const RosProvider = ({ children }: { children: React.ReactElement }) => {
    const {
        connected,
        rosPublish,
        image_listener,
        stm32_listener,
        graph_listener,
    } = useRosbridge("ws://localhost:9091");

    return (
        <RosContext.Provider
            value={{
                connected,
                rosPublish,
                image_listener,
                stm32_listener,
                graph_listener,
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

    return context;
};

export default RosProvider;
