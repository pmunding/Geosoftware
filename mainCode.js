/**
 * Aufgabe04 Geosoftware1
 * @author {Philipp Mundinger}
 */

////////////////////////////////////////////
//Berechnung der Entfernungen 
//////////////////////////////////////


/*




var distanzen = [];
*/

//Funktion zur Distanzberechnung www.movable-type.co.uk/scripts/latlong.html
/**
 * @param {Laengengrad Standort} lon1 
 * @param {Breitengrad Standort} lat1 
 * @param {Laengengrad Bushaltestelle} lon2 
 * @param {Breitengrad Bushaltestelle} lat2 
 * @returns 
 */
function distanzRechner(lon1, lat1, lon2, lat2) {


    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c / 1000; // in km

    return d;

}



var y = document.getElementById("demo");
/**
 * Standortabfrage des Browsers 
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        y.innerHTML = "Geolocation is not supported by this browser.";
    }
}

/**
 * Makiert den Aktuellen Standort auf der Karte und ruft weitere Funktionen auf
 * @param {Die Aktuelle Position des Stanortes} position 
 */
function showPosition(position) {
    y.innerHTML = "Die Aktuelle Position ist:</br>" + "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    console.log(position)
    var greenIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [100, 100], // size of the icon  
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location   
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.marker({ lon: position.coords.longitude, lat: position.coords.latitude }, { icon: greenIcon }).bindPopup('Aktuelle Position <br>' + 'Latitude' + position.coords.latitude + '<br>Longitude' + position.coords.longitude).addTo(map);

    abstandZuMeinemStandort(geodaten, position.coords.latitude, position.coords.longitude) //Abstand zur Bushaltestelle

}

//Klasse für die Haltestellen 
class Haltestellen {
    /**
     * @param {Array} Koordinaten der Bushaltestellen
     * @param {int} entfernung - Die Entfernung meines Standorts zu den Haltestellen
     * @param {String} name - Name der Bushaltestelle
     * @param {Array} stationenNummer - gibt die AbfahrtsstationenNummer des Busses 
     * @param {Array} koordinaten - Koordinaten der Bushaltestellen
     */
    constructor(entfernung, name, stationenNummer, koordinaten) {
        this.entfernung = entfernung;
        this.name = name;
        this.stationenNummer = stationenNummer;
        this.koordinaten = koordinaten;
    }

    abstand(lat1, lon1) {
        neueOrte.forEach(item => {
            distanzen.push(distanzRechner(lon1, lat1, item[0], item[1]));
        })
        console.log(distanzen)
        return distanzen;
    }




}


//GeoJson Haltestellen einladen
var geo;
var x = new XMLHttpRequest()
x.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen", true)
x.send();
x.onreadystatechange = function () {
    if (x.status == "200" && x.readyState == 4) {

        geo = JSON.parse(x.responseText)
        console.log(geo)
        BusArray(geo)
    }
}


var geodaten = []   //Koordinaten der Bushaltestellen
var nameBushalte = []   //Name der Bushaltestellen
var station = [];   	//Nummer der Bushaltestellen
var nextToYou = []    //Entfernung der Bushaltestellen
var Bushaltestellen = []; //Bushaltestellen Objekte

/**
 * Nimmt sich die Informationen der Namen und Koordinaten aus dem geo Datensatz
 * @param {*} geo 
 */
