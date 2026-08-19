// Performs the requested operation on the two input boxes and displays the result.
function calculate(operation) {
  const num1 = document.getElementById("num1").valueAsNumber;
  const num2 = document.getElementById("num2").valueAsNumber;

  // Square and cube only need Number 1
  if (operation === "square" || operation === "cube") {
    if (isNaN(num1)) {
      alert("Please enter Number 1.");
      return;
    }
    const result = operation === "square" ? num1 ** 2 : num1 ** 3;
    showResult(result);
    return;
  }

  // Remaining operations need both numbers
  if (isNaN(num1) || isNaN(num2)) {
    alert("Please enter both Number 1 and Number 2.");
    return;
  }

  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      if (num2 === 0) {
        alert("Cannot divide by zero.");
        return;
      }
      result = num1 / num2;
      break;
    default:
      return;
  }

  showResult(result);
}

function showResult(result) {
  // Round to avoid long floating point tails (e.g. 0.1 + 0.2)
  const rounded = Math.round(result * 100000) / 100000;
  document.getElementById("resultValue").textContent = rounded;
  document.getElementById("resultPanel").classList.remove("hidden");
}

function resetCalculator() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("resultPanel").classList.add("hidden");
}
