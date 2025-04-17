import { Server } from "socket.io";
import axios from "axios";

const users = new Map();
const socketSessions = new Map();

export default async function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            pingTimeout: 5000,
            pingInterval:2000
        });

        io.on("connection", async (socket) => {
            const sessionID = socket.handshake.query.sessionID;
            if (!sessionID) return socket.disconnect();

            const userIP = socket.handshake.headers["x-forwarded-for"] || "Неизвестно";
            const userAgent = socket.handshake.headers["user-agent"] || "Неизвестно";
            const referrer = socket.handshake.headers["referer"] || "Прямой вход";
            const language = socket.handshake.headers["accept-language"] || "Неизвестно";
            const userIPForRequest = userIP?.split(',')[0] || req.socket.remoteAddress;

            if (!users.has(sessionID)) {
                let country = "Неизвестно", city = "Неизвестно", isp = "Неизвестно", timezone = "UTC", proxy = false;
                let deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
                let isBot = /bot|crawler|spider/i.test(userAgent);
                let visitDuration = 0;

                let visitDateTime = new Date();
                visitDateTime.setHours(visitDateTime.getUTCHours() + 4);
                visitDateTime = visitDateTime.toLocaleString("ru-RU");

                try {
                    const response = await axios.get(`http://ip-api.com/json/${userIPForRequest}?fields=country,city,isp,timezone,proxy`);
                    if (response.data) {
                        country = response.data.country || "Неизвестно";
                        city = response.data.city || "Неизвестно";
                        isp = response.data.isp || "Неизвестно";
                        timezone = response.data.timezone || "UTC";
                        proxy = response.data.proxy || false;
                    }
                } catch (error) {
                    console.error("Ошибка получения данных о пользователе:", error.message);
                }

                users.set(sessionID, {
                    sessionID,
                    ip: userIP,
                    country,
                    city,
                    isp,
                    timezone,
                    proxy,
                    userAgent,
                    referrer,
                    language,
                    deviceType,
                    isBot,
                    tabs: 0,
                    connectTime: Date.now(),
                    visitDuration,
                    visitDateTime
                });

                socketSessions.set(sessionID, new Set());
            }

            const userData = users.get(sessionID);
            socketSessions.get(sessionID).add(socket.id);
            userData.tabs = socketSessions.get(sessionID).size;

            io.emit("updateUsers", Array.from(users.values()));
            io.emit("userCount", users.size);

            socket.on("clientData", async (data) => {
                if (data.screenResolution) userData.screenResolution = data.screenResolution || 'none';
                if (data.theme) userData.theme = data.theme|| 'none';
                if (data.browser) userData.browser = data.browser|| 'none';
                if (data.os) userData.os = data.os|| 'none';
                if (data.deviceType) userData.deviceType = data.deviceType|| 'none';
                if (data.platform) userData.platform = data.platform|| 'none';
                if (data.timezone) userData.clientTimezone = data.timezone|| 'none';

                if (data.gpsLocation) {
                    userData.gpsLocation = data.gpsLocation || 'none';

                    try {
                        const geo = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${data.gpsLocation.latitude}&lon=${data.gpsLocation.longitude}&format=json`);
                        if (geo.data?.address) {
                            userData.gpsCountry = geo.data.address.country || null;
                            userData.gpsCity = geo.data.address.city || geo.data.address.town || geo.data.address.village || null;
                        }
                    } catch (err) {
                        console.warn("Չհաջողվեց ստանալ դիրքի անվանում:", err.message);
                    }
                }

                io.emit("updateUsers", Array.from(users.values()));
                io.emit("userCount", users.size);
            });

            socket.on("disconnect", () => {
                socketSessions.get(sessionID).delete(socket.id);
                userData.tabs = socketSessions.get(sessionID).size;

                if (socketSessions.get(sessionID).size === 0) {
                    userData.disconnectTime = Date.now();
                    userData.sessionDuration = (userData.disconnectTime - userData.connectTime) / 60000;
                    userData.visitDuration = userData.sessionDuration.toFixed(2);

                    console.log(`Пользователь отключился: ${sessionID} (${userData.ip}), Город: ${userData.city}, Длительность: ${userData.visitDuration} мин.`);

                    users.delete(sessionID);
                    socketSessions.delete(sessionID);
                }

                io.emit("updateUsers", Array.from(users.values()));
                io.emit("userCount", users.size);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}
