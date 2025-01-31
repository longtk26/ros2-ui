"use client"

import { useState } from "react"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: icon as any,
    shadowUrl: iconShadow as any,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMaker = () => {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        const event = e as any
        setPosition(event.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
}

export default LocationMaker