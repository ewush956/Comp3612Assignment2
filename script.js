/**
 * Initializes the application once the DOM content is fully loaded.
 *
 * This function sets up event listeners for various elements such as the season dropdown, home button, logo, and favorites button.
 * It handles changing views, fetching season data, and setting up the favorites modal.
 */
document.addEventListener("DOMContentLoaded", () => {

    let currentView = "home";
    season.addEventListener("change", () => {

        let season = document.querySelector("#season");
        let currentSeason = season.value;

        currentView = changeView(currentView);
        fetchSeasonData(currentSeason);
    });
    let homeButton = document.querySelector("#homeButton");

    homeButton.addEventListener("click", () => {

        currentView = changeView(currentView);
        season.value = "select";

    });
    let logo = document.querySelector("#logo");

    logo.addEventListener("click", () => {

        currentView = changeView("race");
        season.value = "select";

    });
    let favoritesButton = document.querySelector("#favoritesButton");
    favoritesButton.addEventListener("click", () => setupFavoritesModal());
});
/**
 * Fetches and processes season data for a given year.
 *
 * This function checks if the season data is already stored in local storage. If it is, it uses the stored data.
 * If not, it fetches the race, qualification, and results data from the API, stores it in local storage, and processes it.
 * The function also handles changing the view to a loading state while fetching data and then to the home view once data is fetched.
 *
 * @param {number} season - The year of the race season to fetch data for.
 */
function fetchSeasonData(season) {

    let seasonData
    const seasonKey = `season_${season}`;
    const storedData = localStorage.getItem(seasonKey);

    if (storedData) {
        seasonData = JSON.parse(storedData);

        populateRaceData(seasonData);
        raceClick(seasonData);
        return;
    }
    changeView("loading");
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
            changeView("home");
            populateRaceData(seasonData, "");
            raceClick(seasonData);
        })
        .catch(error => {
            console.error('An error occurred:', error.message);
        });
}
/**
 * Sets up event listeners for sorting and clicking on race data.
 *
 * This function adds event listeners to handle sorting of race, qualification, and results data tables.
 * It also sets up event listeners for clicking on race rows to populate race information, qualification data, and results data.
 *
 * @param {Object} seasonData - The data object containing race information for the season.
 */
function raceClick(seasonData) {

    let raceSort = document.querySelector("#raceHead");
    let qualSort = document.querySelector("#qualHead");
    let resultsSort = document.querySelector("#resultsHead");
    let raceClick = document.querySelector("#raceTable");
    let year = seasonData.raceData[0].year;

    raceSort.addEventListener("click", (event) => {

        let element = event.target;

        if (element.tagName === "TH") {

            let cell = element;
            let header = cell.textContent;
            populateRaceData(seasonData, header);
        }
    });
    raceClick.addEventListener("click", (event) => {

        let element = event.target;
        if (element.tagName === "TD") {

            let row = element.closest("tr");
            let raceId = row.getAttribute("data-race-id");

            populateRaceInfo(seasonData, raceId);
            let qualData = filterData(seasonData, raceId, "qual");

            populateQaulData(qualData, "", year);
            qualSort.addEventListener("click", (event) => {

                let element = event.target;
                if (element.tagName === "TH") {

                    let cell = element;
                    let header = cell.textContent;
                    populateQaulData(qualData, header, year);
                }
            });
            let resultsData = filterData(seasonData, raceId, "results")
            populateResultsData(resultsData, "", year);
            resultsSort.addEventListener("click", (event) => {

                let element = event.target;

                if (element.tagName === "TH") {

                    let cell = element;
                    let header = cell.textContent;
                    populateResultsData(resultsData, header, year);
                }
            });
        }
    });
}
/**
 * Populates the race data table with sorted data.
 *
 * This function takes season race data, sorts it based on the specified header, and populates the race table with the sorted data.
 * It also updates the race header with the year of the races.
 *
 * @param {Object} seasonData - The data object containing race information for the season.
 * @param {string} header - The header by which to sort the data (e.g., "Name", "Rnd").
 */
