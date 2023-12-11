
const token = localStorage.getItem("token");


function saveToLocalStorage(event) {
  

  const Expenses = document.getElementById("expenseAmount").value;
  const Description = document.getElementById("description").value;
  const Category = document.getElementById("Category").value;

  const obj = {
    Expenses: Expenses,
    Description: Description,
    Category: Category,
  };

  axios
    .post("http://18.212.240.45:5000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((res) => {
      const newExpense = res.data.newExpenseDetail;
      // Wrap the response object in an array 
      showNewUsersOnScreen([newExpense]);
    })
    .catch((err) => {
      console.error("Error adding user:", err);
      // Assuming that there is some sort of error message displayed on the screen
      showErrorOnScreen("Failed to add user. Please try again later.");
    });
}


let currentPage = 1;
window.addEventListener("DOMContentLoaded", () => {
  
  const page = 1;
  const itemsPerPageDropdown = document.getElementById("itemsPerPage");
   // Load the preferred items per page from local storage, or set a default value
   let itemsPerPage = localStorage.getItem("itemsPerPage") || 10;
   itemsPerPageDropdown.value = itemsPerPage;
 
   // Event listener for the items per page dropdown change
   itemsPerPageDropdown.addEventListener("change", (event) => {
     itemsPerPage = event.target.value;
     // Save the selected items per page to local storage
     localStorage.setItem("itemsPerPage", itemsPerPage);
     currentPage = 1;
     getExpenses(currentPage, itemsPerPage);
   });
 
  
   getExpenses(page, itemsPerPage);
});

