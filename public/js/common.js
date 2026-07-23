// =====================================
// LiveTracker - Common Functions
// common.js
// =====================================


// Kleine Hilfsfunktion für Meldungen

function showMessage(element, text, type = "")
{

    if(!element)
        return;


    element.innerHTML = text;


    element.className = "";


    if(type)
    {

        element.classList.add(type);

    }

}



// Zeit formatieren

function formatTime(timestamp)
{

    if(!timestamp)
        return "-";


    const date =
    new Date(timestamp);


    return date.toLocaleTimeString(
        "de-DE",
        {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        }
    );

}



// Entfernung berechnen

function distanceBetween(
    lat1,
    lon1,
    lat2,
    lon2
)
{

    const earthRadius = 6371;


    const dLat =
    (lat2-lat1)
    *
    Math.PI/180;


    const dLon =
    (lon2-lon1)
    *
    Math.PI/180;



    const a =
    Math.sin(dLat/2)
    *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180)
    *
    Math.cos(lat2*Math.PI/180)
    *
    Math.sin(dLon/2)
    *
    Math.sin(dLon/2);



    const c =
    2 *
    Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
    );


    return earthRadius*c;

}