# FoodLogPro

Welcome to **FoodLogPro**, a full-stack web application designed to help users track and manage their tea/dinner meals. Originally created to streamline meal tracking for family use, this platform allows users to log meals, manage their account, and view insightful meal statistics.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)

## Project Overview

**FoodLogPro** is a meal tracking application that allows users to log their meals for tea/dinner along with detailed attributes such as the meal name, recipe source, last eaten date, rating, and an image. Users can also view and manage account details while tracking meal-related statistics, such as total meals logged and their most frequently eaten meal.

The hosted version can be found [here](https://foodlogpro.vercel.app/).

### Core Functionality
- Users can log, edit, and delete meals with various attributes.
- View personal account information, including profile avatar, username, and join date.
- Access statistics like total meals logged and most frequently logged meal.

## Features

### General User Features
1. **Meal Logging**: Add meals with attributes such as:
   - Meal name
   - Recipe source
   - Last eaten date
   - Rating (1–5 stars)
   - Image upload
2. **Edit & Delete Meals**: Update or remove meal entries at any time.
3. **User Profile**: View account details such as avatar, username, and join date.
4. **Meal Statistics**: View insights like total meals logged and most frequently eaten meal.

### Security Features
1. **User Authentication**:
   - Passwords securely hashed using **bcrypt**.
   - User sessions managed via **JSON Web Tokens (JWT)**.


## Tech Stack

### Front End
- **React**: For building an interactive and dynamic user interface.
- **Tailwind CSS**: Provides a clean and responsive design for the frontend.

### Back End
- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Lightweight backend framework for routing and API handling.
- **PostgreSQL**: Relational database to store user accounts and meal records.

### Security & Authorisation
- **bcrypt**: Ensures secure password hashing.
- **JSON Web Tokens (JWT)**: Manages user authentication and authorisation.

### Image Storage
- **Image Uploads**: Enables users to upload meal images for better visualisation.

## Installation & Setup

### Prerequisites
- **Node.js** (v16.0.0 or later)
- **PostgreSQL**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Iagrah99/foodlogpro.git

 1B. Change from the current directory into the project folder
   
   ```bash
   cd foodlogpro
   ```

   1C. Open up the folder in VS Code

   ```bash
   code .
   ```
  
3. Now let's get the project setup in order to get it running properly on your local machine.
   Inside VSCode open a terminal window <kbd>CTRL/CMD SHIFT `</kbd>. Then do the following steps:

   2a.  Install the dependencies by running the following Node Package Manager (NPM) command: 

   ```
   npm install
   ```

   2b. Create a .env file and inside store the API keys for both IMGBB and The Dog API that you signed up for earlier.

   ```
   VITE_IMGBB_API_KEY="Your key here"
   ```
   2c. Now you should be good to go by running `npm run dev` into the terminal.
