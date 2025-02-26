let editingIndex = -1;  // Tracks which item is being edited

function register() {
    let username = document.getElementById("regUsername").value;
    let password = document.getElementById("regPassword").value;
    if (username && password) {
        localStorage.setItem(username, password);
        alert("Registration successful! You can now log in.");
    } else {
        alert("Please fill in all fields.");
    }
}

function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;
    let storedPassword = localStorage.getItem(username);
    if (storedPassword && storedPassword === password) {
        alert("Login successful!");
        document.getElementById("authContainer").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    } else {
        alert("Invalid username or password.");
    }
}

function logout() {
    document.getElementById("authContainer").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
}

// Function to save data to localStorage
function saveData() {
    let input = document.getElementById("userInput").value;
    if (input) {
        let data = JSON.parse(localStorage.getItem("savedData")) || [];
        data.push(input);
        localStorage.setItem("savedData", JSON.stringify(data));
        displayData();
        document.getElementById("userInput").value = ""; // Clear input
    }
}

// Function to display saved data
function displayData() {
    let data = JSON.parse(localStorage.getItem("savedData")) || [];
    let dataList = document.getElementById("dataList");
    dataList.innerHTML = ""; // Clear previous list

    data.forEach((item, index) => {
        let li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => startEditing(index);  // Allow selection for editing
        dataList.appendChild(li);
    });
}

// Function to start editing a data item
function startEditing(index) {
    let data = JSON.parse(localStorage.getItem("savedData")) || [];
    document.getElementById("editInput").value = data[index];
    editingIndex = index;
}

// Function to edit the selected data item
function editData() {
    let newInput = document.getElementById("editInput").value;
    if (editingIndex !== -1 && newInput) {
        let data = JSON.parse(localStorage.getItem("savedData")) || [];
        data[editingIndex] = newInput;
        localStorage.setItem("savedData", JSON.stringify(data));
        displayData();
        cancelEdit(); // Clear edit mode
    }
}

// Function to cancel editing
function cancelEdit() {
    editingIndex = -1;
    document.getElementById("editInput").value = "";
}

// Function to handle multiple file uploads
function handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const pdfList = document.getElementById("pdfList");

    // Get all uploaded files
    const files = fileInput.files;

    if (files.length > 0) {
        // Iterate over all files and display them if they are PDFs
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type === "application/pdf") {
                // Save file name and URL to localStorage
                let pdfData = JSON.parse(localStorage.getItem("uploadedPDFs")) || [];
                let fileURL = URL.createObjectURL(file);
                pdfData.push({ name: file.name, url: fileURL });
                localStorage.setItem("uploadedPDFs", JSON.stringify(pdfData));

                // Display uploaded PDFs
                displayPDFs();
            } else {
                alert("Please upload only PDF files.");
            }
        }
    }
}

// Function to display uploaded PDFs
function displayPDFs() {
    const pdfList = document.getElementById("pdfList");
    const pdfData = JSON.parse(localStorage.getItem("uploadedPDFs")) || [];
    pdfList.innerHTML = "";  // Clear existing PDFs

    pdfData.forEach(pdf => {
        const listItem = document.createElement("li");
        listItem.textContent = `Uploaded file: ${pdf.name}`;

        // Create a link to view the PDF
        const link = document.createElement("a");
        link.href = pdf.url; // Use the stored URL for the PDF
        link.textContent = "View PDF";
        link.target = "_blank"; // Open in a new tab

        listItem.appendChild(link);
        pdfList.appendChild(listItem);
    });
}

// Load saved data and PDFs on page load
window.onload = function() {
    displayData();
    displayPDFs();  // Load the previously uploaded PDFs
};