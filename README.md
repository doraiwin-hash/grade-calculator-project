# Grade Calculator

A simple JavaScript Grade Calculator built for the Entri Elevate Full Stack Development course (Module: JavaScript, Assignment 6).

## Features

- Enter marks (out of 100) for 5 subjects in an on-page grid form (Mathematics, Science, English, Social Studies, Computer Science).
- Calculates total marks and average marks.
- Assigns a letter grade using if-else conditional logic:
  - A+ for average >= 90
  - A for average 80-89
  - B for average 70-79
  - C for average 60-69
  - D for average 50-59
  - F for average < 50
- Displays Total, Average, and Grade in a results panel at the bottom of the page.
- Also includes a secondary `prompt()` / `alert()` based flow (per the original assignment spec) accessible via the link at the bottom of the page.

## Project Structure

```
.
├── INDEX.html      # Markup, links css/js
├── css/
│   └── style.css   # Styling (grid layout, results panel, buttons)
└── js/
    └── script.js   # Grading logic for both the grid form and the prompt() flow
```

## Running Locally

Open `INDEX.html` directly in a browser, or serve the folder with any static file server.

## Live Demo

Hosted via GitHub Pages: _link added after deployment_
