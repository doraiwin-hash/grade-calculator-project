# Product Management App

A Product Management Web Application built for the Entri Elevate Full Stack Development course (Module: JavaScript, Assignment 9), performing CRUD operations against the [Fake Store API](https://fakestoreapi.com/products) with `fetch` and `async`/`await`.

## Features

- **View** — fetches all products on load and displays image, title, category and price.
- **Add** — a form (title, price, category, description, image URL) sends a `POST` request and appends the new product to the grid.
- **Edit** — "Edit" loads a product's details into the form and sends a `PUT` request on save, updating the UI immediately.
- **Delete** — "Delete" sends a `DELETE` request and removes the product's card.
- **Search** — filters the displayed products by title as you type.
- **Loading & error handling** — a status message shows while requests are in flight, and a friendly error message if any API call fails.

Since the Fake Store API is a mock backend (writes aren't actually persisted), the app keeps a local copy of the fetched products and updates it after each successful request so the UI reflects create/update/delete immediately.

## Project Structure

```
.
├── index.html      # Markup: product form, search bar, product grid
├── css/
│   └── style.css   # Custom styling on top of Bootstrap
└── js/
    └── script.js   # Fetch-based CRUD against the Fake Store API
```

## Running Locally

Open `index.html` directly in a browser, or serve the folder with any static file server. An internet connection is required to reach the Fake Store API.

## Live Demo

Hosted via GitHub Pages: _link added after deployment_
