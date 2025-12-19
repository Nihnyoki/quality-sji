import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface LocateUserProps {
    fallback: [number, number];
    zoom?: number;
}

export function LocateUser({ fallback, zoom = 27 }: LocateUserProps) {
    const map = useMap();

    useEffect(() => {
        if (!navigator.geolocation) {
            map.setView(fallback, zoom);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], zoom, { animate: true });
            },
            () => {
                map.setView(fallback, zoom);
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, [map, fallback, zoom]);

    return null;
}