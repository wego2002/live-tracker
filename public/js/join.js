// =====================================
// LiveTracker - Teilnehmer
// join.js
// =====================================


// Verbindung zum Server

const socket = io();


// Elemente holen

const nameInput = document.getElementById("name");
const startButton = document.getElementById("startButton");
const statusBox = document.getElementById("status");


// Variablen

let tracking = false;


// Status ändern

function setStatus(text, type = "normal") {

    statusBox.innerHTML = text;

    statusBox.className = "status " + type;

}



// Verbindung hergestellt

socket.on("connect", () => {

    setStatus(
        "🟢 Mit Server verbunden",
        "success"
    );

});


// Verbindung verloren

socket.on("disconnect", () => {

    setStatus(
        "🔴 Verbindung verloren",
        "error"
    );

});



// Button klicken

startButton.addEventListener(
"click",
()=>{


    if(tracking)
    {
        return;
    }


    const name =
    nameInput.value.trim()
    || "Teilnehmer";



    // Teilnehmer registrieren

    socket.emit(
        "participant:join",
        {
            name:name
        }
    );


    startTracking();


});





// GPS starten

function startTracking(){


    if(!navigator.geolocation)
    {

        setStatus(
            "❌ GPS wird nicht unterstützt",
            "error"
        );

        return;

    }



    tracking = true;



    startButton.disabled = true;

    startButton.innerHTML =
    "📡 Standort wird gesendet";



    setStatus(
        "🟡 Warte auf GPS-Signal...",
        "loading"
    );



    navigator.geolocation.watchPosition(

        (position)=>{


            const latitude =
            position.coords.latitude;


            const longitude =
            position.coords.longitude;



            socket.emit(
                "participant:location",
                {
                    lat:latitude,
                    lng:longitude
                }
            );



            setStatus(
                "🟢 Standort aktiv",
                "success"
            );


        },


        (error)=>{


            console.log(error);



            switch(error.code)
            {


                case 1:

                    setStatus(
                    "❌ Standort wurde verweigert",
                    "error"
                    );

                    break;



                case 2:

                    setStatus(
                    "❌ Standort nicht verfügbar",
                    "error"
                    );

                    break;



                case 3:

                    setStatus(
                    "❌ GPS Zeitüberschreitung",
                    "error"
                    );

                    break;


                default:

                    setStatus(
                    "❌ Unbekannter GPS Fehler",
                    "error"
                    );

            }



        },


        {


            enableHighAccuracy:true,

            maximumAge:0,

            timeout:10000


        }


    );


}