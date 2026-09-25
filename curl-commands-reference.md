# cURL Commands Reference

Run your Django server (`python manage.py runserver`) and your Node/Express
service (`node server.js` inside `database/`) before running these. Save
each command **and its full output** into the exact filename noted (no
extension), as required by the grader.

## Task 5 — loginuser
```bash
curl -v -X POST http://localhost:8000/djangoapp/login \
  -H "Content-Type: application/json" \
  -d '{"userName": "testuser", "password": "testpass123"}'
```

## Task 6 — logoutuser
```bash
curl -v http://localhost:8000/djangoapp/logout
```

## Task 8 — getdealerreviews
```bash
curl http://localhost:8000/djangoapp/reviews/dealer/1
```

## Task 9 — getalldealers
```bash
curl http://localhost:8000/djangoapp/get_dealers
```

## Task 10 — getdealerbyid
```bash
curl http://localhost:8000/djangoapp/dealer/1
```

## Task 11 — getdealersbyState (Kansas)
```bash
curl http://localhost:8000/djangoapp/get_dealers/Kansas
```

## Task 14/15 — getallcarmakes
```bash
curl http://localhost:8000/djangoapp/get_cars
```

## Task 16 — analyzereview
```bash
curl "http://localhost:8000/djangoapp/analyze/Fantastic%20services"
```

---

### Notes
- Register a test user first via the Sign-Up page or `/djangoapp/register`
  if login (Task 5) fails with an unauthenticated user.
- If the Node service isn't seeded yet, the dealer/review endpoints will
  return empty arrays — check `database/server.js` runs its seed step on
  startup, or run a seed script manually.
- For Task 16, if you get a "sentiment service down" fallback, make sure
  the Flask microservice is running on port 5050 and `sentiment_analyzer_url`
  is set correctly (see `server/djangoapp/restapis.py`).
