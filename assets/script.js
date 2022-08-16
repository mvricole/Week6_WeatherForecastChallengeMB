// Display Current Date Using Moment
let $cityDate = moment().format("llll");
$("#currentdate").text($cityDate);

// Event listener calls citysearch() on Search By City sidebar
let $clicked = $(".buttonsearch");
$clicked.on("click", citysearch);
$clicked.on("click", searchSave);


// Search By City function 
function citysearch() {
    let cityname = (($(this).parent()).siblings("#cityenter")).val().toLowerCase();
    function clear() {
        $("#cityenter").val("");
    }
    setTimeout(clear, 300);

//Current Weather Using API URL And Ajax 
    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityname + "&units=imperial&appid=e7c303b6206e1039548ab3f11d2207b3";
    $.ajax({
        url: firstQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // Allows page to keep current city information
        let $currentTemp = parseInt(response.main.temp) + "°F";
        let $currentHum = response.main.humidity + "%";
        let $currentWind = parseInt(response.wind.speed) + "mph";
        let $currentIcon = response.weather[0].icon;
        let $currentIconURL = "http://openweathermap.org/img/w/" + $currentIcon + ".png";

        // Current City Display
        $("#namecity").text(cityname);
        $("#tempcity").text( $currentTemp);
        $("#humcity").text( $currentHum);
        $("#windspeed").text( $currentWind);
        $("#weathericon").attr({ "src": $currentIconURL, "alt": "Current Weather Icon" });

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        // Pull Information from API for 5 Day Forecast 
        let secondQueryURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
            "&exclude=hourly&units=imperial&appid=e7c303b6206e1039548ab3f11d2207b3";
        $.ajax({
            url: secondQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let $uv = response.current.uvi;
            let $uvIndex = $("#uv-index");
            $uvIndex.text($uv);
            $uvIndex.blur();

        // Date Display on Forecast 
            let days = [];
            for (i = 1; i < 6; i++) {
                days[i] = response.daily[i].dt;
            }
            days = days.filter(item => item);
            for (i = 0; i < days.length; i++) {
                days[i] = moment.unix(days[i]);
                // Change date format 
                days[i] = days[i].format("ddd");
                $("#day" + i).text(days[i]);
            }

         // Console log days
            console.log(days);

        // High and Low Temp Display
            let highTemps = [];
            for (i = 1; i < 6; i++) {
                highTemps[i] = parseInt(response.daily[i].temp.max) + "°F";
            }
            highTemps = highTemps.filter(item => item);
            for (i = 0; i < highTemps.length; i++) {
                $("#highday" + i).text("High: " + highTemps[i]);
            }
            let lowTemps = [];
            for (i = 1; i < 6; i++) {
                lowTemps[i] = parseInt(response.daily[i].temp.min) + "°F";
            }
            lowTemps = lowTemps.filter(item => item);
            for (i = 0; i < lowTemps.length; i++) {
                $("#lowday" + i).text("Low: " + lowTemps[i]);
            }
        
        // Humidity Percentage Display
            let hums = [];
            for (i = 1; i < 6; i++) {
                hums[i] = response.daily[i].humidity + "%";
            }
            hums = hums.filter(item => item);
            for (i = 0; i < hums.length; i++) {
                $("#humday" + i).text("Humidity: " + hums[i]);
            }

            // Insert Weather Icon Image Display 
            let icons = [];
            let iconsURL = [];
            for (i = 1; i < 6; i++) {
                icons[i] = response.daily[i].weather[0].icon;
            }
            icons = icons.filter(item => item);
            for (i = 0; i < icons.length; i++) {
                iconsURL[i] = "http://openweathermap.org/img/w/" + icons[i] + ".png";
            }
            for (i = 0; i < iconsURL.length; i++) {
                $("#icon" + i).attr({ "src": iconsURL[i], "alt": "Daily Weather Icon" });
            }
        });
    });
}


// Calling on LocalStorage but if available to display 
$(document).ready(function () {
    if (localStorage.getItem("cities")) {
         historydisplay = localStorage.getItem("cities", JSON.stringify(historydisplay));
         historydisplay = JSON.parse(historydisplay);
         for (i = 0; i <= historydisplay.length - 1; i++) {
             $("#search" + i).text(historydisplay[i]);
         }
 
        //  Click event for Saved Cities
         let lastIndex = (historydisplay.length - 1);
         // concat a jQuery selector & click listener that calls savedsearch()
         $("#search" + lastIndex).on("click", savedsearch);
         $("#search" + lastIndex).trigger("click");
     }
 });
    
// Array to display the list of HISTORY
let historydisplay = [];

// Function to Load Seach In local Storage and Display on HTML page
function searchSave() {
    let newcity = (($(this).parent()).siblings("#cityenter")).val().toLowerCase();
    console.log(newcity);
    historydisplay.push(newcity);
    historydisplay = [...new Set(historydisplay)];
    localStorage.setItem("cities", JSON.stringify(historydisplay));
    for (i = 0; i <= historydisplay.length - 1; i++) {
        $("#search" + i).text(historydisplay[i]);
        $("#search" + i).addClass("past");
    }
}

// Allow User to Clear History 
let $clear = $("#clearhist");
$clear.on("click", function () {
    localStorage.clear();
    historydisplay = []
    for (i = 0; i < 11; i++) {
        $("#search" + i).text("");
    }

}); 
