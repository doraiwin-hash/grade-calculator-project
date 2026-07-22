// Shared grading logic used by BOTH the grid form and the prompt() version below,
// so the A+/A/B/C/D/F rules only live in one place.
function getGrade(average) {
  if (average >= 90) return "A+";
  if (average >= 80) return "A";
  if (average >= 70) return "B";
  if (average >= 60) return "C";
  if (average >= 50) return "D";
  return "F";
}

// ---- Grid form version (primary UI) ----------------------------------

function calculateGradeForm() {
  // Step 1: Collect marks from the 5 number inputs on the page
  // valueAsNumber is NaN if the field is empty or non-numeric
  const marks = [
    document.getElementById("mark1").valueAsNumber,
    document.getElementById("mark2").valueAsNumber,
    document.getElementById("mark3").valueAsNumber,
    document.getElementById("mark4").valueAsNumber,
    document.getElementById("mark5").valueAsNumber,
  ];

  const invalid = marks.some((m) => isNaN(m) || m < 0 || m > 100);
  if (invalid) {
    alert("Please enter a valid mark (0-100) for every subject.");
    return;
  }

  // Step 2 & 3: Total and average
  const total = marks.reduce((sum, m) => sum + m, 0);
  const average = total / marks.length;

  // Step 4: Grade
  const grade = getGrade(average);

  // Step 5: Display results in the on-page results panel
  document.getElementById("totalMarks").textContent = total;
  document.getElementById("averageMarks").textContent = average.toFixed(2);
  document.getElementById("gradeResult").textContent = grade;
  document.getElementById("resultsPanel").classList.remove("hidden");
}

function resetForm() {
  ["mark1", "mark2", "mark3", "mark4", "mark5"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("resultsPanel").classList.add("hidden");
}

// ---- prompt()/alert() version (kept to match the assignment spec) ----

function calculateGrade() {
  // Step 1: Collect marks for 5 subjects using prompt()
  // prompt() always returns a string, so we wrap it in Number() to convert it
  let mark1 = Number(prompt("Enter marks for Subject 1 (out of 100):"));
  let mark2 = Number(prompt("Enter marks for Subject 2 (out of 100):"));
  let mark3 = Number(prompt("Enter marks for Subject 3 (out of 100):"));
  let mark4 = Number(prompt("Enter marks for Subject 4 (out of 100):"));
  let mark5 = Number(prompt("Enter marks for Subject 5 (out of 100):"));

  // Guard against non-numeric input (Number("") or Number("abc") is NaN)
  if ([mark1, mark2, mark3, mark4, mark5].some(isNaN)) {
    alert("Please enter valid numbers for all 5 subjects.");
    return;
  }

  // Step 2: Calculate total marks
  let total = mark1 + mark2 + mark3 + mark4 + mark5;

  // Step 3: Calculate average marks
  let average = total / 5;

  // Step 4: Assign a grade based on the average
  let grade = getGrade(average);

  // Step 5: Display the results using alert()
  alert(
    "Total Marks: " + total +
    "\nAverage Marks: " + average.toFixed(2) +
    "\nGrade: " + grade
  );
}
