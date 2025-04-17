"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {UAParser} from "ua-parser-js";

export default function useUserList() {
    const [count, setCount] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let sessionID = localStorage.getItem("sessionID");

        if (!sessionID) {
            sessionID = Math.random().toString(36).substr(2, 9);
            localStorage.setItem("sessionID", sessionID);
        }

        const socket = io({ path: "/api/socket", query: { sessionID } });

        socket.on("userCount", (count) => setCount(count));
        socket.on("updateUsers", (users) => setUsers(users));

        // ✨ Բռնում ենք device info + gps
        const parser = new UAParser();
        const result = parser.getResult();

        const clientData = {
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            theme: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
            browser: result.browser.name,
            os: result.os.name,
            deviceType: result.device.type || "Desktop",
            platform: result.device.vendor || "Unknown",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        // ✨ GPS-ի ստացում (եթե թույլ է տալիս)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    clientData.gpsLocation = { latitude, longitude };
                    socket.emit("clientData", clientData);
                },
                (err) => {
                    console.warn("GPS չի հաջողվել:", err.message);
                    socket.emit("clientData", clientData);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            socket.emit("clientData", clientData);
        }

        const handleDisconnect = () => {
            socket.emit("manualDisconnect");
        };

        window.addEventListener("beforeunload", handleDisconnect);

        return () => {
            window.removeEventListener("beforeunload", handleDisconnect);
            socket.disconnect();
        };
    }, []);

    return {
        users,
        count
    };
}
