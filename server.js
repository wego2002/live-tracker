const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// --------------------
// Einstellungen
// --------------------

const ADMIN_PASSWORD =
process.env.ADMIN_PASSWORD || "12345";

// --------------------
// Teilnehmer speichern
// --------------------

const participants = new Map();

// --------------------
// Verbindung
// --------------------

io.on("connection", (socket) => {

    console.log(`Verbunden: ${socket.id}`);

    // --------------------
    // Admin Login
    // --------------------

    socket.on("admin:login", (password) => {

        if (password === ADMIN_PASSWORD) {

            socket.join("admins");

            socket.emit("admin:success");

            socket.emit(
                "participants:update",
                Object.fromEntries(participants)
            );

            console.log("Admin eingeloggt");

        } else {

            socket.emit("admin:failed");

        }

    });

    // --------------------
    // Teilnehmer beitreten
    // --------------------

    socket.on("participant:join", (data) => {

        participants.set(socket.id, {

            id: socket.id,

            name: data.name || "Teilnehmer",

            lat: null,

            lng: null,

            lastUpdate: null,

            online: true

        });

        io.to("admins").emit(
            "participants:update",
            Object.fromEntries(participants)
        );

        console.log(
            `${data.name || "Teilnehmer"} ist beigetreten`
        );

    });

    // --------------------
    // Standort
    // --------------------

    socket.on("participant:location", (position) => {


    if(
        !position ||
        typeof position.lat !== "number" ||
        typeof position.lng !== "number"
    )
    {
        return;
    }

        const user = participants.get(socket.id);

        if (!user) return;

        user.lat = position.lat;
        user.lng = position.lng;
        user.lastUpdate = Date.now();

        participants.set(socket.id, user);

        io.to("admins").emit(
            "participant:location",
            user
        );

    });

    // --------------------
    // Name ändern
    // --------------------

    socket.on("participant:rename", (name) => {

        const user = participants.get(socket.id);

        if (!user) return;

        user.name = name;

        participants.set(socket.id, user);

        io.to("admins").emit(
            "participants:update",
            Object.fromEntries(participants)
        );

    });

    // --------------------
    // Verbindung getrennt
    // --------------------

    socket.on("disconnect", () => {

        participants.delete(socket.id);

        io.to("admins").emit(
            "participants:update",
            Object.fromEntries(participants)
        );

        console.log(`Getrennt: ${socket.id}`);

    });

});

// --------------------
// Server starten
// --------------------

server.listen(PORT, () => {

    console.log("");
    console.log("==============================");
    console.log(" LiveTracker gestartet");
    console.log(` Port: ${PORT}`);
    console.log("==============================");
    console.log("");

});