# F1 Dashboard

## Overview

The F1 Dashboard is a web application designed to provide users with comprehensive information about Formula 1 races, drivers, constructors, and circuits. The application allows users to view race results, qualifying data, and add their favorite drivers, constructors, and circuits to a favorites list.

## View the Application

You can view the live application on GitHub Pages: [F1 Dashboard](https://ewush956.github.io/Comp3612Assignment2/)

## Features

- **Race Information**: View detailed information about each race, including the race name, round, circuit, and date.
- **Qualifying Data**: Access qualifying results for each race, sorted by position, driver, constructor, and qualifying times (Q1, Q2, Q3).
- **Race Results**: View race results, including driver positions, constructor details, laps completed, and points earned.
- **Favorites**: Add drivers, constructors, and circuits to a favorites list for quick access.
- **Responsive Design**: The application is designed to be responsive and works well on both desktop and mobile devices.

## Installation

To run the F1 Dashboard locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/ewush956/Comp3612Assignment2.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd Comp3612Assignment2
    ```

3. **Open the `index.html` file in your preferred web browser**.

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
- **YouTube IFrame API**: For embedding and controlling YouTube videos.

## API Endpoints

The application fetches data from the following API endpoints:

- **Race Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season={season}`
- **Qualifying Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season={season}`
- **Results Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season={season}`
- **Constructor Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref={constructor_ref}`
- **Driver Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref={driver_ref}`
- **Circuit Data**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?ref={circuit_ref}`

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- Special thanks to [Randy Connolly](https://www.randyconnolly.com/) for providing the API endpoints used in this project.
- Thanks to the [Tailwind CSS](https://tailwindcss.com/) team for their excellent CSS framework.

## Contact

For any inquiries or feedback, please contact [Evan Wush](mailto:ewush956@example.com).

---

[GitHub Repo](https://github.com/ewush956/Comp3612Assignment2)