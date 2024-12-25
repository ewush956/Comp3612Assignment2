# F1 Dashboard

## Overview

The F1 Dashboard is a web application designed to provide users with comprehensive information about Formula 1 races, drivers, constructors, and circuits. The application allows users to view race results, qualifying data, and add their favorite drivers, constructors, and circuits to a favorites list.

## View the Application

You can view the live application on GitHub Pages: [F1 Dashboard](https://ewush956.github.io/F1-Dashboard/)

## Features

- **Race Information**: View detailed information about each race, including the race name, round, circuit, and date.
- **Qualifying Data**: Access qualifying results for each race, sorted by position, driver, constructor, and qualifying times (Q1, Q2, Q3).
- **Race Results**: View race results, including driver positions, constructor details, laps completed, and points earned.
- **Favorites**: Add drivers, constructors, and circuits to a favorites list for quick access.
- **Responsive Design**: The application is designed to be responsive and works well on both desktop and mobile devices.

## Usage

- **Home Page**: The home page displays an overview of the application and provides navigation to different sections.
- **Race Information**: Click on a race to view detailed information about the race, including the circuit and date.
- **Qualifying Data**: View qualifying results by clicking on the "Qualifying" tab. The data is sortable by position, driver, constructor, and qualifying times.
- **Race Results**: Access race results by clicking on the "Results" tab. The results include driver positions, constructor details, laps completed, and points earned.
- **Favorites**: Add drivers, constructors, and circuits to your favorites list by clicking the heart icon next to each item. View your favorites by clicking the "Favorites" button.

## Technologies Used

- **HTML**: For structuring the web pages.
- **CSS**: For styling the application.
- **JavaScript**: For adding interactivity and fetching data from APIs.
- **Tailwind CSS**: For responsive design and utility-first CSS framework.

## API Endpoints

The application fetches data from the following API endpoints:

- **Race Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season={season}`
- **Qualifying Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season={season}`
- **Results Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season={season}`
- **Constructor Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref={constructor_ref}`
- **Driver Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref={driver_ref}`
- **Circuit Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?ref={circuit_ref}`


## Citations
- [Tailwind CSS](https://tailwindcss.com/) 
- [Loading Animation](https://giphy.com/stickers/jaguar-jaguar85-jaguarrussia-duWMCvxS6XAhpHNpVL/)
- [AI Generated heart icon](https://chatgpt.com/)
