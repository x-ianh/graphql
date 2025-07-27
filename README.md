# 📊 GraphQL

Welcome to **GraphQL**. This web application allows you to log in to the Reboot01 platform and visualize your personal data, such as XP and project progress, using interactive charts.

**Project made by Abdulla Haram (username: aharam)**

---

## 📋 Table of Contents

1.  [Project Overview](#-project-overview)
2.  [Features](#-features)
3.  [How to Use](#-how-to-use)
4.  [Project Structure](#-project-structure)
5.  [Installation and Setup](#-installation-and-setup)
6.  [Technologies Used](#-technologies-used)
7.  [Learning Objectives](#-learning-objectives)
8.  [License](#-license)

---

## 🚀 Project Overview

This project is an educational exercise focused on learning and using the **GraphQL** query language. It provides a user-friendly interface to connect to the Reboot01 GraphQL API, fetch your data (like experience points and project results), and display it in a clear and visual format. The application handles user authentication via JWT and renders key statistics as SVG charts directly in the browser.

---

## ✨ Features

-   **Secure Login**: Log in using your Reboot01 username/email and password.
-   **User Profile Dashboard**: View your basic information (ID, login, account creation date).
-   **Key Statistics**: See your total XP earned and project pass/fail counts with a success rate.
-   **Interactive Data Charts**:
    *   Line chart showing your XP progression over time.
    *   Bar chart displaying your project pass/fail ratio.
-   **Logout Functionality**: Securely log out and return to the login screen.

---

## 🎮 How to Use

1.  **Start the Application**: Open `index.html` in a web browser (see [Installation and Setup](#-installation-and-setup)).
2.  **Log In**: Enter your Reboot01 username/email and password on the login screen.
3.  **View Your Profile**: After successful login, your dashboard will load, showing your information and charts.
4.  **Explore Data**: Analyze your XP progression and project results through the visual charts.
5.  **Log Out**: Click the "Logout" button to securely end your session.

---

## 🗂️ Project Structure

The project is organized into the following main files and folders:

-   **`index.html`**: The main HTML file defining the structure of the login and profile views.
-   **`style/style.css`**: The CSS file for styling the application's layout and appearance.
-   **`js/main.js`**: The main JavaScript entry point that initializes the application.
-   **`js/app.js`**: Manages the overall application state (current view, JWT token).
-   **`js/login.js`**: Controls the login form logic and authentication flow.
-   **`js/profile.js`**: Controls the profile view, loads user data, and updates the display.
-   **`js/graphql.js`**: Handles communication with the Reboot01 GraphQL API.
-   **`js/data.js`**: Processes raw data fetched from the API (calculations, formatting).
-   **`js/chart.js`**: Generates interactive SVG charts based on user data.
-   **`js/auth.js`**: Handles the initial login request to obtain a JWT token.

---

## 🛠️ Installation and Setup

1.  **Clone or Download the Project**:
    *   If using Git:
      ```bash
      git clone https://learn.reboot01.com/git/aharam/<repository-name>.git
      ```
    *   Otherwise, ensure all project files are in a local directory.
2.  **Run a Local Web Server**:
    Due to browser security restrictions on loading local files, you need a simple web server.
    *   **Using VS Code Live Server**:
        1.  Install the "Live Server" extension.
        2.  Right-click `index.html` and select "Open with Live Server".
    *   **Using Python (if installed)**:
        1.  Open your terminal/command prompt in the project directory.
        2.  Run the command:
            ```bash
            # Python 3
            python -m http.server 8000
            ```
        3.  Open your browser and navigate to `http://localhost:8000`.
3.  **Open in Browser**: Access the application through the URL provided by your chosen server method.

---

## 💻 Technologies Used

-   **HTML**: For structuring the application views.
-   **CSS**: For styling and layout.
-   **JavaScript (ES6 Modules)**: For application logic, data fetching, and DOM manipulation.
-   **Fetch API**: For making HTTP requests to the authentication and GraphQL endpoints.
-   **GraphQL**: For querying specific user data from the API.
-   **JWT (JSON Web Tokens)**: For secure authentication and authorization.
-   **SVG**: For creating interactive and dynamic data visualizations directly in the browser.

---

## 🎓 Learning Objectives

This project was created to achieve the following learning goals:

-   Understand and implement **user authentication** using Basic Auth (for login) and Bearer Token Auth (JWT for API requests).
-   Learn the fundamentals of the **GraphQL query language** by interacting with a real API.
-   Practice querying data using **GraphQL queries with arguments and nested fields**.
-   Gain experience in **client-side data processing** and **statistical calculations**.
-   Develop skills in creating **interactive data visualizations** using pure **SVG**.
-   Apply basic principles of **UI/UX design** for a clear user dashboard.
-   Structure a frontend application using **JavaScript ES6 Modules**.

---

## 📜 License

Specify your license here (e.g., MIT, Apache 2.0). If unspecified, code is typically considered proprietary.

---