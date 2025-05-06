"use client";

import { useEffect, useState } from "react";
import { Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
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
    const [pathDebug, setPathDebug] = useState<L.LatLngTuple[]>([]); // Store path coordinates
    const { stm32_listener, rosPublish } = useRosContext(); // STM32 data: s:3:2:lat:long:e
    const [dataSTM32, setDataSTM32] = useState<string>("");
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
        stm32_listener?.subscribe((message: any) => {
            setDataSTM32(message.data);
        });
        const message = new ROSLIB.Message({
            data: "[serial] find-me",
        });
        rosPublish.publish(message);
    }, []);

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
            {/* Show Dotted Line */}
            {/* {pathDebug.length > 1 && (
                <Polyline
                    positions={pathDebug}
                    pathOptions={{
                        color: "red",
                    }}
                />
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const lat = parseFloat((e.target as any).lat.value);
                    const long = parseFloat((e.target as any).long.value);
                    console.log(`lat: ${lat}, long: ${long}`);

                    const newCoord: L.LatLngTuple = [lat, long];
                    setPathDebug((prevPath) => [...prevPath, newCoord]); // Append new point

                    map.panTo(newCoord);
                }}
                className="flex flex-col items-center justify-between gap-5"
                style={{
                    position: "absolute",
                    top: 200,
                    left: 4,
                    zIndex: 1000,
                }}
            >
                <div>
                    <label htmlFor="lat">Lat:</label>
                    <input id="lat" type="text" name="lat" />
                </div>

                <div>
                    <label htmlFor="long">Long:</label>
                    <input id="long" type="text" name="long" />
                </div>

                <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded">
                    Show on map
                </button>
            </form> */}
        </>
    );
};

export default LocationMaker;
