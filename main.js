let myLineChart;
let intervalID;

function onLoad(){

    const currentDate = new Date();
    const time = currentDate.getHours();

    var coordinates = {latitude:0, coordinates:0}

    var getLocation = new Promise((resolve, reject)=>{
        if (!navigator.geolocation){
            console.log('Error, Geolocation not available')
        }
    
        function success(pos){
            coordinates.latitude = pos.coords.latitude
            coordinates.longitude = pos.coords.longitude

            const requestUrl = `https://webprojectproxyserverluigis-r.onrender.com/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
            fetch(requestUrl)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("locationName").textContent = (data.location).toUpperCase();
                    document.getElementById("dynamicTemperature").innerHTML ="<b>" + parseInt(data.temperature - 273.15, 10)+ "&#176;C</b>";
                    document.getElementById("dynamicHumidity").innerHTML ="<b>" + parseInt(data.humidity)+ "%</b>";
                })

                    function getTime(){
                        const requestUrl3 = `https://webprojectproxyserverluigis-r.onrender.com/time?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
                                fetch(requestUrl3)
                                    .then(response => response.json())
                                    .then(data=>{
                                        document.getElementById("timeZone").textContent = data.day + " " + ((data.hour >=10)?data.hour:("0"+data.hour)) + ":" + ((data.minute >=10)?data.minute:("0"+data.minute)) ;
                                    })
                    }
            intervalID = setInterval(getTime, 1000)

            const requestUrl2 = `https://webprojectproxyserverluigis-r.onrender.com/pollution?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
            fetch(requestUrl2)
                .then(response => response.json())
                .then(data => {
                    let CircularBar = document.getElementsByClassName("circular-bar");
                    let PercentValue = document.getElementsByClassName("percent");

                    let InitialValue = 0;

                    let pm10Value = data.pm10;
                    let nh3Value = data.nh3;
                    let so2Value = data.so2;

                    let finaleValue = data.pm2_5;
                    let speed = 40;

                    let timer = setInterval(() => {
                        let measure = finaleValue;
                        InitialValue += 1;
                        fillColor = "";
                        if (measure <20){fillColor="#8DE074"}
                        else if (measure <80){fillColor="#E7EA73"}
                        else if (measure <250){fillColor="#F1A92E"}
                        else if (measure <350){fillColor="#F1612E"}
                        else{fillColor="#F43E22"}

                        CircularBar.item(0).style.background = `conic-gradient(${fillColor} ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(0).innerHTML =  `PM 2.5 <br>${data.pm2_5}`;

                        if(InitialValue >= finaleValue){
                            clearInterval(timer);
                        }
                    }, speed)


                    let timerTwo = setInterval(() => {
                        let measure = pm10Value;
                        InitialValue += 1;
                        fillColor = "";
                        if (measure <20){fillColor="#8DE074"}
                        else if (measure <80){fillColor="#E7EA73"}
                        else if (measure <250){fillColor="#F1A92E"}
                        else if (measure <350){fillColor="#F1612E"}
                        else{fillColor="#F43E22"}

                        CircularBar.item(1).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(1).innerHTML =  `PM 10 <br>${data.pm10}`;

                        if(InitialValue >= pm10Value){
                            clearInterval(timerTwo);
                        }
                    }, speed)

                    let timerThree = setInterval(() => {
                        let measure = nh3Value;
                        InitialValue += 1;

                        fillColor = "";
                        if (measure <20){fillColor="#8DE074"}
                        else if (measure <80){fillColor="#E7EA73"}
                        else if (measure <250){fillColor="#F1A92E"}
                        else if (measure <350){fillColor="#F1612E"}
                        else{fillColor="#F43E22"}

                        CircularBar.item(2).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(2).innerHTML =  `NH3 <br>${data.nh3}`;

                        if(InitialValue >= nh3Value){
                            clearInterval(timerThree);
                        }
                    }, speed)

                    let timerFour = setInterval(() => {
                        let measure = so2Value;
                        InitialValue += 1;

                        fillColor = "";
                        if (measure <20){fillColor="#8DE074"}
                        else if (measure <80){fillColor="#E7EA73"}
                        else if (measure <250){fillColor="#F1A92E"}
                        else if (measure <350){fillColor="#F1612E"}
                        else{fillColor="#F43E22"}

                        CircularBar.item(3).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(3).innerHTML =  `SO2 <br>${data.so2}`;

                        if(InitialValue >= so2Value){
                            clearInterval(timerFour);
                        }
                    }, speed)
                })
        }

        const requestUrl4 = "https://webprojectproxyserverluigis-r.onrender.com/ranking";
        fetch(requestUrl4)
            .then(response => response.json())
            .then(data=>{
                document.getElementById('ranking1City').textContent = data.top[0].name;
                document.getElementById('ranking1Aqi').textContent = "AQI: " + data.top[0].aqi;

                document.getElementById('ranking2City').textContent = data.top[1].name;
                document.getElementById('ranking2Aqi').textContent = "AQI: " + data.top[1].aqi;

                document.getElementById('ranking3City').textContent = data.top[2].name;
                document.getElementById('ranking3Aqi').textContent = "AQI: " + data.top[2].aqi;

                document.getElementById('ranking4City').textContent = data.top[3].name;
                document.getElementById('ranking4Aqi').textContent = "AQI: " + data.top[3].aqi;

                document.getElementById('ranking5City').textContent = data.top[4].name;
                document.getElementById('ranking5Aqi').textContent = "AQI: " + data.top[4].aqi;
            })
    
        function error(){
            reject('Error while retrieving the location')
        }
    
        navigator.geolocation.getCurrentPosition(success, error)
    })
}

