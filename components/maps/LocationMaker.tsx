"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { convertToCoordsMap } from "@/util";
import { useRosContext } from "@/contexts/useRosContext";
import ROSLIB from "roslib";

const DefaultIcon = L.icon({
    iconUrl: icon as any,
    shadowUrl: iconShadow as any,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMaker = () => {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const { dataSTM32, rosPublish } = useRosContext(); // STM32 data: s:3:2:lat:long:e
    const map = useMapEvents({});

    const flyToFixedLocation = () => {
        const lastReceived = parseFloat(dataSTM32.split(":")[3]);
        const lat = convertToCoordsMap(lastReceived);
        const longReceived = parseFloat(dataSTM32.split(":")[4]);
        const long = convertToCoordsMap(longReceived);
        console.log(lat, long);

        const fixedCoordinates = [lat, long] as L.LatLngTuple;
        setPosition(new L.LatLng(...fixedCoordinates));
        // setPosition(new L.LatLng(10.881989833333334, 106.80560283333334));
        map.flyTo(fixedCoordinates, 20);
        // map.flyTo([10.881989833333334, 106.80560283333334], 30);
    };

    useEffect(() => {
        const message = new ROSLIB.Message({
            data: "[serial] find-me",
        });
        rosPublish.publish(message);
    }, [])

    return (
        <>
            <button
                onClick={flyToFixedLocation}
                style={{
                    position: "absolute",
                    bottom: 2,
                    left: 10,
                    zIndex: 1000,
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Find me
            </button>
            {position && (
                <Marker position={position}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </>
    );
};

export default LocationMaker;
