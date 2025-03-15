"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LocationMaker from "./LocationMaker";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { FeatureGroup, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { LatLngExpression, point } from "leaflet";
import { useRosContext } from "@/contexts/useRosContext";
import ROSLIB from "roslib";
import { convertToCoordsMap, interpolatePoints } from "@/util";
import SavePointsMap from "./SavePointsMap";

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
    const { rosPublish, stm32_listener } = useRosContext();
    const [coordinates, setCoordinates] = useState<number[][]>([]);
    const [pointsSentToJetson, setPointsSentToJetson] = useState<number[][]>(
        []
    );
    const [coordinatesSaved, setCoordinatesSaved] = useState<number[][]>([]);

    // data stm32: s:2:2:lat:lng:e
    useEffect(() => {
        setMounted(true);
        if (!stm32_listener) return;
    
        const callback = (message: any) => {
           const [_, mode, ___, lat, lng] = message.data.split(":");
           // Convert to coords map
           const latOnMap = convertToCoordsMap(parseFloat(lat));
           const lngOnMap = convertToCoordsMap(parseFloat(lng));
           // Mode GPS = 2
           if (mode !== "2") return;

           setCoordinates((prev) => [...prev, [latOnMap, lngOnMap]]);
        };
    
        stm32_listener.subscribe(callback);
    
        return () => {
            stm32_listener.unsubscribe(callback);
        };
    }, [stm32_listener]);

    const sendPointsToJetson = () => {
        console.log(`pointsSentToJetson sent`);

        const pointsSent =
            coordinatesSaved.length > 0 ? coordinatesSaved : pointsSentToJetson;

        const message = new ROSLIB.Message({
            data: `[standley_node] ${pointsSent.length}-${pointsSent}`,
        });
        const messageSerial = new ROSLIB.Message({
            data: `[serial] request-imu`,
        });
        console.log(
            `polyline [standley_node] ${pointsSent.length}-${pointsSent}`
        );

        rosPublish?.publish(message);
        rosPublish?.publish(messageSerial);
    };

    const sendCoordinates = (e: any) => {
        console.log(`event:`, e);
        const eventMapping: { [key: string]: any } = {
            rectangle: handleRectangle,
            circle: handleCircle,
            polyline: handlePolyline,
        };

        eventMapping[e.layerType](e);
    };

    const handleRectangle = (e: any) => {
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

        setPointsSentToJetson(points);
    };

    const handlePolyline = (e: any) => {
        const listCoordinates = e.layer._latlngs.map((item: any) => [
            item.lat,
            item.lng,
        ]);

        const points: number[][] = [];
        const distanceBetweenCoords = 0.5 / 111320;
        for (let i = 0; i < listCoordinates.length - 1; i++) {
            points.push(
                ...interpolatePoints(
                    listCoordinates[i],
                    listCoordinates[i + 1],
                    distanceBetweenCoords
                )
            );
        }

        setPointsSentToJetson(points);
    };

    const handleCircle = (e: any) => {
        console.log(`circle:`, e);
    };

    const handleEdit = (e: any) => {
        console.log(`edited:`, e.target._targets);
    };

    if (!mounted) return <p>Loading map...</p>;

    return (
        <div className="h-[414px] w-full">
            <MapContainer
                center={[10.882130166666665, 106.80544716666667]}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={sendCoordinates}
                        onEdited={handleEdit}
                        draw={{
                            rectangle: true,
                            circle: true,
                            circlemarker: false,
                            polygon: false,
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
                {coordinatesSaved.length > 1 && (
                    <Polyline
                        pathOptions={{ color: "black" }}
                        positions={coordinatesSaved as LatLngExpression[]}
                    />
                )}
                <button
                    onClick={sendPointsToJetson}
                    style={{
                        position: "absolute",
                        bottom: 50,
                        left: 10,
                        zIndex: 1000,
                    }}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                >
                    Start
                </button>
                <SavePointsMap
                    points={pointsSentToJetson}
                    onSetCoordinatesSaved={setCoordinatesSaved}
                />
            </MapContainer>
        </div>
    );
};

export default MapLeafLet;
