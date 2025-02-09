"use client"

import { useState } from "react"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { convertToCoordsMap } from "@/util";

let DefaultIcon = L.icon({
    iconUrl: icon as any,
    shadowUrl: iconShadow as any,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMaker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({});

  const flyToFixedLocation = () => {
      const lastReceived = 1058.61276
      const lat = convertToCoordsMap(lastReceived);
      const longReceived = 10640.44881;
      const long = convertToCoordsMap(longReceived);
      console.log(lat, long);

      const fixedCoordinates = [lat, long] as L.LatLngTuple; 
      setPosition(new L.LatLng(...fixedCoordinates));
      map.flyTo(fixedCoordinates, 20);
  };

  return (
      <>
          <button onClick={flyToFixedLocation} style={{ position: "absolute", bottom: 2, left: 10, zIndex: 1000 }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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


export default LocationMaker