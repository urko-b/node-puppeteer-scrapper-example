# Puppeteer Scrapper Example

This project uses firebase functions to init a web server that exposes 2 functions: _scrapeMetaTags_ and _scrapeCourses_

# scrapeMetaTags

This function just grab data from a url received in post payload

Request:

```
curl --data "text=%20https://fireship.io%20"  http://localhost:5000/function-examples/us-central1/scrapeMetaTags
```

Response:

```
[
    {
        "url": "https://fireship.io",
        "title": "Fireship.io",
        "favicon": "/img/favicon.png",
        "description": "Training and Consulting for App Developers | Full Courses, Video Lessons, Chat, and More",
        "image": "https://fireship.io/img/covers/default.png"
    }
]
```

# scrapeCourses

This function just grab data from a url received in post payload

Request:

```
curl http://localhost:5000/function-examples/us-central1/scrapeCourses
```

Response:

```
[
    {
        "courseUrl": "https://www.edx.org/es/course/introduction-to-big-data-6",
        "title": "Introduction to Big Data",
        "teacher": "Universidades:Microsoft",
        "courseStartsInfo": "Disponibilidad:En este momentoA tu propio ritmo"
    },
    {
        "courseUrl": "https://www.edx.org/es/course/big-data-sin-misterios-4",
        "title": "Big Data sin misterios",
        "teacher": "Universidades:IDBx",
        "courseStartsInfo": "Disponibilidad:En este momentoA tu propio ritmo"
]
```
