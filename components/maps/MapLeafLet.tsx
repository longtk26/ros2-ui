"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LocationMaker from "./LocationMaker";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { FeatureGroup, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { LatLngExpression } from "leaflet";
import { useRosContext } from "@/contexts/useRosContext";
import ROSLIB from "roslib";
import { convertToCoordsMap, interpolatePoints } from "@/util";

const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);

// Custome zoom level
const maxZoom = 100;
const minZoom = 0;
L.TileLayer.prototype.options.maxZoom = maxZoom;
L.TileLayer.prototype.options.minZoom = minZoom;

const MapLeafLet = () => {
    const [mounted, setMounted] = useState(false);
    const { rosPublish, dataSTM32 } = useRosContext();
    const [coordinates, setCoordinates] = useState<number[][]>([]);

    // data stm32: s:2:2:lat:lng:e
    useEffect(() => {
        setMounted(true);

        if (dataSTM32) {
            const [_, mode, ___, lat, lng] = dataSTM32.split(":");

            // Convert to coords map
            const latOnMap = convertToCoordsMap(parseFloat(lat));
            const lngOnMap = convertToCoordsMap(parseFloat(lng));
            console.log("MODE::: ", mode);
            // Mode GPS = 2
            if (mode !== "2") return;

            setCoordinates((prev) => [
                ...prev,
                [latOnMap, lngOnMap],
            ]);
        }
    }, [dataSTM32]);

    const sendCoordinates = (e: any) => {
        console.log(`event:`, e);
        if (e.layerType === "rectangle") {
            const latlngs = e.layer._latlngs[0].map((point: any) => [
                point.lat,
                point.lng,
            ]);
            if (latlngs.length !== 4) return;

            const points: number[][] = [];
            const distanceBetweenCoords = 0.5 / 111320;
            for (let i = 0; i < 4; i++) {
                points.push(
                    ...interpolatePoints(
                        latlngs[i],
                        latlngs[(i + 1) % 4],
                        distanceBetweenCoords
                    )
                );
            }

            for (let i = 0; i < points.length; i++) {
                const message = new ROSLIB.Message({
                    data: `[serial] s:2:2:${points[i][0]}:${points[i][1]}:e`,
                });
                rosPublish?.publish(message);
                console.log(
                    `Published message ${i}: [serial] s:2:2:${points[i][0]}:${points[i][1]}:e`
                );
            }
        } else {
            const listCoordinates = e.layer._latlngs.map((item: any) => [
                item.lat,
                item.lng,
            ]);
            // const message = new ROSLIB.Message({
            //     data: `[serial] s:2:2:${e.latlng.lat}:${e.latlng.lng}:e`
            // });
            // rosPublish?.publish(message);
            for (let i = 0; i < listCoordinates.length; i++) {
                const message = new ROSLIB.Message({
                    data: `[serial] s:2:2:${listCoordinates[i][0]}:${listCoordinates[i][1]}:e`,
                });
                // rosPublish?.publish(message);
                console.log(
                    `message ${i}: [serial] s:2:2:${listCoordinates[i][0]}:${listCoordinates[i][1]}:e`
                );
            }
        }
    };

    if (!mounted) return <p>Loading map...</p>;

    return (
        <div className="h-[500px] w-full">
            <MapContainer
                center={[10.9768793, 106.6741468]}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={sendCoordinates}
                        draw={{
                            rectangle: true,
                            circle: false,
                            circlemarker: false,
                            polyline: true,
                        }}
                    />
                </FeatureGroup>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMaker />
                {coordinates.length > 1 && (
                    <Polyline
                        pathOptions={{ color: "red" }}
                        positions={coordinates as LatLngExpression[]}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapLeafLet;
