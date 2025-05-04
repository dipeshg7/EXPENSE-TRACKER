let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

document.getElementById("userName").textContent = loggedInUser.name;

let expenses = JSON.parse(localStorage.getItem("expenses_" + loggedInUser.email)) || [];

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalDisplay = document.getElementById("totalAmount");

function renderExpenses() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((item, index) => {
    total += item.amount;
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <div>${item.description}</div>
      <div>
        ₹${item.amount.toFixed(2)}
        <button class="btn btn-sm btn-warning mx-1" onclick="editExpense(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  totalDisplay.textContent = total.toFixed(2);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid details.");
    return;
  }

  expenses.push({ description, amount });
  saveExpenses();
  form.reset();
});

function saveExpenses() {
  localStorage.setItem("expenses_" + loggedInUser.email, JSON.stringify(expenses));
  renderExpenses();
}

function deleteExpense(index) {
  if (confirm("Delete this expense?")) {
    expenses.splice(index, 1);
    saveExpenses();
  }
}

function editExpense(index) {
  const item = expenses[index];
  const newDesc = prompt("Edit description:", item.description);
  const newAmount = parseFloat(prompt("Edit amount:", item.amount));

  if (newDesc && !isNaN(newAmount) && newAmount > 0) {
    expenses[index] = { description: newDesc, amount: newAmount };
    saveExpenses();
  } else {
    alert("Invalid input.");
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Initial render
renderExpenses();
