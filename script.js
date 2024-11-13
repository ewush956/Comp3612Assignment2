document.addEventListener("DOMContentLoaded", () =>{
    
    let season = document.querySelector("#season");
    let home_button = document.querySelector("#home_button");
    let current_season;
    let current_view = "home";

    season.addEventListener("change", () =>{

        current_season = season.value;

        current_view = change_view(current_view);

        let stored_data = localStorage.getItem(`${current_season}RaceData`);

        if(stored_data){

            const race_data = JSON.parse(stored_data);

            console.log(race_data);

            process_race_data(race_data);

        }else{

            fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${current_season}`)
            .then(response => response.json())
            .then(data =>{

                localStorage.setItem(`${current_season}RaceData`, JSON.stringify(data));

                console.log(data);
                process_race_data(data);


            })
            .catch(error =>{

            });

        }


    });

    home_button.addEventListener("click", () =>{

        current_view = change_view(current_view);
        season.value = "select";

    });




});

/*Function Definitions*/
function process_race_data(data){

    const race_list = document.querySelector("#race_table");
    race_list.innerHTML = "";

    for(let race of data){

        let row = document.createElement("tr");
        row.classList.add("hover:bg-gray-200", "cursor-pointer");

        let name = document.createElement("td");
        name.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${race.name}`;

        let td_button = document.createElement("td");
        td_button.classList.add("px-4", "py-2", "border-b", "text-sm");

        let button = document.createElement("button");
        button.classList.add("px-4", "py-2", "bg-red-700", "text-white", "rounded-lg", "hover:bg-red-800", "transition-all", "focus:outline-none");
        button.textContent = "Results";
        td_button.appendChild(button);

        row.appendChild(name);
        row.appendChild(td_button);


        race_list.appendChild(row);
        
    }

};

function change_view(current_view){

    let home_view = document.querySelector("#home");
    let race_view = document.querySelector("#race");
    let buttons = document.querySelector("#nav_buttons");

    if(current_view === "home"){

        home_view.classList.add("hidden");
        race_view.classList.remove("hidden");
        buttons.classList.remove("hidden");

        current_view = "race";

        return current_view;

    }else{

        home_view.classList.remove("hidden");
        race_view.classList.add("hidden");
        buttons.classList.add("hidden");

        current_view = "home";

        return current_view;

    }



};