function BusArray(geo) {

    //Koordinaten der Bushaltestellen 
    geo.features.forEach(element => {
        geodaten.push(element.geometry.coordinates)
    });
    console.log(geodaten)

    //Namen für jede Bushaltestelle
    geo.features.forEach(item => {
        nameBushalte.push(item.properties.lbez)
    })
    console.log(nameBushalte)

    //Nummer der Bushaltestellen
    geo.features.forEach(element => {
        station.push(element.properties.nr)
    })
    console.log(station)

    //Marker auf der Karte setzen
    var punkt = L.icon({
        iconUrl: 'punkt.png',
        iconSize: [10, 10], // size of the icon  
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location   
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var i = 0;
    var j = 0;
    var k = 0;
    var KoNameNr = []
    geodaten.forEach(element => {
        KoNameNr.push(element)
    })

}


var erstenZwei = []
/**
 * Erzeugt Objekte der Klasse Bus und Sortiert diese Objekte 
 * @param {Nummer der Station} station 
 * @param {entfernung der Station} nachste 
 * @param {Name der BUshaltestelle} nameBushalte 
 */

function erstelleObjekte(nextToYou) {

    var bus //Bus Objekt
    var k = 0;
    var i = 0;
    var j = 0;
    var l = 0;
    while (station.length != k) {
        bus = new Haltestellen(
            nextToYou[i],
            nameBushalte[j],
            station[k],
            geodaten[l]
        )

        i++;
        j++;
        k++
        l++
        Bushaltestellen.push(bus)
    }
    //Sortieren Des Arrays
    Bushaltestellen.sort(function (a, b) {
        return a.entfernung > b.entfernung;
    });
    console.log(Bushaltestellen)
    plotteBus(Bushaltestellen)

    erstenZwei.push(Bushaltestellen[0].stationenNummer)
    busfahrplan(erstenZwei)
}

//Entfernung der Bushaltestellen zu meinem Punkt
/**
 * 
 * @param {Datensatz mit den Koordinaten der Bushaltestellen} geodaten 
 * @param {Laengengrad Standort} lon1 
 * @param {Breitengrad Standort} lat1 
 */
function abstandZuMeinemStandort(geodaten, lon1, lat1) {
    geodaten.forEach(item => {
        nextToYou.push(distanzRechner(lon1, lat1, item[1], item[0]))

    })
    console.log(nextToYou)

    erstelleObjekte(nextToYou)

}

function plotteBus(Bushaltestellen) {

    document.getElementById("justtext").value = Bushaltestellen[0].name + Bushaltestellen[2].name + Bushaltestellen[4].name + Bushaltestellen[6].name + Bushaltestellen[6].name

    //Marker auf der Karte setzen
    var punkt = L.icon({
        iconUrl: 'punkt.png',
        iconSize: [10, 10], // size of the icon  
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location   
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    
    Bushaltestellen.forEach(element => {
        L.marker({ lon: element.koordinaten[0], lat: element.koordinaten[1] }, { icon: punkt }).bindPopup('Name: ' + element.name + '</br>Nummer: ' + element.stationenNummer + '</br>Entfernung:' + element.entfernung).addTo(map).addTo(overlay);
    })

    
    

}



function busfahrplan(erstenZwei) {
    var abfahrt;
    var time = new XMLHttpRequest()
    y.onreadystatechange = function () {
        if (time.status == "200" && time.readyState == 4) {

            console.log(time.responseText)
            abfahrt = JSON.parse(time.responseText)
            document.getElementById("Datenbereich").innerHTML = unixINTOdate(abfahrt[0].abfahrtszeit)
            console.log(abfahrt)
        }
        else {
            console.log("Fehler")
        }
    }



    //AbfahrtsstationenNummer einladen 
    time.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen/" + erstenZwei + "/abfahrten?sekunden=3000", true)
    time.send();


    function unixINTOdate(unix) {
        let unix_timestamp = unix
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        console.log(formattedTime);
        return formattedTime;
    }
}

/*

//////////////////////////////////////////////////////////
 Für die Aufgabe nicht benötigte Funktionen


    function auswerten() {
        var inGeoJs = JSON.parse(texteingabe.value)
        //Coordnianten auslesen
        leange = inGeoJs.geometry.coordinates;
        //Entfernungen erneut mit neuem Stanort berechnen
        //array für die neuen Distanzen
        orte.features.forEach(element => {
            neueOrte.push(element.geometry.coordinates)
        });
    
        neueOrte.forEach(item => {
            neuedistanzen.push(distanzRechner(leange[0], leange[1], item[0], item[1]));
        });
    
        console.log(neuedistanzen)
        console.log(neuedistanzen[12])
    
    
        //Standort anzeigen 
        var greenIcon = L.icon({
            iconUrl: 'ritter.png',
            iconSize: [50, 50], // size of the icon  
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location   
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        L.marker({ lon: leange[0], lat: leange[1] }, { icon: greenIcon }).bindPopup('GeoJSON Point').addTo(map);
        */


