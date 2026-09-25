# xrwvm-fullstack_developer_capstone

## Project Name: fullstack_developer_capstone

A responsive full-stack web application for Cars Dealership, a national car
retailer in the U.S. Customers can browse dealership branches, filter by
state, read reviews with sentiment analysis, register, log in, and submit
their own reviews.

**Repository name:** xrwvm-fullstack_developer_capstone
**Project name:** fullstack_developer_capstone

## Tech Stack

- **Frontend:** React
- **Backend:** Django (server rendering + REST API), Node.js/Express
- **Database:** MongoDB (dealers & reviews), SQLite (Django users/car data)
- **Sentiment Analysis:** Flask microservice
- **DevOps:** Docker, Kubernetes, GitHub Actions (CI/CD), IBM Cloud Code Engine

## Running Locally

```bash
# Django server
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Dealer/review microservice
cd server/database
npm install
node server.js

# Sentiment analysis microservice
cd server/djangoapp/microservices
pip install -r requirements.txt
python app.py
```
