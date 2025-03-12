import MapCrossTrack from "@/components/maps/MapCrossTrack";
import MapLeafLet from "@/components/maps/MapLeafLet";
import React from "react";

const MapPage = () => {
    return (
        <main className="w-[80%] fixed top-[60px] h-full right-0 bg-black/10">
            <MapLeafLet />
            <MapCrossTrack />
        </main>
    );
};

export default MapPage;