function getExpenses(page, itemsPerPage) {
  axios
    .get(`http://18.212.240.45:5000/expense/get-expense?page=${page}&itemsPerPage=${itemsPerPage}`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      const data = res.data;
      showNewUsersOnScreen(data.allExpenses);
      showPagination(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function showNewUsersOnScreen(expenses) {
  
  const parentNode = document.getElementById("listOfUsers");
  parentNode.innerHTML = '';

  expenses.forEach((expense) => {
    const userId = expense.id;
    const childHTML = `<li class="list-group-item" id=${userId}>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${expense.Expenses}</h5>
          <p class="mb-1">${expense.Description} - ${expense.Category}</p>
        </div>
        <div>
          <button class="btn btn-danger btn-sm mr-2" onclick="deleteUser('${userId}')">Delete</button>
          <button class="btn btn-warning btn-sm" onclick="editUserDetails('${expense.Expenses}','${expense.Description}','${expense.Category}','${userId}')">Edit</button>
        </div>
      </div>
    </li>`;
    parentNode.innerHTML += childHTML;
  });
}


function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = '';

  if (hasPreviousPage) {
    const btnPrevious = createPageButton(previousPage, 'Previous', 'btn-secondary');
    pagination.appendChild(btnPrevious);
  }

  const btnCurrent = createPageButton(currentPage, currentPage, 'btn-primary');
  btnCurrent.disabled = true;
  pagination.appendChild(btnCurrent);

  if (hasNextPage) {
    const btnNext = createPageButton(nextPage, 'Next', 'btn-secondary');
    pagination.appendChild(btnNext);
  }
}

function createPageButton(pageNumber, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.innerText = buttonText;
  button.className = `btn ${buttonClass} mx-1`;
  button.addEventListener('click', () => {
    currentPage = pageNumber;
    getExpenses(currentPage);
  });
  return button;
}

// edit User

function editUserDetails(Expenses, Description, Category, userId) {
  document.getElementById("expenseAmount").value = Expenses;
  document.getElementById("description").value = Description;
  document.getElementById("Category").value = Category;

  deleteUser(userId);
}

function deleteUser(userId) {
  axios
    .delete(`http://18.212.240.45:5000/expense/delete-expense/${userId}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeUserFromScreen(userId);
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeUserFromScreen(userId) {
  const childNodeToBeDeleted = document.getElementById(userId);
  if (childNodeToBeDeleted) {
    childNodeToBeDeleted.remove();
  }
}

window.addEventListener("DOMContentLoaded", async function () {
  
  try {
    const response = await axios.get(
      "http://18.212.240.45:5000/purchase/premiumstatus",
      {
        headers: { Authorization: token },
      }
    );

    

    if (response.data.isPremiumUser) {
      
      
      // User is a premium user, hide the "Buy Premium" button
      const buyPremiumButton = document.getElementById("rzp-button");
      buyPremiumButton.style.display = "none";

      // Display the premium user message
      const premiumMessage = document.getElementById("premium-message");
      premiumMessage.textContent = "You are a Premium User";

       // Hide the message after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    premiumMessage.style.display = "none";
  }, 3000);

      //Display the LeaderBoard Button
      const parent_Node = document.getElementById("leaderboard-button-parent");
      const child_HTML = `  <button id="leaderboard-button" class="btn btn-outline-secondary btn-sm">Show Leaderboard</button>`;
      parent_Node.innerHTML = parent_Node.innerHTML + child_HTML;

      {
        document
          .getElementById("leaderboard-button")
          .addEventListener("click", async function () {
            try {
             
              const response = await axios.get(
                "http://18.212.240.45:5000/premium/leaderboard",
                {
                  headers: { Authorization: token },
                }
              );

              // Process the leaderboard data and display it on the page
              const table = document.createElement("table");
              table.classList.add("table", "table-striped", "table-hover","table-bordered","border-primary");
              
              // Create the table header
              const thead = document.createElement("thead");
              const headerRow = document.createElement("tr");
              
              const nameHeader = document.createElement("th");
              nameHeader.textContent = "Name of Users";
              
              const expenseHeader = document.createElement("th");
              expenseHeader.textContent = "Total Expenses";
              
              headerRow.appendChild(nameHeader);
              headerRow.appendChild(expenseHeader);
              
              thead.appendChild(headerRow);
              table.appendChild(thead);
              
              // Create the table body
              const tbody = document.createElement("tbody");
              response.data.forEach((item) => {
                const row = document.createElement("tr");
              
                const nameCell = document.createElement("td");
                nameCell.textContent = item.name;
              
                const expenseCell = document.createElement("td");
                expenseCell.textContent = item.totalExpense;
              
                row.appendChild(nameCell);
                row.appendChild(expenseCell);
              
                tbody.appendChild(row);
              });
              
              table.appendChild(tbody);
              
     // Remove the existing leaderboard table (if any)
     const existingTable = document.getElementById("leaderboard-table");
     if (existingTable) {
       existingTable.remove();
     }
 
     // Set an ID for the new table and append it to the container with ID "leaderboard-list"
     table.id = "leaderboard-table";
     const tableContainer = document.getElementById("leaderboard-list");
     tableContainer.appendChild(table);
   } catch (err) {
     console.error(err);
     alert("Something Went Wrong");
   }
 });
      }
    } else {
      // User is not a premium user, display the "Buy Premium" button
      const buyPremiumButton = document.getElementById("rzp-button");
      buyPremiumButton.style.display = "block";
      //Hide the leader board Button
      const leaderBoardButton = document.getElementById(
        "leaderboard-button-parent"
      );
      leaderBoardButton.style.display = "none";
      // Hide the premium user message
      const premiumMessage = document.getElementById("premium-message");
      premiumMessage.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    alert("Something Went Wrong");
  }
  getExpenses(currentPage);
});

document.getElementById("rzp-button").onclick = async function (e) {
  try {
   
    const response = await axios.get(
      "http://18.212.240.45:5000/purchase/premiummembership",
      {
        headers: { Authorization: token },
      }
    );

   

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id, //For one time payment
      //This handler will handle the sucess full payment
      handler: async function (response) {
        await axios.post(
          "http://18.212.240.45:5000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        );

        // Replace the button with a message
        const premiumMessage = document.getElementById("premium-message");
        premiumMessage.textContent = "You are now a Premium User";
        const button = document.getElementById("rzp-button");
        button.style.display = "none"; // Hide the button
        alert("You are a Premium User Now");
        location.reload();
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  } catch (err) {
    console.error(err);
    alert("Something Went Wrong");
  }
};


function download() {
  
  axios
    .get("http://18.212.240.45:5000/expense/download", {
      headers: { "Authorization": token }, // Corrected the quotation marks
    })
    
    .then((response) => {
      
            
      if (response.status == 200) {
        // The backend is essentially sending a download link
        // which, if opened in the browser, will download the file
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(err.response.data.message);
  alert(err.response.data.message);
    });
}

