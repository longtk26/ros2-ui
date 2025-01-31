"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LocationMaker from "./LocationMaker";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

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

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <p>Loading map...</p>;

    return (
        <div className="h-[400px] w-full">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <FeatureGroup>
                    <EditControl 
                        position="topright"
                        onCreated={(e) => console.log(e)}
                        draw={{
                            rectangle: false,
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
            </MapContainer>
        </div>
    );
};

export default MapLeafLet;
