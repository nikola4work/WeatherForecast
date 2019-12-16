$(document).ready(function() {
    //click listeners to activate the functions and Calls
    $("#search-btn").click(weatherNow);
    $("#search-btn").click(fiveDayForecast);
    $("#cityList").click(weatherNow);
    $("#cityList").click(fiveDayForecast);

    var userInput;
    var time = moment().format("LL");
    var myKey = "12be9dca0b918a1415beaa5a35fab8fd";
    $(".figure").css("display", "none");
    // $("#search-container").css("left", "320px");
    $(".ul-container").css("display", "none");

    //Function to call current weather
    function weatherNow(event) {
        event.preventDefault();
        //will target the value of the user userInput or the saved list
        if ($(this).attr("id") === "cityList") {
            let x = event.target;
            userInput = $(x).text();
            console.log(userInput);
        } else {
            userInput = $(this)
                .prev()
                .val(); //getting value of user input
        }
        $(".figure").empty();
        //empty search results upon each new search
        $("#search-container").animate({ left: "10px" }, 600);
        $("#search-container").animate({ top: "10px" }, 600);
        $(".ul-container").css("display", "flex");
        var queryURL =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            userInput +
            "&APPID=" +
            myKey;
        //calling the API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            $(".figure").css("display", "block");
            //setting the values to a new DOM element
            var city = $("<h1>")
                .addClass("city-name")
                .text(`City: ${response.name}`);
            var date = $("<h3>")
                .addClass("date")
                .text(`Date: ${time}`);
            var iconImage = $("<img>")
                .addClass("icon-image")
                .attr(
                    "src",
                    "https://openweathermap.org/img/w/" +
                    response.weather[0].icon +
                    ".png"
                );
            var tempF = parseInt((response.main.temp - 273.15) * 1.8 + 32); //kelvin to farenheight Conversion
            var temperature = $("<h4>")
                .addClass("current-temp")
                .text(`Current Temperature: ${tempF} F°`);
            var humidity = $("<h4>")
                .addClass("humidity")
                .text(`Humidity: ${response.main.humidity}%`);
            var windSpeed = $("<h4>")
                .addClass("wind-speed")
                .text(`Wind Speed: ${response.wind.speed} mph`);
            //Appending the values to the figure box
            $(".figure").append(
                city,
                iconImage,
                date,
                temperature,
                humidity,
                windSpeed
            );
        });
    }
    //end current day call begin Five day forecast call
    function fiveDayForecast() {
        if ($(this).attr("id") === "cityList") {
            let x = event.target;
            userInput = $(x).text();
            console.log(userInput);
        } else {
            userInput = $(this)
                .prev()
                .val(); //getting value of user input
        }
        var dayDisplay = 1;
        var fiveDayCall =
            "http://api.openweathermap.org/data/2.5/forecast?q=" +
            userInput +
            "&APPID=" +
            myKey;
        //calling the 5 day forecast
        $.ajax({
            url: fiveDayCall,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var listArray = response.list;
            listArray.forEach(element => {
                //use for each method to loop through object list
                //   console.log(element);
                var yearDateTime = element.dt_txt;
                //    console.log (yearDatetime);
                var currentDate = yearDateTime.split(" ")[0]; //splitting the full date
                var currentTime = yearDateTime.split(" ")[1]; //and time  in the object

                //getting a specific time of day to pull data from and insert inot the DOM
                if (currentTime === "15:00:00") {
                    var day = currentDate.split("-")[2];
                    var month = currentDate.split("-")[1];
                    var year = currentDate.split("-")[0];
                    $("#day-" + dayDisplay)
                        .children(".date-display")
                        .html(`${month}/${day}/${year}`);
                    $("#day-" + dayDisplay)
                        .children("#daily-icon")
                        .attr(
                            "src",
                            "http://openweathermap.org/img/w/" +
                            element.weather[0].icon +
                            ".png"
                        );
                    $("#day-" + dayDisplay)
                        .children("#daily-temp")
                        .html(
                            `Temperature: ${parseInt(
                (element.main.temp - 273.15) * 1.8 + 32
              )}°F`
                        );
                    $("#day-" + dayDisplay)
                        .children("#5day-humidity")
                        .html(`Humidity: ${element.main.humidity}% `);
                    dayDisplay++;
                }
            });
        });
    }

    // local storage
    var ul = $("#cityList");
    var itemsArray = localStorage.getItem("items") ?
        JSON.parse(localStorage.getItem("items")) :
        [];
    var data = JSON.parse(localStorage.getItem("items"));

    var liMaker = text => {
        var li = $("<li>").addClass("created-city btn btn-light");
        li.text(text);
        ul.prepend(li);
    };

    // search city button
    $("#search-btn").click(function() {
        itemsArray.push(userInput);
        localStorage.setItem("items", JSON.stringify(itemsArray));
        liMaker(userInput);
        $(".title").remove();
        $("#main-figure").animate({ top: "10px" }, 600);
    });

    data.forEach(item => {
        liMaker(item);
        console.log(item);
        $("#main-figure").animate({ top: "10px" }, 600);
    });

    // clear button
    $(".clr-btn").on("click", function() {
        $(".created-city").remove();
        localStorage.clear();
        $("input").empty();
        $("#cityList").empty();
    });

    // remove title when local storage is city is clicked
    $(".created-city").click(function() {
        $(".title").remove();
    });
});