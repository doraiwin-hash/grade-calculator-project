# To-Do List

A responsive To-Do List app built for the Entri Elevate Full Stack Development course (Module: JavaScript, Assignment 8).

## Features

- Add tasks with a title, description, priority (low/medium/high), due date, and category.
- Tasks are rendered as `<li>` items using DOM `createElement` methods.
- Click a task's title to toggle a strike-through, marking it complete.
- Edit any task's fields in place, or delete it via DOM `remove`.
- Filter by All / Pending / Completed, and sort by newest, due date, or priority.
- Overdue tasks are flagged, and a completed/total summary is shown.
- Tasks persist across page reloads via `localStorage`.
- Responsive, card-based layout styled with Bootstrap.

## Project Structure

```
.
├── index.html      # Markup: textfield, add task button, task <ul>
├── css/
│   └── style.css   # Custom styling on top of Bootstrap
└── js/
    └── script.js   # EventListeners for add/delete/toggle-complete
```

## Running Locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Live Demo

Hosted via GitHub Pages: _link added after deployment_
