import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useSwiper } from "swiper/react";

export function DisableSwiperOnMapInteraction() {
    const map = useMap();
    const swiper = useSwiper();

    useEffect(() => {
        if (!map || !swiper) return;

        const disableSwiper = () => {
            swiper.allowTouchMove = false;
        };

        const enableSwiper = () => {
            swiper.allowTouchMove = true;
        };

        map.on("mousedown touchstart", disableSwiper);
        map.on("mouseup touchend dragend", enableSwiper);

        return () => {
            map.off("mousedown touchstart", disableSwiper);
            map.off("mouseup touchend dragend", enableSwiper);
        };
    }, [map, swiper]);

    return null;
}