function getForecast(){
    let button = document.getElementById("temperatureTrendButton");
    graph('temperature');
    document.getElementById("forecastContainer").style.height = "150px";
    button.value = "CLOSE GRAPH";
    button.onclick = closeGraph;  
}

function graph(content){
    let location = document.getElementById('locationName').textContent;
    if (location[location.length-1] == ','){
        location = ((location.split(" "))[0]).slice(0,-1)
    }
    else{
        location = ((location.split(" "))[0])
    }
    
    const requestUrl = `https://webprojectproxyserverluigis-r.onrender.com/forecast?location=${location}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data =>{
            labels = []
            axis = []
            axisSrc = (content === 'temperature')?data.temperature:data.humidity;
            title = (content === 'temperature')?'AVG. TEMPERATURE':'AVG. HUMIDITY';
            yLabel = (content === 'temperature')?'Temperature in C':'Humidity in %';

            for(let i = 0; i<data.date.length; i++){
                labels.push(data.date[i].slice(data.date[i].length-2, data.date[i].length));
                axis.push(axisSrc[i]);
            }
            if (typeof myLineChart != undefined){
                if (myLineChart) {
                    myLineChart.destroy();
                }  
            }  

            // Creating line chart
            let ctx = document.getElementById('myLineChart').getContext('2d');
            myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: title,
                            data: axis,
                            borderColor: 'gray',
                            borderWidth: 2,
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                font: {
                                    padding: 4,
                                    size: 10,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                                color: 'black'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: yLabel,
                                font: {
                                    size: 10,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                                color: 'black'
                            },
                            beginAtZero: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Values',
                            }
                        }
                    }
                }
            });
        })    
}

function closeGraph(){
    let button = document.getElementById("temperatureTrendButton");

    document.getElementById("forecastContainer").style.height = '0px';
    button.value = "CHECK TREND";
    button.onclick = getForecast;
}

function getHumidityForecast(){
    let button = document.getElementById("humidityTrendButton");
    graph('humidity');
    document.getElementById("forecastContainer").style.height = "150px";
    button.value = "CLOSE GRAPH";
    button.onclick = closeHumidityGraph;  
}

function closeHumidityGraph(){
    let button = document.getElementById("humidityTrendButton");

    document.getElementById("forecastContainer").style.height = '0px';
    button.value = "CHECK TREND";
    button.onclick = getHumidityForecast;
}

// Get the textbox element
const textbox = document.getElementById('searchBar');

// Add an event listener for the 'keydown' event
textbox.addEventListener('keydown', function(event) {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
        // Get the value of the textbox
        const inputValue = textbox.value;

        // Display the value or use it as needed
        const requestUrl = `https://webprojectproxyserverluigis-r.onrender.com/geocoding?city=${inputValue}`;
            fetch(requestUrl)
                .then(response => response.json())
                .then(data => {
                    reLoad(data.latitude, data.longitude, data.name, data.country);
                    
                })

        // Optionally, clear the textbox
        textbox.value = '';
    }
});

