# Webscraping and Prediction App

This application is designed to **scrape data from an online store** and analyze **pricing trends**. It also includes a **machine learning model** that predicts future prices based on the historical data.

:warning: **Important:** Make sure to configure the `.env` file correctly before running the application.

## Features

- **Webscraping**: Scrapes product data from an online store.
- **Data Analysis**: Analyzes pricing trends over time.
- **Prediction**: Uses a machine learning model to predict future prices. ⚠️ *In progress* ⚠️

## Technologies Used

### Backend
- **Django**: Backend framework.
- **Webscraping**: 
  - **Beautiful Soup**: A Python library used to scrape the data from the website.
- **Data Analysis**: 
  - **Pandas**: Used for data manipulation and analysis.
  - **NumPy**: Used for numerical computations.
  - **Plotly**: Used for visualizing pricing trends and other data.
- **Database Connection**: 
  - **Pymongo**: Python driver for MongoDB used to connect to and interact with the database.
- **Prediction**: 
  - **TensorFlow**: A machine learning library used to build a model for predicting future prices. ⚠️

### Frontend
- **React**: Frontend framework for building the user interface.
- **Bootstrap**: Ready components for building the UI.

### Database
- **MongoDB**: NoSQL database used to store the scraped data and other relevant information.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/marus03/Web_Scraping_App.git
