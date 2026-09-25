# Cars Dealership — Full Stack Development Capstone Project

A responsive full-stack web application for a national car dealership chain.
Customers can browse dealership branches across the U.S., view existing
reviews (with sentiment analysis), and submit their own reviews after
registering and logging in.

## Tech Stack

- **Frontend:** React
- **Backend:** Django (server rendering + REST API), Node.js/Express
- **Database:** MongoDB (dealers & reviews), SQLite (Django users/car data)
- **Sentiment Analysis:** Flask microservice using TextBlob
- **DevOps:** Docker, Kubernetes, GitHub Actions (CI/CD), IBM Cloud Code Engine

## Project Structure

```
.
├── server/                # Django project + built React frontend
│   ├── djangoapp/         # Django app: models, views, urls, restapis
│   └── frontend/          # React source + static assets
├── database/               # Node/Express + MongoDB microservice
├── sentiment_analyzer/     # Flask sentiment analysis microservice
└── .github/workflows/      # CI/CD pipeline
```

## Features

- Dealer listing and filtering by state
- Dealer detail pages with customer reviews and sentiment tags
- User registration, login, and logout
- Review submission for authenticated users
- Django admin panel for managing car makes/models
- Automated tests run via GitHub Actions on every push
- Containerized and deployed to IBM Cloud Code Engine

## Running Locally

```bash
# Django server
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Dealer/review microservice
cd database
npm install
node server.js

# Sentiment analysis microservice
cd sentiment_analyzer
pip install -r requirements.txt
python app.py
```
