document.addEventListener("DOMContentLoaded", () => {
    //localStorage.clear();

    let current_view = "home";

    season.addEventListener("change", () => {

        let season = document.querySelector("#season");
        let current_season = season.value;
        console.log(`current_season: ${season.value}`);

        current_view = change_view(current_view);

        fetchSeasonData(current_season);


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

    let favorites_button = document.querySelector("#favorites_button");
    favorites_button.addEventListener("click", () => setup_favorites_modal());

});

/*Callback Hell (top down)*/
function fetchSeasonData(season) {

    let season_data
    const seasonKey = `season_${season}`;

    const storedData = localStorage.getItem(seasonKey);
    if (storedData) {
        season_data = JSON.parse(storedData);

        populate_race_data(season_data);
        race_click(season_data);
        return;
    }
    change_view("loading");
    const raceDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`;
    const qualificationDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season=${season}`;
    const resultsDataUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season=${season}`;

    season_data = {};
    /*Fetch all three large data files*/
    fetch(raceDataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch race data');
            }
            return response.json();
        })
        .then(raceData => {
            season_data.raceData = raceData;
            return fetch(qualificationDataUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch qualification data');
            }
            return response.json();
        })
        .then(qualificationData => {
            season_data.qualificationData = qualificationData;
            return fetch(resultsDataUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch results data');
            }
            return response.json();
        })
        .then(resultsData => {
            season_data.resultsData = resultsData;

            localStorage.setItem(seasonKey, JSON.stringify(season_data));

            //console.log(season_data);
            //unhide
            change_view("home");
            populate_race_data(season_data, "");
            race_click(season_data);
        })
        .catch(error => {
            console.error('An error occurred:', error.message);
        });
}

function race_click(season_data) {
    let race_sort = document.querySelector("#race_head");

    let qual_sort = document.querySelector("#qual_head");

    let results_sort = document.querySelector("#results_head");
    let race_click = document.querySelector("#race_table");
    let year = season_data.raceData[0].year;
    race_sort.addEventListener("click", (event) => {

        let element = event.target;

        if (element.tagName === "TH") {

            let cell = element;
            let header = cell.textContent;

            console.log(header);

            populate_race_data(season_data, header);

        }

    });
    race_click.addEventListener("click", (event) => {

        let element = event.target;
        if (element.tagName === "TD") {

            let row = element.closest("tr");
            let race_id = row.getAttribute("data-race-id");

            console.log(race_id);
            populate_race_info(season_data, race_id);
            let qual_data = filter_data(season_data, race_id, "qual");
            //console.log(`season_data: ${season_data}`);
            //console.dir(season_data);

            populate_qaul_data(qual_data, "", year);

            qual_sort.addEventListener("click", (event) => {

                let element = event.target;

                if (element.tagName === "TH") {

                    let cell = element;
                    let header = cell.textContent;

                    console.log(header);

                    populate_qaul_data(qual_data, header, year);

                }
            });

            let results_data = filter_data(season_data, race_id, "results")

            populate_results_data(results_data, "", year);

            results_sort.addEventListener("click", (event) => {

                let element = event.target;

                if (element.tagName === "TH") {

                    let cell = element;
                    let header = cell.textContent;

                    console.log(header);

                    populate_results_data(results_data, header, year);

                }
            });
        }
    });
}
function populate_race_data(season_data, header) {

    const race_list = document.querySelector("#race_table");
    race_list.innerHTML = "";

    let race_header = document.querySelector("#race_header");

    race_header.textContent = `${season_data.raceData[0].year} Races`;

    const sorted_data = [...season_data.raceData].sort((a, b) => {
        if (header === "Name") {

            return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
        } else if (header === "Rnd") {

            return a.round - b.round;
        }
        return 0;
    });

    for (let race of sorted_data) {

        let row = document.createElement("tr");
        row.classList.add("hover:bg-gray-200", "cursor-pointer");
        row.setAttribute("data-race-id", race.id);

        let round = document.createElement("td");
        round.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        round.textContent = `${race.round}`;

        let name = document.createElement("td");
        name.classList.add("modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${race.name}`;
        addHeartIcon(name, race.id, "circuits");

        row.appendChild(round);
        row.appendChild(name);



        race_list.appendChild(row);

    }

}

function populate_qaul_data(data, header, year) {

    const qual_table = document.querySelector("#qual_table");

    qual_table.innerHTML = "";

    const sorted_data = [...data].sort((a, b) => {

        if (header === "Pos") {

            return a.position - b.position;
        } else if (header === "Driver") {

            const full_name_a = `${a.driver.forename} ${a.driver.surname}`;
            const full_name_b = `${b.driver.forename} ${b.driver.surname}`;
            return full_name_a > full_name_b ? 1 : full_name_a < full_name_b ? -1 : 0;
        } else if (header === "Const") {

            const constructor_name_a = a.constructor.name;
            const constructor_name_b = b.constructor.name;


            return constructor_name_a > constructor_name_b ? 1 : constructor_name_a < constructor_name_b ? -1 : 0;
        } else if (header === "Q1") {

            return time_to_seconds(a.q1) - time_to_seconds(b.q1);
        } else if (header === "Q2") {

            return time_to_seconds(a.q2) - time_to_seconds(b.q2);
        } else if (header === "Q3") {

            return time_to_seconds(a.q3) - time_to_seconds(b.q3);
        }
        return 0;
    });

    for (let d of sorted_data) {

        let row = document.createElement("tr");

        let pos = document.createElement("td");
        pos.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        pos.textContent = `${d.position}`;

        let name = document.createElement("td");
        name.classList.add("driver-modal", "modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${d.driver.forename} ${d.driver.surname}`;
        addHeartIcon(name, d.driver.id, "drivers");
        //name.id = d.driver.ref;
        //row.setAttribute("data-race-id", race.id);
        name.setAttribute("ref", d.driver.ref);

        let constructor = document.createElement("td");
        constructor.classList.add("constructor-modal", "modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        constructor.textContent = `${d.constructor.name}`;
        constructor.setAttribute("ref", d.constructor.ref);
        //console.log(`constructor ref: ${d.constructor.ref}`);
        addHeartIcon(constructor, d.constructor.id, "constructors");

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
    setup_driver_modal(year);
    setup_constructor_modal(year);
}

function populate_results_data(data, header, year) {

    console.log(data);
    const results_table = document.querySelector("#results_table");
    const first = document.querySelector("#first");
    const second = document.querySelector("#second");
    const third = document.querySelector("#third");
    const first_box = document.querySelector("#first_box");
    const second_box = document.querySelector("#second_box");
    const third_box = document.querySelector("#third_box");

    results_table.innerHTML = "";

    first_box.classList.add("driver-modal", "cursor-pointer");
    second_box.classList.add("driver-modal", "cursor-pointer");
    third_box.classList.add("driver-modal", "cursor-pointer");

    const sorted_data = [...data].sort((a, b) => {
        if (header === "Pos") {

            return a.position - b.position;
        } else if (header === "Driver") {

            const full_name_a = `${a.driver.forename} ${a.driver.surname}`;
            const full_name_b = `${b.driver.forename} ${b.driver.surname}`;


            return full_name_a > full_name_b ? 1 : full_name_a < full_name_b ? -1 : 0;
        } else if (header === "Const") {

            const constructor_name_a = a.constructor.name;
            const constructor_name_b = b.constructor.name;


            return constructor_name_a > constructor_name_b ? 1 : constructor_name_a < constructor_name_b ? -1 : 0;
        } else if (header === "Laps") {

            return b.laps - a.laps;
        } else if (header = "Pts") {

            return b.points - a.points;
        }
        return 0;
    });

    for (let d of sorted_data) {

        if (d.position === 1) {

            first.textContent = `${d.driver.forename} ${d.driver.surname}`;
            first_box.setAttribute("ref", d.driver.ref);
            addHeartIcon(first, d.driver.id, "drivers");

        }

        if (d.position === 2) {

            second.textContent = `${d.driver.forename} ${d.driver.surname}`;
            second_box.setAttribute("ref", d.driver.ref);
            addHeartIcon(second, d.driver.id, "drivers");
        }

        if (d.position === 3) {

            third.textContent = `${d.driver.forename} ${d.driver.surname}`;
            third_box.setAttribute("ref", d.driver.ref);
            addHeartIcon(third, d.driver.id, "drivers");
        }

        let row = document.createElement("tr");

        let pos = document.createElement("td");
        pos.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        pos.textContent = `${d.position}`;

        let driver = document.createElement("td");
        driver.classList.add("driver-modal", "px-4", "py-2", "border-b", "text-sm", "text-gray-800", "modal-hover", "cursor-pointer");
        driver.textContent = `${d.driver.forename} ${d.driver.surname}`;
        driver.setAttribute("ref", d.driver.ref);
        addHeartIcon(driver, d.driver.id, "drivers");


        let constructor = document.createElement("td");
        constructor.classList.add("constructor-modal", "px-4", "py-2", "border-b", "text-sm", "text-gray-800", "modal-hover");
        constructor.textContent = `${d.constructor.name}`;
        constructor.setAttribute("ref", d.constructor.ref);
        addHeartIcon(constructor, d.constructor.id, "constructors");

        let laps = document.createElement("td");
        laps.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        laps.textContent = `${d.laps}`;

        let points = document.createElement("td");
        points.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        points.textContent = `${d.points}`;

        row.appendChild(pos);
        row.appendChild(driver);
        row.appendChild(constructor);
        row.appendChild(laps);
        row.appendChild(points);

        results_table.appendChild(row);

    }
    setup_driver_modal(year);
    setup_constructor_modal(year);
}
function populate_race_info(data, race_id) {

    let race = data.raceData.find(race => race.id === parseInt(race_id));
    //console.log("race: ");
    //console.dir(race);
    //console.log(race_id);
    //let race_id = race.id;
    let race_info = document.querySelector("#race_info");
    let round_info = document.querySelector("#round_info");
    let circuit_info = document.querySelector("#circuit_info");
    let circuit_name = document.querySelector("#circuit_name");
    let date_info = document.querySelector("#date_info");
    let race_url = document.querySelector("#race_url")

    race_info.textContent = `Results for the ${race.year} ${race.name}`;

    round_info.textContent = `Round: ${race.round} `;

    circuit_info.textContent = `Circuit: `;
    circuit_name.textContent = `${race.circuit.name} `
    circuit_name.classList.add("circuit-modal", "cursor-pointer", "underline");

    date_info.textContent = `Date: ${race.date} `;

    race_url.textContent = "See More";

    race_url.href = race.url;

    race_url.classList.add("cursor-pointer", "underline");
    setup_circuit_modal(race);
}

function filter_data(data, race_id, type) {

    if (type === "qual") {

        return data.qualificationData.filter(entry => entry.race.id === parseInt(race_id));

    } else if (type === "results") {

        return data.resultsData.filter(entry => entry.race.id === parseInt(race_id));
    }
}
function time_to_seconds(time_string) {

    if (time_string === "") {

        return;
    } else {

        const [minutes, seconds] = time_string.split(':');
        const [sec, ms] = seconds.split('.');
        const total_seconds = parseInt(minutes) * 60 + parseInt(sec);
        const milliseconds = ms ? parseInt(ms) : 0;

        return total_seconds + milliseconds / 1000;
    }

}
function change_view(current_view) {

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
    const loading_view = document.querySelector("#loading");
    let toasters = document.querySelector(".toaster");
    let modals = document.querySelector("dialog");

    first.textContent = "";
    second.textContent = "";
    third.textContent = "";

    qual_table.innerHTML = "";
    results_table.innerHTML = "";

    first_box.classList.remove("hover:bg-gray-200", "cursor-pointer");
    second_box.classList.remove("hover:bg-gray-200", "cursor-pointer");
    third_box.classList.remove("hover:bg-gray-200", "cursor-pointer");

    if (current_view === "home") {

        home_view.classList.add("hidden");
        title.classList.add("hidden");
        race_view.classList.remove("hidden");
        buttons.classList.remove("hidden", "lg:hidden");
        toasters.classList.add("hidden");
        loading_view.classList.add("hidden");

        current_view = "race";

        return current_view;
    }
    else if (current_view === "loading") {

        home_view.classList.add("hidden");
        race_view.classList.add("hidden");
        title.classList.add("hidden");
        loading_view.classList.remove("hidden");

        //doesn't change view until data is loaded
        return "loading";

    } else {

        home_view.classList.remove("hidden");
        title.classList.remove("hidden");
        race_view.classList.add("hidden");
        buttons.classList.add("hidden", "lg:hidden");
        loading_view.classList.add("hidden");

        current_view = "home";

        return current_view;

    }

}
function handleAddToFavorites(item, type) {
    console.log('handleAddToFavorites');
    console.log('item:');
    console.dir(item);
    let favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    let item_check = favorites[type][item.id] || favorites[type][item.driverId] || favorites[type][item.constructorId];
    if (!item_check) {
        if (type == "drivers") {
            favorites[type][item.driverId] = `${item.forename} ${item.surname}`;
            showHeartIcon(document.querySelectorAll(`[ref="${item.driverRef}"]`));
        }
        else if (type == "constructors") {
            favorites[type][item.constructorId] = item.name;
            showHeartIcon(document.querySelectorAll(`[ref="${item.constructorRef}"]`));
        }
        else if (type == "circuits") {
            favorites[type][item.id] = item.name;
            showHeartIcon(document.querySelectorAll(`[ref="${item.ref}"]`));
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('Added to favorites');
        showToaster(type, "add");
    }
    else {
        console.log('Already in favorites');
        showToaster(type, "dontAdd");
    }



}
function setup_favorites_modal() {

    const favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    const favoritesButton = document.querySelector('#favorites_button');
    const modal = document.querySelector('#favoritesModal');
    const closeModal = document.querySelector('#closeFavoritesModal');
    const emptyFavoritesButton = document.querySelector('#emptyFavorites');

    populateFavoritesTable(favorites.drivers, 'drivers', '#favorites_drivers_table');
    populateFavoritesTable(favorites.constructors, 'constructors', '#favorites_constructors_table');
    populateFavoritesTable(favorites.circuits, 'circuits', '#favorites_circuits_table');

    //console.log("favorites:");
    //console.dir(favorites);
    handle_modal(modal, closeModal);
    emptyFavoritesButton.addEventListener('click', () => {
        console.log('clicked Empty favorites');
        localStorage.removeItem('favorites');
        populateFavoritesTable({}, 'drivers', '#favorites_drivers_table');
        populateFavoritesTable({}, 'constructors', '#favorites_constructors_table');
        populateFavoritesTable({}, 'circuits', '#favorites_circuits_table');

        let cells = document.querySelectorAll('.heart-icon');
        cells.forEach(cell => {
            cell.classList.add('hidden');
        });
    });
}
function populateFavoritesTable(favorites, type, tableId) {
    const table = document.querySelector(tableId);
    //console.log('populateFavoritesTable');
    //console.dir(favorites);
    table.innerHTML = '';

    for (let id in favorites) {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.classList.add('py-3', 'px-6', 'border-b');
        cell.textContent = favorites[id];
        row.appendChild(cell);
        table.appendChild(row);
    }
}
function setup_circuit_modal(race) {
    //console.log('setup_circuit_modal');
    const circuitName = document.querySelector('.circuit-modal');
    circuitName.addEventListener('click', () => {
        //console.log('race:');
        //console.dir(race);
        let circuitModal = document.querySelector('#circuitModal');
        let closeModalButton = document.querySelector('#closeCircuitModal');

        document.querySelector('#circuitName').textContent = race.circuit.name;
        document.querySelector('#circuitLocation').textContent = race.circuit.location;
        document.querySelector('#circuitCountry').textContent = race.circuit.country;
        document.querySelector('#circuitUrl').href = race.circuit.url;
        document.querySelector('#circuitUrl').textContent = "Wikipedia";
        document.querySelector('#circuitImage').src = `images/circuit_placeholder.jpg`;
        document.querySelector('#driverImage').src = `images/driver_placeholder.png`;

        handle_modal(circuitModal, closeModalButton);
        let addToFavButton = document.querySelector('#addCircuitToFav');
        //addToFavButton.addEventListener('click', () => handleAddToFavorites(race.circuit, "circuits"));
        let newButton = addToFavButton.cloneNode(true);
        addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
        newButton.addEventListener('click', () => handleAddToFavorites(race.circuit, "circuits"));
    });
}
function setup_constructor_modal(year) {
    //console.log("setup_constructor_modal");
    const rows = document.querySelectorAll(".constructor-modal");
    //console.log("rows:");
    //console.dir(rows);
    rows.forEach(row => {
        row.addEventListener("click", () => {
            let constructorModal = document.querySelector('#constructorModal');
            let closeModalButton = document.querySelector('#closeModal');
            let constructor_ref = row.getAttribute("ref");
            console.log(`constructor_ref: ${constructor_ref}`);
            fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=${constructor_ref}`)
                .then(response => response.json())
                .then(constructor => {
                    document.querySelector('#constructorName').textContent = constructor.name;
                    document.querySelector('#constructorNationality').textContent = constructor.nationality;
                    document.querySelector('#constructorUrl').href = constructor.url;
                    document.querySelector('#constructorUrl').textContent = "Wikipedia";
                    document.querySelector('#constructorUrl').href = constructor.url;

                    populate_constructor_table(constructor_ref, year);
                    handle_modal(constructorModal, closeModalButton);

                    let addToFavButton = document.querySelector('.addToFavorites');

                    let newButton = addToFavButton.cloneNode(true);
                    addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
                    newButton.addEventListener('click', () => handleAddToFavorites(constructor, "constructors"));
                })
                .catch(error => console.error('Error fetching constructor data:', error));
        });
    });
}
function populate_constructor_table(constructor_ref, season) {
    fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructor_ref}&season=${season}`)
        .then(response => response.json())
        .then(matchingConstructors => {

            let raceResultsTable = document.querySelector('#race_results_table');
            raceResultsTable.innerHTML = '';

            matchingConstructors.forEach(item => {
                let row = document.createElement('tr');

                let roundCell = document.createElement('td');
                roundCell.classList.add('py-3', 'px-6', 'border-b');
                roundCell.textContent = item.round;

                let nameCell = document.createElement('td');
                nameCell.classList.add('py-3', 'px-6', 'border-b');
                nameCell.textContent = item.name;

                let driverCell = document.createElement('td');
                driverCell.classList.add('py-3', 'px-6', 'border-b');
                driverCell.textContent = `${item.forename} ${item.surname}`;

                let posCell = document.createElement('td');
                posCell.classList.add('modal-hover', 'py-3', 'px-6', 'border-b');
                posCell.textContent = item.positionOrder;

                row.appendChild(roundCell);
                row.appendChild(nameCell);
                row.appendChild(driverCell);
                row.appendChild(posCell);

                raceResultsTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching constructor data:', error));
}
function setup_driver_modal(current_season) {
    //console.log("setup_driver_modal");
    const rows = document.querySelectorAll(".driver-modal");
    //console.log("rows:");
    //console.dir(rows);
    rows.forEach(row => {
        row.addEventListener("click", () => {

            let driverModal = document.querySelector('#driverModal');
            let closeModalButton = document.querySelector('#closeDriverModal');
            let driver_ref = row.getAttribute("ref");

            fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=${driver_ref}`)
                .then(response => response.json())
                .then(driver => {

                    document.querySelector('#driverName').textContent = `${driver.forename} ${driver.surname}`;
                    document.querySelector('#DOB').textContent = driver.dob;
                    document.querySelector('#driverAge').textContent = calculate_age(driver.dob);
                    document.querySelector('#driverNationality').textContent = driver.nationality;
                    document.querySelector('#driverUrl').href = driver.url;
                    document.querySelector('#driverUrl').textContent = "Wikipedia";
                    document.querySelector('#driverUrl').href = driver.url;
                    document.querySelector('#driverImage').src = `images/driver_placeholder.png`;

                    populate_driver_table(driver_ref, current_season);

                    handle_modal(driverModal, closeModalButton);

                    let addToFavButton = document.querySelector('#addDriverToFav');
                    let newButton = addToFavButton.cloneNode(true);
                    addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
                    newButton.addEventListener('click', () => handleAddToFavorites(driver, "drivers"));
                })
                .catch(error => console.error('Error fetching driver data:', error));
        });
    });
}
function populate_driver_table(driver_ref, season) {
    console.log(`driver_ref: ${driver_ref}, season: ${season}`);
    fetch(`http://www.randyconnolly.com/funwebdev/3rd/api/f1/driverResults.php?driver=${driver_ref}&season=${season}`)
        .then(response => response.json())
        .then(matchingDrivers => {

            const seasonKey = `season_${season}`;
            const storedData = JSON.parse(localStorage.getItem(seasonKey));
            //console.log('storedData:');
            //console.dir(storedData);
            const resultsData = storedData ? storedData.resultsData : [];

            let driverResultsTable = document.querySelector('#driver_results_table');
            driverResultsTable.innerHTML = ''; // Clear existing results
            let driverImage = document.querySelector('#driverImage');
            driverImage.src = "images/driver_placeholder.png";
            //console.log('matchingDrivers:');
            //console.dir(matchingDrivers);
            matchingDrivers.forEach(item => {

                const row = document.createElement('tr');
                const result = resultsData.find(result => result.id === item.resultId);

                const roundCell = document.createElement('td');
                roundCell.classList.add('py-3', 'px-6', 'border-b');
                roundCell.textContent = item.round;

                const nameCell = document.createElement('td');
                nameCell.classList.add('py-3', 'px-6', 'border-b', 'whitespace-nowrap');
                nameCell.textContent = item.name;
                //console.log('item:');
                //console.dir(item);

                const posCell = document.createElement('td');
                posCell.classList.add('py-3', 'px-6', 'border-b');
                posCell.textContent = result.position;

                const pointsCell = document.createElement('td');
                const points = result.points;
                pointsCell.classList.add('py-3', 'px-6', 'border-b');
                pointsCell.textContent = resultsData
                pointsCell.textContent = points;

                row.appendChild(roundCell);
                row.appendChild(nameCell);
                row.appendChild(posCell);
                row.appendChild(pointsCell);

                driverResultsTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching driver data:', error));
}
function handle_modal(modal, closeModalButton) {

    let currentModal = modal.id;

    console.log('handle_modal');
    modal.showModal();
    document.body.classList.add('modal-open');
    modal.classList.remove('hidden');

    let wrapper = document.querySelector(`.${currentModal}`);

    wrapper.classList.remove('hidden');

    closeModalButton.addEventListener('click', () => {
        modal.close();
        document.body.classList.remove('modal-open');
        modal.classList.add('hidden');
        wrapper.classList.add('hidden');
    });

    modal.addEventListener('close', () => {
        document.body.classList.remove('modal-open');
        modal.classList.add('hidden');
        wrapper.classList.add('hidden');
    });
}
function showToaster(type, added) {


    const toaster = document.querySelectorAll('.toaster');

    if (type === "constructors") {
        if (added === "add") {
            toaster[0].textContent = "Added to favorites!";
        } else {
            toaster[0].textContent = "Already in favorites!";
        }
        toaster[0].classList.remove('hidden')
        toaster[0].classList.add('show');
        setTimeout(() => {
            toaster[0].classList.remove('show');
        }, 2000); // Adjust the timeout duration as needed

    } else if (type === "drivers") {
        if (added === "add") {
            toaster[1].textContent = "Added to favorites!";
        } else {
            toaster[1].textContent = "Already in favorites!";
        }

        toaster[1].classList.remove('hidden')
        toaster[1].classList.add('show');
        setTimeout(() => {
            toaster[1].classList.remove('show');
        }, 2000); // Adjust the timeout duration as needed


    } else {
        if (added === "add") {
            toaster[2].textContent = "Added to favorites!";
        } else {
            toaster[2].textContent = "Already in favorites!";
        }

        toaster[2].classList.remove('hidden')
        toaster[2].classList.add('show');
        setTimeout(() => {
            toaster[2].classList.remove('show');
        }, 2000); // Adjust the timeout duration as needed

    }

}
//Make a helper function that calculates the age of a driver
function calculate_age(dob) {
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function addHeartIcon(cell, id, type) {
    //console.log('addHeartIcon');
    //console.dir(cell);
    const heartIcon = document.createElement('img');
    heartIcon.src = 'images/heart_icon.png'; // Path to the heart
    heartIcon.classList.add('heart-icon', 'hidden');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    if (favorites[type] && favorites[type][id]) {
        heartIcon.classList.remove('hidden'); // Remove 'hidden' class if item is in favorites
    }
    //heartIcon.setAttribute('hidden', ''); // Hide the heart icon by default
    cell.appendChild(heartIcon);
    //console.log('added heart icon');
    //console.dir(cell);
}



//works but slow af
/*
function addHeartIcon(cell, id, type) {
    // Wrap the existing cell content and heart icon in a container div
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr auto'; // Two columns: text and heart icon
    container.style.alignItems = 'center';

    // Move the existing text content into the container
    const textSpan = document.createElement('span');
    textSpan.textContent = cell.textContent; // Copy the current text
    cell.textContent = ''; // Clear the original cell content
    container.appendChild(textSpan);

    // Create the heart icon
    const heartIcon = document.createElement('img');
    heartIcon.src = 'images/heart_icon.png'; // Path to the heart icon
    heartIcon.classList.add('heart-icon', 'hidden');
    //heartIcon.style.width = '20px'; // Set a fixed size
    //heartIcon.style.height = '20px';

    // Check if the item is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    if (favorites[type] && favorites[type][id]) {
        heartIcon.classList.remove('hidden'); // Show heart icon if in favorites
    }

    container.appendChild(heartIcon);

    cell.appendChild(container);
}
*/
function showHeartIcon(cells) {
    cells.forEach(cell => {
        const heartIcon = cell.querySelector('.heart-icon');
        //console.log('showHeartIcon');
        //console.dir(heartIcon);
        if (heartIcon) {
            heartIcon.classList.remove('hidden');
        }
    });
}

function hideHeartIcon(cell) {
    const heartIcon = cell.querySelector('.heart-icon');
    if (heartIcon) {
        heartIcon.classList.add('hidden');
    }
}
