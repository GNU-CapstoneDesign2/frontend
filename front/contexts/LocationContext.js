import React, { createContext, useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [lastPosition, setLastPosition] = useState(null);
    const watchRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.warn("위치 권한 거부");
                return;
            }

            watchRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 5000,
                    distanceInterval: 5,
                },
                (loc) => {
                    setLastPosition(loc.coords);
                }
            );
        })();

        return () => {
            if (watchRef.current) {
                watchRef.current.remove();
            }
        };
    }, []);

    return <LocationContext.Provider value={{ lastPosition }}>{children}</LocationContext.Provider>;
};
