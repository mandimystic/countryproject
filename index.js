
const form = document.querySelector("#input-form");
const inputCountry = document.querySelector("#input-country");
const countryInfo = document.querySelector("#country-info");
const loader = document.querySelector("#loader");


let countries = []

const getWeatherData  = async (lat,lon) => {

    try{
        const apiKey = "c6af386868bc900725630416741f35eb";
        const response = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)).json();
        
        return response;

    }catch(e){
        console.log(e);
    }

}



const getCountries = async () => {

try {
    
    inputCountry.style.display = "none"


    const response = await (await fetch(`https://restcountries.com/v3.1/all`)).json();
    countries = response; 

    if (response){
        loader.style.display = "none";
        inputCountry.style.display = "flex"
    }

} catch (error) {
    console.log(error);

}};


getCountries();


inputCountry.addEventListener("input", async (e) =>{

    e.preventDefault ();

    if(inputCountry.value == ""){
        countryInfo.innerHTML = "";
        return;
    }

    const filteredCountries = countries.filter(country => country.name.common.toUpperCase().startsWith(inputCountry.value.toUpperCase()));
    console.log(filteredCountries);


    let except = false;

    if(filteredCountries.length > 10){
        countryInfo.innerHTML = "<h2>Se mas especifico</h2>"
        return;

    }else if(filteredCountries.length >=3){
        except = true;

    }


    const countryListInnerHtml = [];


    for (let index = 0; index < filteredCountries.length; index++) {

        const country = filteredCountries[index];

        const flagImage = country.flags.png;
        const name = country.name.common;
        const capital =  country["capital"] == undefined ? "" : country.capital[0];
        const population = country.population;
        const continent = country.continents[0];    
        const lat = country.latlng[0];
        const lon = country.latlng[1];

        let htmlToRepeat = "";

        if(except){
            htmlToRepeat = `<img src="${flagImage}" id="imagen" alt="">
            <p class="info"> País: <span class="infospan">${name}</span></p><br><br>`;

        }else{
            
            const weatherResponse = await getWeatherData(lat,lon);
            const temperature = weatherResponse.main.temp;
            const currentWeather = weatherResponse.weather[0].description;

            htmlToRepeat = `
            <img src="${flagImage}" id="imagen" alt="">
            <p class="info"> País: <span class="infospan">${name}</span></p>
            <p class="info"> Capital: <span class="infospan">${capital}</span></p>
            <p class="info"> # Habitantes: <span class="infospan">${population}</span></p>
            <p class="info"> Continen <span class="infospan">${continent}</span></p>
            <p class="info"> Temperatura actual: <span class="infospan">${temperature}</span></p>
            <p class="info"> Clima actual: <span class="infospan">${currentWeather}</span></p><br><br>`;
        }


        countryListInnerHtml.push(htmlToRepeat);

    }

    countryInfo.innerHTML = countryListInnerHtml.join("");


});