import json
import logging

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review

logger = logging.getLogger(__name__)


# ---------- Authentication ----------

@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        login(request, user)
        response_data["status"] = "Authenticated"
    return JsonResponse(response_data)


def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(
        username=username, first_name=first_name,
        last_name=last_name, email=email, password=password
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


# ---------- Car makes / models ----------

def get_cars(request):
    count = CarMake.objects.filter().count()
    if count == 0:
        initiate()  # seed sample data if empty
    car_models = CarModel.objects.select_related('car_make')
    cars = [
        {"CarModel": cm.name, "CarMake": cm.car_make.name}
        for cm in car_models
    ]
    return JsonResponse({"CarModels": cars})


def initiate():
    """Seed a handful of makes/models so get_cars() isn't empty on first run."""
    seed = {
        "NissanMake": ("Nissan", ["Pathfinder", "Qashqai", "XTrail"]),
        "ToyotaMake": ("Toyota", ["RAV4", "Corolla", "Camry"]),
        "HondaMake": ("Honda", ["Civic", "Accord", "CRV"]),
    }
    for _, (make_name, models_list) in seed.items():
        make = CarMake.objects.create(name=make_name, description=f"{make_name} models")
        for m in models_list:
            CarModel.objects.create(car_make=make, name=m, dealer_id=1, type="SUV", year=2023)


# ---------- Dealer / review proxy views (talk to Node/Express + MongoDB) ----------

def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            review_detail['sentiment'] = response.get('sentiment', 'neutral')
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


@csrf_exempt
def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status": 200})
        except Exception:
            return JsonResponse({"status": 401, "message": "Error posting review"})
    return JsonResponse({"status": 403, "message": "Unauthorized"})


# ---------- Sentiment analysis passthrough (used directly by Task 16 curl) ----------

def analyze_review(request, text):
    response = analyze_review_sentiments(text)
    return JsonResponse(response)
