// =====================================
// LiveTracker Admin
// admin.js
// =====================================


const socket = io();


// Elemente

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");

const passwordInput =
document.getElementById("password");

const loginButton =
document.getElementById("loginButton");

const loginStatus =
document.getElementById("loginStatus");

const participantList =
document.getElementById("participantList");


// Karte

let map;

let markers = {};



// =====================================
// Login
// =====================================


loginButton.addEventListener(
"click",
()=>{


    const password =
    passwordInput.value;


    socket.emit(
        "admin:login",
        password
    );


});




// Erfolgreicher Login

socket.on(
"admin:success",
()=>{


    loginBox.classList.add("hidden");


    dashboard.classList.remove("hidden");


    initMap();

createQRCode();


});




// Fehler Login

socket.on(
"admin:failed",
()=>{


    loginStatus.innerHTML =
    "❌ Falsches Passwort";


});




// =====================================
// Karte starten
// =====================================


function initMap(){


    map = L.map("map")
    .setView(
        [51.1657,10.4515],
        6
    );



    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom:19,

            attribution:
            "© OpenStreetMap"

        }

    ).addTo(map);


}



// =====================================
// Teilnehmer Liste
// =====================================


socket.on(
"participants:update",
(data)=>{


    participantList.innerHTML="";


    const users =
    Object.values(data);



    if(users.length===0)
    {

        participantList.innerHTML =
        "Keine Teilnehmer";

        return;

    }



    users.forEach(
    user=>{


        addParticipant(user);


    });


});




// Teilnehmer anzeigen

function addParticipant(user){


    const div =
    document.createElement("div");


    div.className =
    "participant";



    div.innerHTML = `

        <div class="participant-header">

            <div class="avatar">
                👤
            </div>


            <div class="participant-name">

                <strong>
                ${user.name}
                </strong>

                <span>
                ${user.online 
                ? "🟢 Online" 
                : "🔴 Offline"}
                </span>

            </div>

        </div>



        <div class="participant-info">


            <div>
                📍 Standort:
                <b>
                ${user.lat 
                ? "Aktiv" 
                : "Warte..."}
                </b>
            </div>



            <div>
                🕒 Update:
                <b>
                ${user.updated 
                ? formatTime(user.updated)
                : "-"}
                </b>
            </div>


        </div>

    `;



    div.onclick = ()=>{


        if(user.lat && user.lng)
        {

            map.setView(
            [
            user.lat,
            user.lng
            ],
            15
            );

        }


    };



    participantList.appendChild(div);

}





// =====================================
// Standort Update
// =====================================


socket.on(
"participant:location",
(user)=>{


    updateMarker(user);


});




// Marker aktualisieren

function updateMarker(user){


    if(!map)
    return;



    const position =
    [
        user.lat,
        user.lng
    ];



    if(markers[user.id])
    {


        markers[user.id]
        .setLatLng(position);



    }
    else
    {


const personIcon = L.divIcon({

    className: "person-marker",

    html: `
        <div class="marker-container">

            <div class="marker-name">
                ${user.name}
            </div>

            <div class="marker-icon">
                📍
            </div>

        </div>
    `,

    iconSize:[80,80],

    iconAnchor:[40,80]

});



markers[user.id] =
L.marker(
    position,
    {
        icon:personIcon
    }
)
.addTo(map)
.bindPopup(
    `
    <div class="popup">

        <h3>
        👤 ${user.name}
        </h3>

        <p>
        🟢 Standort aktiv
        </p>

        <p>
        📍
        ${user.lat.toFixed(5)},
        ${user.lng.toFixed(5)}
        </p>

    </div>
    `
);


    }


}


// =====================================
// QR Code Teilnehmer-Link
// =====================================


function createQRCode(){


    const link =
    window.location.origin 
    + "/join.html";



    document.getElementById(
        "joinLink"
    ).innerHTML = link;



    new QRCode(

        document.getElementById(
            "qrcode"
        ),

        {

            text: link,

            width:200,

            height:200

        }

    );


}