function populateRaceData(seasonData, header) {

    const raceList = document.querySelector("#raceTable");
    raceList.innerHTML = "";

    let raceHeader = document.querySelector("#raceHeader");

    raceHeader.textContent = `${seasonData.raceData[0].year} Races`;

    const sortedData = [...seasonData.raceData].sort((a, b) => {
        if (header === "Name") {

            return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
        } else if (header === "Rnd") {

            return a.round - b.round;
        }
        return 0;
    });
    for (let race of sortedData) {

        let row = document.createElement("tr");
        row.setAttribute("data-race-id", race.id);

        let round = document.createElement("td");
        round.classList.add("px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        round.textContent = `${race.round}`;

        let name = document.createElement("td");
        name.classList.add("modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${race.name}`;

        row.appendChild(round);
        row.appendChild(name);

        raceList.appendChild(row);
    }
}
/**
 * Populates the qualification data table with sorted data.
 *
 * This function takes qualification data, sorts it based on the specified header, and populates the qualification table with the sorted data.
 * It also sets up the modals for drivers and constructors.
 *
 * @param {Array} data - The array of qualification data objects to populate the table with.
 * @param {string} header - The header by which to sort the data (e.g., "Pos", "Driver", "Const", "Q1", "Q2", "Q3").
 * @param {number} year - The year of the race season.
 */
function populateQaulData(data, header, year) {

    const qualTable = document.querySelector("#qualTable");

    qualTable.innerHTML = "";

    const sortedData = [...data].sort((a, b) => {

        if (header === "Pos") {

            return a.position - b.position;
        } else if (header === "Driver") {

            const fullNameA = `${a.driver.forename} ${a.driver.surname}`;
            const fullNameB = `${b.driver.forename} ${b.driver.surname}`;
            return fullNameA > fullNameB ? 1 : fullNameA < fullNameB ? -1 : 0;
        } else if (header === "Const") {

            const constructorNameA = a.constructor.name;
            const constructorNameB = b.constructor.name;

            return constructorNameA > constructorNameB ? 1 : constructorNameA < constructorNameB ? -1 : 0;
        } else if (header === "Q1") {

            return timeToSeconds(a.q1) - timeToSeconds(b.q1);
        } else if (header === "Q2") {

            return timeToSeconds(a.q2) - timeToSeconds(b.q2);
        } else if (header === "Q3") {

            return timeToSeconds(a.q3) - timeToSeconds(b.q3);
        }
        return 0;
    });
    for (let d of sortedData) {

        let row = document.createElement("tr");

        let pos = document.createElement("td");
        pos.classList.add("px-2", "py-2", "border-b", "text-sm", "text-gray-800");
        pos.textContent = `${d.position}`;

        let name = document.createElement("td");
        name.classList.add("driver-modal", "modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        name.textContent = `${d.driver.forename} ${d.driver.surname}`;
        name.setAttribute("ref", d.driver.ref);
        addHeartIcon(name, d.driver.id, "drivers");


        /*
         let name = document.createElement("td");
         name.classList.add("driver-modal", "modal-hover", "px-2", "py-2", "w-36", "border-b", "text-sm", "text-gray-800");
         name.style.display = 'grid';
         name.style.gridTemplateColumns = '1fr auto'; // Two columns: text and heart icon
         //name.style.alignItems = 'center';
 
         // Create a span for the driver name text
         let nameTextSpan = document.createElement('span');
         nameTextSpan.textContent = `${d.driver.forename} ${d.driver.surname}`;
 
         // Append the text span to the name cell
         name.appendChild(nameTextSpan);
 
         // Add the heart icon
         addHeartIcon(name, d.driver.id, "drivers");
 
         // Set the ref attribute
         name.setAttribute("ref", d.driver.ref);
         row.appendChild(name);
 */
        let constructor = document.createElement("td");
        constructor.classList.add("constructor-modal", "modal-hover", "px-4", "py-2", "border-b", "text-sm", "text-gray-800");
        constructor.textContent = `${d.constructor.name}`;
        constructor.setAttribute("ref", d.constructor.ref);
        addHeartIcon(constructor, d.constructor.id, "constructors");

        /*
        let constructor = document.createElement("td");
        constructor.classList.add("constructor-modal", "modal-hover", "px-2", "py-2", "w-36", "border-b", "text-sm", "text-gray-800");
        constructor.style.display = 'grid';
        constructor.style.gridTemplateColumns = '1fr auto'; // Two columns: text and heart icon
        constructor.style.alignItems = 'center';

        // Create a span for the constructor name text
        let textSpan = document.createElement('span');
        textSpan.textContent = `${d.constructor.name}`;

        // Append the text span to the constructor cell
        constructor.appendChild(textSpan);
        row.appendChild(constructor);
        // Add the heart icon
        addHeartIcon(constructor, d.constructor.id, "constructors");

        constructor.setAttribute("ref", d.constructor.ref);
*/
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

        qualTable.appendChild(row);
    }
    setupDriverModal(year);
    setupConstructorModal(year);
}
/**
 * Populates the results table with race data and updates the podium positions.
 *
 * This function takes race data, sorts it based on the specified header, and populates the results table with the sorted data.
 * It also updates the podium positions (first, second, and third) with the respective drivers and sets up the modals for drivers and constructors.
 *
 * @param {Array} data - The array of race data objects to populate the table with.
 * @param {string} header - The header by which to sort the data (e.g., "Pos", "Driver", "Const", "Laps", "Pts").
 * @param {number} year - The year of the race season.
 */
function populateResultsData(data, header, year) {

    console.log(data);
    const resultsTable = document.querySelector("#resultsTable");
    const first = document.querySelector("#first");
    const second = document.querySelector("#second");
    const third = document.querySelector("#third");
    const firstBox = document.querySelector("#firstBox");
    const secondBox = document.querySelector("#secondBox");
    const thirdBox = document.querySelector("#thirdBox");

    resultsTable.innerHTML = "";

    firstBox.classList.add("driver-modal", "cursor-pointer", "modal-hover");
    secondBox.classList.add("driver-modal", "cursor-pointer", "modal-hover");
    thirdBox.classList.add("driver-modal", "cursor-pointer", "modal-hover");

    const sortedData = [...data].sort((a, b) => {
        if (header === "Pos") {

            return a.position - b.position;
        } else if (header === "Driver") {

            const fullNameA = `${a.driver.forename} ${a.driver.surname}`;
            const fullNameB = `${b.driver.forename} ${b.driver.surname}`;

            return fullNameA > fullNameB ? 1 : fullNameA < fullNameB ? -1 : 0;
        } else if (header === "Const") {

            const constructorNameA = a.constructor.name;
            const constructorNameB = b.constructor.name;

            return constructorNameA > constructorNameB ? 1 : constructorNameA < constructorNameB ? -1 : 0;
        } else if (header === "Laps") {

            return b.laps - a.laps;
        } else if (header = "Pts") {

            return b.points - a.points;
        }
        return 0;
    });
    for (let d of sortedData) {

        if (d.position === 1) {
            first.textContent = `${d.driver.forename} ${d.driver.surname}`;
            firstBox.setAttribute("ref", d.driver.ref);
            addHeartIcon(first, d.driver.id, "drivers");
        }
        if (d.position === 2) {
            second.textContent = `${d.driver.forename} ${d.driver.surname}`;
            secondBox.setAttribute("ref", d.driver.ref);
            addHeartIcon(second, d.driver.id, "drivers");
        }
        if (d.position === 3) {
            third.textContent = `${d.driver.forename} ${d.driver.surname}`;
            thirdBox.setAttribute("ref", d.driver.ref);
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

        resultsTable.appendChild(row);
    }
    setupDriverModal(year);
    setupConstructorModal(year);
}
/**
 * Populates the race information section with details of the specified race.
 *
 * This function finds the race data corresponding to the given race ID and updates the relevant HTML elements
 * with the race's information, including the race name, round, circuit name, date, and a link to more information.
 * It also sets up the circuit modal for the race.
 *
 * @param {Object} data - The data object containing race information.
 * @param {number|string} raceId - The ID of the race to display information for.
 */
function populateRaceInfo(data, raceId) {

    let race = data.raceData.find(race => race.id === parseInt(raceId));

    let raceInfo = document.querySelector("#raceInfo");
    let roundInfo = document.querySelector("#roundInfo");
    let circuitInfo = document.querySelector("#circuitInfo");
    let circuitName = document.querySelector("#circuitName");
    let dateInfo = document.querySelector("#dateInfo");
    let raceUrl = document.querySelector("#raceUrl")

    raceInfo.textContent = `Results for the ${race.year} ${race.name}`;
    roundInfo.textContent = `Round: ${race.round} `;

    circuitInfo.textContent = `Circuit: `;
    circuitName.textContent = `${race.circuit.name} `
    circuitName.classList.add("circuit-modal", "cursor-pointer", "underline");

    dateInfo.textContent = `Date: ${race.date} `;

    raceUrl.textContent = "See More";
    raceUrl.href = race.url;
    raceUrl.classList.add("cursor-pointer", "underline");

    setupCircuitModal(race);
}
/**
 * Filters data based on race ID and type.
 *
 * This function filters the provided data to return entries that match the specified race ID.
 * The type parameter determines whether to filter qualification data or results data.
 *
 * @param {Object} data - The data object containing qualification and results data.
 * @param {number|string} raceId - The ID of the race to filter by.
 * @param {string} type - The type of data to filter ("qual" for qualification data, "results" for race results data).
 * @returns {Array} - An array of filtered data entries that match the specified race ID.
 */
function filterData(data, raceId, type) {

    if (type === "qual") {
        return data.qualificationData.filter(entry =>
            entry.race.id === parseInt(raceId));

    } else if (type === "results") {
        return data.resultsData.filter(entry =>
            entry.race.id === parseInt(raceId));
    }
}
/**
 * Converts a time string in the format "mm:ss.sss" to total seconds.
 *
 * This function takes a time string in the format "mm:ss.sss" and converts it to the total number of seconds.
 * If the time string is empty, the function returns undefined.
 *
 * @param {string} timeString - The time string to convert, in the format "mm:ss.sss".
 * @returns {number|undefined} - The total number of seconds, or undefined if the time string is empty.
 */
function timeToSeconds(timeString) {

    if (timeString === "") {
        return;
    } else {

        const [minutes, seconds] = timeString.split(':');
        const [sec, ms] = seconds.split('.');
        const total_seconds = parseInt(minutes) * 60 + parseInt(sec);
        const milliseconds = ms ? parseInt(ms) : 0;

        return total_seconds + milliseconds / 1000;
    }
}
/**
 * Changes the current view of the application.
 *
 * This function updates the visibility of various sections of the application based on the provided view.
 * It clears the content of certain elements and adjusts the classes to show or hide the appropriate sections.
 *
 * If the function is passed a value of "loading" the current view will not change.
 * @param {string} currentView - The view to switch to. Possible values are "home", "race", and "loading".
 * @returns {string} - The updated current view.
 */
function changeView(currentView) {

    const homeView = document.querySelector("#home");
    const raceView = document.querySelector("#race");
    const buttons = document.querySelector("#navButtons");
    const title = document.querySelector("#title")
    const qualTable = document.querySelector("#qualTable");
    const resultsTable = document.querySelector("#resultsTable");
    const first = document.querySelector("#first");
    const second = document.querySelector("#second");
    const third = document.querySelector("#third");
    const firstBox = document.querySelector("#firstBox");
    const secondBox = document.querySelector("#secondBox");
    const thirdBox = document.querySelector("#thirdBox");
    const loadingView = document.querySelector("#loading");
    const video = document.querySelector("#titleVideo");
    let toasters = document.querySelector(".toaster");

    document.querySelector('#raceInfo').innerHTML = '';
    document.querySelector('#roundInfo').innerHTML = '';
    document.querySelector('#circuitInfo').innerHTML = '';
    document.querySelector('#circuitName').innerHTML = '';
    document.querySelector('#dateInfo').innerHTML = '';
    document.querySelector('#raceUrl').innerHTML = '';

    first.textContent = "";
    firstBox.classList.remove("modal-hover");
    second.textContent = "";
    secondBox.classList.remove("modal-hover");
    third.textContent = "";
    thirdBox.classList.remove("modal-hover");

    qualTable.innerHTML = "";
    resultsTable.innerHTML = "";

    firstBox.classList.remove("hover:bg-gray-200", "cursor-pointer");
    secondBox.classList.remove("hover:bg-gray-200", "cursor-pointer");
    thirdBox.classList.remove("hover:bg-gray-200", "cursor-pointer");

    if (currentView === "home") {

        homeView.classList.add("hidden");
        title.classList.add("hidden");
        raceView.classList.remove("hidden");
        buttons.classList.remove("hidden", "lg:hidden");
        toasters.classList.add("hidden");
        loadingView.classList.add("hidden");

        currentView = "race";
        return currentView;
    }
    else if (currentView === "loading") {

        homeView.classList.add("hidden");
        raceView.classList.add("hidden");
        title.classList.add("hidden");
        loadingView.classList.remove("hidden");

        return "loading";

    } else {

        homeView.classList.remove("hidden");
        title.classList.remove("hidden");
        raceView.classList.add("hidden");
        buttons.classList.add("hidden", "lg:hidden");
        loadingView.classList.add("hidden");

        currentView = "home";
        return currentView;
    }
}
/**
 * Adds an item to the favorites list and updates local storage.
 *
 * This function checks if the item is already in the favorites list. If it is not, it adds the item to the appropriate
 * category (drivers, constructors, or circuits) in the favorites list, updates local storage, and shows a heart icon
 * next to the item. It also displays a toaster notification indicating the item was added.
 *
 * @param {Object} item - The item to be added to the favorites. This can be a driver, constructor, or circuit object.
 * @param {string} type - The type of the item (e.g., "drivers", "constructors", "circuits").
 */
function handleAddToFavorites(item, type) {

    let favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    let itemCheck = favorites[type][item.id] || favorites[type][item.driverId] || favorites[type][item.constructorId];

    if (!itemCheck) {
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
        showToaster(type, "dontAdd");
    }
}
/**
 * Sets up the favorites modal by populating it with the current favorites from local storage.
 * It also sets up the modal's close button and the "Empty Favorites" button.
 *
 * This function retrieves the favorites from local storage and populates the respective tables for drivers,
 * constructors, and circuits. It also handles the modal display and the functionality to empty the favorites.
 */
function setupFavoritesModal() {

    const favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    const modal = document.querySelector('#favoritesModal');
    const closeModal = document.querySelector('#closeFavoritesModal');
    const emptyFavoritesButton = document.querySelector('#emptyFavorites');

    populateFavoritesTable(favorites.drivers, 'drivers', '#favorites_drivers_table');
    populateFavoritesTable(favorites.constructors, 'constructors', '#favorites_constructors_table');
    populateFavoritesTable(favorites.circuits, 'circuits', '#favorites_circuits_table');

    handleModal(modal, closeModal);
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
/**
 * Populates a table with the given favorites data.
 *
 * This function clears the existing content of the table and then populates it with the provided favorites data.
 * Each favorite is added as a new row in the table.
 *
 * @param {Object} favorites - An object containing the favorites data, where the key is the favorite's ID and the value is the favorite's name.
 * @param {string} type - The type of favorites (e.g., "drivers", "constructors", "circuits").
 * @param {string} tableId - The ID of the table element to populate.
 */
function populateFavoritesTable(favorites, type, tableId) {

    const table = document.querySelector(tableId);
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
/**
 * Sets up the circuit modal by adding a click event listener to the element with the class "circuit-modal".
 * When the element is clicked, it populates the modal with the circuit's information and sets up the modal's close button
 * and the "Add to Favorites" button.
 *
 * @param {Object} race - The race object containing circuit information.
 */
function setupCircuitModal(race) {

    const circuitName = document.querySelector('.circuit-modal');
    circuitName.addEventListener('click', () => {

        let circuitModal = document.querySelector('#circuitModal');
        let closeModalButton = document.querySelector('#closeCircuitModal');

        document.querySelector('#circuitName').textContent = race.circuit.name;
        document.querySelector('#circuitLocation').textContent = race.circuit.location;
        document.querySelector('#circuitCountry').textContent = race.circuit.country;
        document.querySelector('#circuitUrl').href = race.circuit.url;
        document.querySelector('#circuitUrl').textContent = "Wikipedia";
        document.querySelector('#circuitImage').src = `images/circuit_placeholder.jpg`;
        document.querySelector('#driverImage').src = `images/driver_placeholder.png`;

        handleModal(circuitModal, closeModalButton);

        let addToFavButton = document.querySelector('#addCircuitToFav');
        let newButton = addToFavButton.cloneNode(true);
        addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
        newButton.addEventListener('click', () => handleAddToFavorites(race.circuit, "circuits"));
    });
}
/**
 * Sets up the constructor modal by adding click event listeners to elements with the class "constructor-modal".
 * When a row is clicked, it fetches constructor data from an API and populates the modal with the constructor's information.
 * It also sets up the modal's close button and the "Add to Favorites" button.
 *
 * @param {number} year - The season year to be used for fetching constructor data.
 */
function setupConstructorModal(year) {

    const rows = document.querySelectorAll(".constructor-modal");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            let constructorModal = document.querySelector('#constructorModal');
            let closeModalButton = document.querySelector('#closeModal');
            let constructor_ref = row.getAttribute("ref");
            console.log(`constructor_ref: ${constructor_ref}`);
            fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=${constructor_ref}`)
                .then(response => response.json())
                .then(constructor => {
                    document.querySelector('#constructorName').textContent = constructor.name;
                    document.querySelector('#constructorNationality').textContent = constructor.nationality;
                    document.querySelector('#constructorUrl').href = constructor.url;
                    document.querySelector('#constructorUrl').textContent = "Wikipedia";
                    document.querySelector('#constructorUrl').href = constructor.url;

                    populateConstructorTable(constructor_ref, year);
                    handleModal(constructorModal, closeModalButton);

                    let addToFavButton = document.querySelector('.addToFavorites');

                    let newButton = addToFavButton.cloneNode(true);
                    addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
                    newButton.addEventListener('click', () => handleAddToFavorites(constructor, "constructors"));
                })
                .catch(error => console.error('Error fetching constructor data:', error));
        });
    });
}
/**
 * Fetches and populates the constructor results table for a given constructor and season.
 *
 * This function makes an API call to fetch the constructor results for the specified constructor reference and season.
 * It then populates the table with the race results, including the round, race name, driver name, and position order.
 *
 * @param {string} constructor_ref - The reference ID of the constructor.
 * @param {number} season - The season year for which to fetch the constructor results.
 */
function populateConstructorTable(constructor_ref, season) {
    fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructor_ref}&season=${season}`)
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
/**
 * Sets up the driver modal by adding click event listeners to elements with the class "driver-modal".
 * When a row is clicked, it fetches driver data from an API and populates the modal with the driver's information.
 * It also sets up the modal's close button and the "Add to Favorites" button.
 *
 * @param {number} currentSeason - The current season year to be used for fetching driver data.
 */
function setupDriverModal(currentSeason) {

    const rows = document.querySelectorAll(".driver-modal");

    rows.forEach(row => {
        row.addEventListener("click", () => {

            let driverModal = document.querySelector('#driverModal');
            let closeModalButton = document.querySelector('#closeDriverModal');
            let driver_ref = row.getAttribute("ref");

            fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=${driver_ref}`)
                .then(response => response.json())
                .then(driver => {

                    document.querySelector('#driverName').textContent = `${driver.forename} ${driver.surname}`;
                    document.querySelector('#DOB').textContent = driver.dob;
                    document.querySelector('#driverAge').textContent = calculateAge(driver.dob);
                    document.querySelector('#driverNationality').textContent = driver.nationality;
                    document.querySelector('#driverUrl').href = driver.url;
                    document.querySelector('#driverUrl').textContent = "Wikipedia";
                    document.querySelector('#driverUrl').href = driver.url;
                    document.querySelector('#driverImage').src = `images/driver_placeholder.png`;

                    populateDriverTable(driver_ref, currentSeason);

                    handleModal(driverModal, closeModalButton);

                    let addToFavButton = document.querySelector('#addDriverToFav');
                    let newButton = addToFavButton.cloneNode(true);
                    addToFavButton.parentNode.replaceChild(newButton, addToFavButton);
                    newButton.addEventListener('click', () => handleAddToFavorites(driver, "drivers"));
                })
                .catch(error => console.error('Error fetching driver data:', error));
        });
    });
}
/**
 * Populates the driver results table with data fetched from an API and local storage.
 *
 * @param {string} driver_ref - The reference ID of the driver.
 * @param {number} season - The season year for which to fetch driver results.
 * @returns {void}
 */
function populateDriverTable(driver_ref, season) {
    console.log(`driver_ref: ${driver_ref}, season: ${season}`);
    fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/driverResults.php?driver=${driver_ref}&season=${season}`)
        .then(response => response.json())
        .then(matchingDrivers => {

            const seasonKey = `season_${season}`;
            const storedData = JSON.parse(localStorage.getItem(seasonKey));

            const resultsData = storedData ? storedData.resultsData : [];

            let driverResultsTable = document.querySelector('#driver_results_table');
            driverResultsTable.innerHTML = '';
            let driverImage = document.querySelector('#driverImage');
            driverImage.src = "images/driver_placeholder.png";

            matchingDrivers.forEach(item => {

                const row = document.createElement('tr');
                const result = resultsData.find(result => result.id === item.resultId);

                const roundCell = document.createElement('td');
                roundCell.classList.add('py-3', 'px-6', 'border-b');
                roundCell.textContent = item.round;

                const nameCell = document.createElement('td');
                nameCell.classList.add('py-3', 'px-6', 'border-b', 'whitespace-nowrap');
                nameCell.textContent = item.name;

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
/**
 * Handles the display and closing of a modal dialog.
 *
 * @param {HTMLDialogElement} modal - The modal element to be handled.
 * @param {HTMLElement} closeModalButton - The button element that closes the modal.
 */
function handleModal(modal, closeModalButton) {

    let currentModal = modal.id;

    console.log('handleModal');
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
/**
 * Displays a toaster notification based on the type and action provided.
 *
 * @param {string} type - The type of item being added to favorites. Can be "constructors", "drivers", or any other string.
 * @param {string} added - The action performed. Should be "add" if the item is being added to favorites, otherwise any other string.
 */
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
        }, 2000);

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
        }, 2000);

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
        }, 2000);
    }
}
/**
 * Calculates the age based on the date of birth.
 *
 * @param {string} dob - The date of birth in a format recognized by the Date.parse() method.
 * @returns {number} The calculated age.
 */
function calculateAge(dob) {
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
/**
 * Adds a heart icon to a specified cell element. The heart icon is visible if the item is in the favorites list stored in localStorage.
 *
 * @param {HTMLElement} cell - The cell element to which the heart icon will be added.
 * @param {string} id - The unique identifier of the item (driver, constructor, or circuit).
 * @param {string} type - The type of the item (e.g., 'drivers', 'constructors', 'circuits').
 */
function addHeartIcon(cell, id, type) {
    const heartIcon = document.createElement('img');
    heartIcon.src = 'images/heart_icon.png';
    heartIcon.classList.add('heart-icon', 'hidden', 'heart-icon');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || { drivers: {}, constructors: {}, circuits: {} };
    if (favorites[type] && favorites[type][id])
        heartIcon.classList.remove('hidden');

    cell.appendChild(heartIcon);
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
/**
 * Shows the heart icon within a given table cell.
 *
 * @param {NodeList} cells - The table cells containing the heart icon.
 */
function showHeartIcon(cells) {
    cells.forEach(cell => {
        const heartIcon = cell.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.classList.remove('hidden');
        }
    });
}
/**
 * Hides the heart icon within a given table cell.
 *
 * @param {HTMLElement} cell - The table cell element containing the heart icon.
 */
function hideHeartIcon(cell) {
    const heartIcon = cell.querySelector('.heart-icon');
    if (heartIcon) {
        heartIcon.classList.add('hidden');
    }
}