function reLoad(latitude, longitude, name, country){
    clearInterval(intervalID)
    const currentDate = new Date();
    const time = currentDate.getHours();


    const requestUrl = `https://webprojectproxyserverluigis-r.onrender.com/weather?lat=${latitude}&lon=${longitude}&name=${name}&country=${country}`;

    const urlParams = new URLSearchParams(new URL(requestUrl).search);
    const locationName = urlParams.get("name");
    const countryName = urlParams.get("country");

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("locationName").textContent = (locationName +", "+ countryName).toUpperCase();
            document.getElementById("dynamicTemperature").innerHTML ="<b>" + parseInt(data.temperature - 273.15, 10)+ "&#176;C</b>";
            document.getElementById("dynamicHumidity").innerHTML ="<b>" + parseInt(data.humidity)+ "%</b>";
        })

        function getTime(){
            const requestUrl3 = `https://webprojectproxyserverluigis-r.onrender.com/time?lat=${latitude}&lon=${longitude}`;
                    fetch(requestUrl3)
                        .then(response => response.json())
                        .then(data=>{
                            document.getElementById("timeZone").textContent = data.day + " " + ((data.hour >=10)?data.hour:("0"+data.hour)) + ":" + ((data.minute >=10)?data.minute:("0"+data.minute)) ;
                        })
        }
        intervalID = setInterval(getTime, 1000)

    const requestUrl2 = `https://webprojectproxyserverluigis-r.onrender.com/pollution?lat=${latitude}&lon=${longitude}`;
    fetch(requestUrl2)
        .then(response => response.json())
        .then(data => {
            let CircularBar = document.getElementsByClassName("circular-bar");
            let PercentValue = document.getElementsByClassName("percent");

            let InitialValue = 0;

            let pm10Value = data.pm10;
            let nh3Value = data.nh3;
            let so2Value = data.so2;

            let finaleValue = data.pm2_5;
            let speed = 40;

            let timer = setInterval(() => {
                let measure = finaleValue;
                InitialValue += 1;
                fillColor = "";
                if (measure <10){fillColor="#8DE074"}
                else if (measure <25){fillColor="#E7EA73"}
                else if (measure <50){fillColor="#F1A92E"}
                else if (measure <75){fillColor="#F1612E"}
                else{fillColor="#F43E22"}

                CircularBar.item(0).style.background = `conic-gradient(${fillColor} ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                PercentValue.item(0).innerHTML =  `PM 2.5 <br>${data.pm2_5}`;

                if(InitialValue >= finaleValue){
                    clearInterval(timer);
                }
            }, speed)


            let timerTwo = setInterval(() => {
                let measure = pm10Value;
                InitialValue += 1;
                fillColor = "";
                if (measure <20){fillColor="#8DE074"}
                else if (measure <50){fillColor="#E7EA73"}
                else if (measure <100){fillColor="#F1A92E"}
                else if (measure <200){fillColor="#F1612E"}
                else{fillColor="#F43E22"}

                CircularBar.item(1).style.background = `conic-gradient(${fillColor} ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                PercentValue.item(1).innerHTML =  `PM 10 <br>${data.pm10}`;

                if(InitialValue >= pm10Value){
                    clearInterval(timerTwo);
                }
            }, speed)

            let timerThree = setInterval(() => {
                let measure = nh3Value;
                InitialValue += 1;

                fillColor = "";
                if (measure <20){fillColor="#8DE074"}
                else if (measure <50){fillColor="#E7EA73"}
                else if (measure <100){fillColor="#F1A92E"}
                else if (measure <200){fillColor="#F1612E"}
                else{fillColor="#F43E22"}

                CircularBar.item(2).style.background = `conic-gradient(${fillColor} ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                PercentValue.item(2).innerHTML =  `NH3 <br>${data.nh3}`;

                if(InitialValue >= nh3Value){
                    clearInterval(timerThree);
                }
            }, speed)

            let timerFour = setInterval(() => {
                let measure = so2Value;
                InitialValue += 1;

                fillColor = "";
                if (measure <20){fillColor="#8DE074"}
                else if (measure <80){fillColor="#E7EA73"}
                else if (measure <250){fillColor="#F1A92E"}
                else if (measure <350){fillColor="#F1612E"}
                else{fillColor="#F43E22"}

                CircularBar.item(3).style.background = `conic-gradient(${fillColor} ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                PercentValue.item(3).innerHTML =  `SO2 <br>${data.so2}`;

                if(InitialValue >= so2Value){
                    clearInterval(timerFour);
                }
            }, speed)
        })
}

function goToHome(){
    document.getElementById("Frame").src = "./home.html";
}

function goToData(){
    document.getElementById("Frame").src = "./data.html";
}

function goToAbout(){
    document.getElementById("Frame").src = "./home.html";
}



