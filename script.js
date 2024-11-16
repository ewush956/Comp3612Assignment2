document.addEventListener("DOMContentLoaded", () =>{
    

    let current_view = "home";

    season.addEventListener("change", () =>{

        let season = document.querySelector("#season");
        let current_season = season.value;

        current_view = change_view(current_view);

        fetchSeasonData(current_season);

    });

    /*Event Listeners for Hardcoded Elements*/

    let home_button = document.querySelector("#home_button");

    home_button.addEventListener("click", () =>{

        current_view = change_view(current_view);
        season.value = "select";

    });

    let logo = document.querySelector("#logo");

    logo.addEventListener("click", () =>{

        current_view = change_view("race");
        season.value = "select";

    });




});

/*Callback Hell (top down)*/
function fetchSeasonData(season) {

    let seasonData
    const seasonKey = `season_${season}`;
    
    const storedData = localStorage.getItem(seasonKey);

    if (storedData) {
      console.log('Data already in localStorage');
      
      seasonData = JSON.parse(storedData);

      populate_race_data(seasonData);
      race_click(seasonData);

      return;
    }
  
    const raceDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
    const qualificationDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season=${season}`;
    const resultsDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season=${season}`;
    
    seasonData = {};
    
    fetch(raceDataUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch race data');
        }
        return response.json();
      })
      .then(raceData => {
        seasonData.raceData = raceData;
        return fetch(qualificationDataUrl);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch qualification data');
        }
        return response.json();
      })
      .then(qualificationData => {
        seasonData.qualificationData = qualificationData;
        return fetch(resultsDataUrl);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch results data');
        }
        return response.json();
      })
      .then(resultsData => {
        seasonData.resultsData = resultsData;
  
        localStorage.setItem(seasonKey, JSON.stringify(seasonData));
        
        console.log(seasonData);
        populate_race_data(seasonData);
        race_click(seasonData);
      })
      .catch(error => {
        console.error('An error occurred:', error.message);
      });
  }

function race_click(seasonData){

    let race_click = document.querySelector("#race_table");

    race_click.addEventListener("click", (event) =>{

        let element = event.target;

        if(element.tagName === "TD"){

            let row = element.closest("tr");
            let race_id = row.getAttribute("data-race-id");
            
            console.log(race_id);
            
            let qual_data = filter_data(seasonData, race_id, "qual");

            populate_qaul_data(qual_data);

            let results_data = filter_data(seasonData, race_id, "results")
            
            populate_results_data(results_data);
        }


    });
    
}

