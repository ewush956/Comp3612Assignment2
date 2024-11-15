document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear();
    let season = document.querySelector("#season");
    let current_season;
    let current_view = "home";

    season.addEventListener("change", () => {

        current_season = season.value;

        current_view = change_view(current_view);

        process_race_data(current_season);


    });
    /*Event Listeners for Hardcoded Elements*/

    let home_button = document.querySelector("#home_button");

    home_button.addEventListener("click", () => {

        current_view = change_view(current_view);
        season.value = "select";

    });

    let logo = document.querySelector("#logo");

    logo.addEventListener("click", () => {

        current_view = change_view("race");
        season.value = "select";

    });

});

/*Callback Hell (top down)*/

function process_race_data(current_season) {

    let stored_data = localStorage.getItem(`${current_season}RaceData`);

    if (stored_data) {

        const race_data = JSON.parse(stored_data);

        console.log(race_data);

        populate_race_data(race_data, current_season);

        race_click(race_data);



    } else {

        fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${current_season}`)
            .then(response => response.json())
            .then(data => {

                localStorage.setItem(`${current_season}RaceData`, JSON.stringify(data));

                console.log(data);
                populate_race_data(data, current_season);

                race_click(data);
                setup_constructor_modal();


            })
            .catch(error => {

            });

    }
}

function race_click(race_data) {

    let race_click = document.querySelector("#race_table");

    race_click.addEventListener("click", (event) => {

        let element = event.target;

        if (element.tagName === "TD") {

            let row = element.closest("tr");
            let race_id = row.getAttribute("data-race-id");

            console.log(race_id);

            fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${race_id}`)
                .then(response => response.json())
                .then(data => {


                    console.log(data);

                    populate_qaul_data(data);
                    //setup_constructor_modal();


                })
                .catch(error => {

                });

        }
        //setup_constructor_modal();


    });

}

/*Non-Callback Hell Functions*/
function populate_race_data(data, current_season) {

    const race_list = document.querySelector("#race_table");
    race_list.innerHTML = "";
    let round_temp = 1;

    let race_header = document.querySelector("#race_header");

    race_header.textContent = `${current_season} Races`;

    for (let race of data) {

        let row = document.createElement("tr");
        row.classList.add("hover:bg-gray-200", "cursor-pointer");
        row.setAttribute("data-race-id", race.id);

        let round = document.createElement("td");
        round.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        round.textContent = `${round_temp}`;
        round_temp++;

        let name = document.createElement("td");
        name.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${race.name}`;

        row.appendChild(round);
        row.appendChild(name);



        race_list.appendChild(row);

    }

};

function populate_qaul_data(data) {

    const qual_table = document.querySelector("#qual_table");

    qual_table.innerHTML = "";

    let race_info = document.querySelector("#race_info");

    /*add race info to header dynamically TODO*/

    for (let d of data) {

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
        constructor.setAttribute("id", `constructor-modal`);

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
        setup_constructor_modal();

    }
}

function change_view(current_view) {

    let home_view = document.querySelector("#home");
    let race_view = document.querySelector("#race");
    let buttons = document.querySelector("#nav_buttons");
    let qual_table = document.querySelector("#qual_table");

    qual_table.innerHTML = "";

    if (current_view === "home") {

        home_view.classList.add("hidden");
        race_view.classList.remove("hidden");
        buttons.classList.remove("hidden");

        current_view = "race";

        return current_view;

    } else {

        home_view.classList.remove("hidden");
        race_view.classList.add("hidden");
        buttons.classList.add("hidden");

        current_view = "home";

        return current_view;

    }



}
function setup_constructor_modal() {

    const rows = document.querySelectorAll("#constructor-modal");
    console.log(rows);
    rows.forEach(row => {
        row.addEventListener("click", () => {
            console.log("click");
            let constructorModal = document.querySelector('#constructorModal');
            let closeModalButton = document.querySelector('#closeModal');
            constructorModal.showModal();
            closeModalButton.addEventListener('click', () => {
                constructorModal.close();
            });
        });
    });
}