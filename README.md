# Map Explorer - Real-time Route Sharing and Optimization

This project is a web-based urban mobility and route optimization application designed to improve route planning for delivery vehicles. It leverages weather data, accident data (planned), real-time traffic updates (planned), and machine learning (specifically, a genetic algorithm) to provide the most efficient and time-saving routes. Users can share routes, view recent routes, and check for other users at specific locations and times.

## Features

- **Interactive Map:** Displays routes, markers for source, destination, and stops, along with a user's current location.
- **Route Planning:** Calculates optimal routes considering source, destination, and multiple stops. Uses a genetic algorithm for route optimization.
- **Real-time Updates (Planned):** Incorporates real-time traffic data to dynamically adjust routes.
- **Weather Integration:** Fetches and displays weather information along the route.
- **Route Sharing:** Allows users to share planned routes with others.
- **Route History:** Displays a list of recent routes, filterable by user.
- **User Location Check:** Enables users to check for other users at a specific location and time window.
- **Vehicle Management:** Allows users to specify the number of available vehicles.
- **User Authentication:** Basic username setting functionality.
- **Data Persistence:** Stores route data and user information in a database (MongoDB).

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Leaflet (map library), Leaflet Routing Machine, Font Awesome.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Route Optimization:** Python, Genetic Algorithm.
- **Weather API:** Weatherstack API.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_GITHUB_REPO_URL]
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd [YOUR_REPO_NAME]
    ```

3.  **Install frontend dependencies:**

    Frontend dependencies are included via CDN links in the `index.html` file. No further installation is needed for the frontend.

4.  **Install backend dependencies:**

    ```bash
    npm install
    ```

5.  **Set up environment variables:**

    Create a `.env` file in the backend directory and add the following environment variables (replace the placeholders with your actual values):

    ```
    PORT=3000  # Or any other port
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority  # Your MongoDB connection string
    WEATHERSTACK_API_KEY=[YOUR_WEATHERSTACK_API_KEY] # Your Weatherstack API key
    ```

6.  **Set up MongoDB:**

    Ensure you have MongoDB installed and running. Create the MongoDB connection string placeholder in the `.env` as "DB = 'your mongoDB string'" with your actual connection string. You can use MongoDB Atlas for a cloud-based MongoDB instance.

7.  **Set up Weatherstack API:**

    Obtain an API key from Weatherstack and replace the placeholder in the `.env` file.

8.  **Set up Python environment:**

    Ensure you have Python 3 installed. Install any required Python packages for the genetic algorithm script (e.g., `pip install ...`). A `requirements.txt` file in the `scripts` directory would be helpful. Example:

    ```bash
    pip install -r requirements.txt
    ```

9.  **Run the backend server:**

    ```bash
    node server.js
    ```

10. **Open the `index.html` file in your browser to access the application.**

## Project Structure

Markdown

# Map Explorer - Real-time Route Sharing and Optimization

This project is a web-based urban mobility and route optimization application designed to improve route planning for delivery vehicles. It leverages weather data, accident data (planned), real-time traffic updates (planned), and machine learning (specifically, a genetic algorithm) to provide the most efficient and time-saving routes. Users can share routes, view recent routes, and check for other users at specific locations and times.

## Features

- **Interactive Map:** Displays routes, markers for source, destination, and stops, along with a user's current location.
- **Route Planning:** Calculates optimal routes considering source, destination, and multiple stops. Uses a genetic algorithm for route optimization.
- **Real-time Updates (Planned):** Incorporates real-time traffic data to dynamically adjust routes.
- **Weather Integration:** Fetches and displays weather information along the route.
- **Route Sharing:** Allows users to share planned routes with others.
- **Route History:** Displays a list of recent routes, filterable by user.
- **User Location Check:** Enables users to check for other users at a specific location and time window.
- **Vehicle Management:** Allows users to specify the number of available vehicles.
- **User Authentication:** Basic username setting functionality.
- **Data Persistence:** Stores route data and user information in a database (MongoDB).

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Leaflet (map library), Leaflet Routing Machine, Font Awesome.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Route Optimization:** Python, Genetic Algorithm.
- **Weather API:** Weatherstack API.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone [YOUR_GITHUB_REPO_URL]
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd [YOUR_REPO_NAME]
    ```

3.  **Install frontend dependencies:**

    Frontend dependencies are included via CDN links in the `index.html` file. No further installation is needed for the frontend.

4.  **Install backend dependencies:**

    ```bash
    npm install
    ```

5.  **Set up environment variables:**

    Create a `.env` file in the backend directory and add the following environment variables (replace the placeholders with your actual values):

    ```
    PORT=3000  # Or any other port
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority  # Your MongoDB connection string
    WEATHERSTACK_API_KEY=[YOUR_WEATHERSTACK_API_KEY] # Your Weatherstack API key
    ```

6.  **Set up MongoDB:**

    Ensure you have MongoDB installed and running. Replace the MongoDB connection string placeholder in the `.env` file with your actual connection string. You can use MongoDB Atlas for a cloud-based MongoDB instance.

7.  **Set up Weatherstack API:**

    Obtain an API key from Weatherstack and replace the placeholder in the `.env` file.

8.  **Set up Python environment:**

    Ensure you have Python 3 installed. Install any required Python packages for the genetic algorithm script (e.g., `pip install ...`). A `requirements.txt` file in the `scripts` directory would be helpful. Example:

    ```bash
    pip install -r scripts/requirements.txt
    ```

9.  **Run the backend server:**

    ```bash
    node server.js
    ```

10. **Open the `index.html` file in your browser to access the application.**

## Project Structure

urban-mobility-route-optimisation/
├── client.js # Frontend JavaScript
├── server.js # Backend server (Node.js, Express)
├── styles.css # CSS Stylesheet
├── index.html # Main HTML file
├── models/ # MongoDB models
│ ├── route.js # Route data model
│ ├── user.js # User data model
│ └── scriptOutput.js # Script output data model
├── scripts/ # Python scripts
│ ├── scripts.py # Genetic algorithm script
│ └── requirements.txt # Python dependencies
├── db.js # Database connection setup
└── README.md # This file

## Usage

1.  Enter your username and click "Set Username."
2.  Enter the source and destination locations, and optionally, any stops.
3.  Select the departure time.
4.  Click "Find Route" to calculate the route.
5.  Click "Share Route" to save the route to the database.
6.  Click "Show All Routes" to view recent routes.
7.  Click "Select Point on Map" to select a point for checking users.
8.  Enter a time and click "Check Users" to see users passing through the selected point.
9.  Click "Weather Info" to view the weather forecast along the route.
10. Enter the number of available vehicles and click "Save".

## Future Enhancements

- **Real-time Traffic Integration:** Implement real-time traffic updates to dynamically adjust routes.
- **Accident Data Integration:** Integrate accident data to avoid accident-prone areas.
- **Improved UI/UX:** Enhance the user interface and user experience.
- **User Authentication:** Implement proper user authentication and authorization.
- **Advanced Route Optimization:** Explore more advanced route optimization algorithms.
- **Testing:** Add unit and integration tests.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