/*Non-Callback Hell Functions*/
function populate_race_data(seasonData){

    const race_list = document.querySelector("#race_table");
    race_list.innerHTML = "";

    let race_header = document.querySelector("#race_header");

    race_header.textContent = `${seasonData.raceData[0].year} Races`;

    for(let race of seasonData.raceData){

        let row = document.createElement("tr");
        row.classList.add("hover:bg-gray-200", "cursor-pointer");
        row.setAttribute("data-race-id", race.id);

        let round = document.createElement("td");
        round.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        round.textContent = `${race.round}`;

        let name = document.createElement("td");
        name.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${race.name}`;

        row.appendChild(round);
        row.appendChild(name);



        race_list.appendChild(row);
        
    }

}

function populate_qaul_data(data){


    const qual_table = document.querySelector("#qual_table");

    qual_table.innerHTML = "";

    let race_info = document.querySelector("#race_info");

    /*add race info to header dynamically TODO*/

    for(let d of data){

        let row = document.createElement("tr");

        let pos = document.createElement("td");
        pos.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        pos.textContent = `${d.position}`;

        let name = document.createElement("td");
        name.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800", "hover:bg-gray-200", "cursor-pointer");
        name.textContent = `${d.driver.forename} ${d.driver.surname}`;

        let constructor = document.createElement("td");
        constructor.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800", "hover:bg-gray-200", "cursor-pointer");
        constructor.textContent = `${d.constructor.name}`;

        let q1 = document.createElement("td");
        q1.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        q1.textContent = `${d.q1}`;

        let q2 = document.createElement("td");
        q2.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        q2.textContent = `${d.q2}`;

        let q3 = document.createElement("td");
        q3.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        q3.textContent = `${d.q3}`;
        
        row.appendChild(pos);
        row.appendChild(name);
        row.appendChild(constructor);
        row.appendChild(q1);
        row.appendChild(q2);
        row.appendChild(q3);

        qual_table.appendChild(row);

    }
}

function populate_results_data(data){

    const results_table = document.querySelector("#results_table");
    const first = document.querySelector("#first");
    const second = document.querySelector("#second");
    const third = document.querySelector("#third");
    const first_box = document.querySelector("#first_box");
    const second_box = document.querySelector("#second_box");
    const third_box = document.querySelector("#third_box");

    results_table.innerHTML = "";

    first_box.classList.add("hover:bg-gray-200", "cursor-pointer");
    second_box.classList.add("hover:bg-gray-200", "cursor-pointer");
    third_box.classList.add("hover:bg-gray-200", "cursor-pointer");

    for(let d of data){

        if(d.driver.position === 1){

            first.textContent = `${data.driver.forename} ${data.driver.surname}`;

        }

        if(d.driver.position === 2){

            second.textContent = `${data.driver.forename} ${data.driver.surname}`;
            
        }

        if(d.driver.position === 3){

            third.textContent = `${data.driver.forename} ${data.driver.surname}`;
            
        }

        let row = document.createElement("tr");

        let pos = document.createElement("td");
        pos.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        pos.textContent = `${d.position}`;

        let name = document.createElement("td");
        name.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800", "hover:bg-gray-200", "cursor-pointer");
        name.textContent = `${d.driver.forename} ${d.driver.surname}`;

        let constructor = document.createElement("td");
        constructor.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800", "hover:bg-gray-200", "cursor-pointer");
        constructor.textContent = `${d.constructor.name}`;

        let laps = document.createElement("td");
        laps.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        laps.textContent = `${d.laps}`;

        let points = document.createElement("td");
        points.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        points.textContent = `${d.points}`;

        row.appendChild(pos);
        row.appendChild(name);
        row.appendChild(constructor);
        row.appendChild(laps);
        row.appendChild(points);

        results_table.appendChild(row);

    }
}

function filter_data(data, race_id, type) {

    if(type === "qual"){

        return data.qualificationData.filter(entry => entry.race.id === parseInt(race_id));

    }else if(type === "results"){

        return data.resultsData.filter(entry => entry.race.id === parseInt(race_id));
    }
    
    

}

function change_view(current_view){

    const home_view = document.querySelector("#home");
    const race_view = document.querySelector("#race");
    const buttons = document.querySelector("#nav_buttons");
    const title = document.querySelector("#title")
    const qual_table = document.querySelector("#qual_table");
    const results_table = document.querySelector("#results_table");
    const first = document.querySelector("#first");
    const second = document.querySelector("#second");
    const third = document.querySelector("#third");
    const first_box = document.querySelector("#first_box");
    const second_box = document.querySelector("#second_box");
    const third_box = document.querySelector("#third_box");

    first.textContent = "";
    second.textContent = "";
    third.textContent = "";

    qual_table.innerHTML = "";
    results_table.innerHTML = "";

    first_box.classList.remove("hover:bg-gray-200", "cursor-pointer");
    second_box.classList.remove("hover:bg-gray-200", "cursor-pointer");
    third_box.classList.remove("hover:bg-gray-200", "cursor-pointer");

    if(current_view === "home"){

        home_view.classList.add("hidden");
        title.classList.add("hidden");
        race_view.classList.remove("hidden");
        buttons.classList.remove("hidden", "lg:hidden");

        current_view = "race";

        return current_view;

    }else{

        home_view.classList.remove("hidden");
        title.classList.remove("hidden");
        race_view.classList.add("hidden");
        buttons.classList.add("hidden", "lg:hidden");

        current_view = "home";

        return current_view;

    }



}