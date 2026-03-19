"use client"
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import ScreenMain from "../components/ScreenMain";
import { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import TargetDisplay from "../components/TargetDisplay";

const HunterScreen = () => {

    //this is for how the targets are shown
    const targets = [
        {
            id: 1,
            name: "kiwi",
            code: "12345"
        },
        {
            id: 2,
            name: "kiwi",
            code: "12345"
        },
        {
            id: 3,
            name: "kiwi",
            code: "12345"
        },
        {
            id: 4,
            name: "kiwi", 
            code: "12345"
        }
    ]

    //all of this is for the map
    const [mapOpen, setMapOpen] = useState(false);
    const [mapSize, setMapSize] = useState({ width: 180, height: 180, right: 0, bottom: 0, margin: "1rem" });
    const [coords, setCoords] = useState({ latitude: 51.505, longitude: -0.09 });

    useEffect(() => {
        const initMap = async (lat, lng) => {
            const L = await import("leaflet");
            const mapInstance = L.map("map", { zoomControl: false }).setView([lat, lng], 17);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "",
                zoomControl: false,
            }).addTo(mapInstance);
            L.marker([lat, lng]).addTo(mapInstance).bindPopup("you").openPopup();
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCoords({ latitude, longitude });
                    initMap(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    initMap(coords.latitude, coords.longitude);
                }
            );
        } else {
            console.error("Geolocation not supported");
            initMap(coords.latitude, coords.longitude);
        }
    }, []);

    const toggleMap = () => {
        if (!mapOpen) {
            setMapSize({ width: "100vw", top: 0, height: "100vh", top: 0, left: 0, margin: 0 })
            setMapOpen(true);
        } else {
            setMapSize({ width: 180, height: 180, right: 0, bottom: 0, margin: "1rem" })
            setMapOpen(false);
        }
    };

    return (
        <ScreenMain>
            <section className="w-full flex-col p-4 gap-4 flex flex-1">
                {
                    targets.map((target) => (
                        <TargetDisplay key={target.id} playerName={target.name} playerCode={target.code} />
                    ))
                }
            </section>

            <div
                id="map"
                style={mapSize}
                onClick={toggleMap}
                className="absolute m-4 rounded-lg"
            ></div>

            <div
                id="map"
                style={mapSize}
                onClick={toggleMap}
                className="absolute m-4 border-2 z-30 border-white"
            ></div>
        </ScreenMain>
    );
};

export default HunterScreen;