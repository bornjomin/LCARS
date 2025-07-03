document.addEventListener("touchstart", function() {},false);
let mybutton = document.getElementById("topBtn");
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


fetch('https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/1cq8a8QDSOBE4B0JpwqGLRHkL3PiNGNcGxnNHdvFAryU/gviz/tq?tqx=out:json&sheet=sheet1')
    .then(response => response.text())
    .then(data => {
        // Clean Google Sheets API response to get the JSON part
        const jsonData = JSON.parse(data.substring(47).slice(0, -2)); 
        
        // Log the parsed JSON data to inspect its structure
        console.log("Parsed JSON data:", jsonData);
        
        // Access values from cells B2, B3, B4, and B5
        const courageValue = jsonData.table.rows[0].c[1].v;  // B2
        const renownValue = jsonData.table.rows[1].c[1].v;  // B3
        const woundsValue = jsonData.table.rows[2].c[1].v;  // B4
        const experienceValue = jsonData.table.rows[3].c[1].v;  // B5
        const aggressionValue = jsonData.table.rows[4].c[1].v;  // B3
        const initiativeValue = jsonData.table.rows[6].c[1].v;  // B3
        const disciplineValue = jsonData.table.rows[5].c[1].v;  // B3
        const skillValue = jsonData.table.rows[8].c[1].v;  // B3
        const opennessValue = jsonData.table.rows[7].c[1].v;  // B3
        
        // Update the HTML elements with the retrieved values
        document.getElementById("sheetValue").innerText = courageValue;
        document.getElementById("renownValue").innerText = renownValue;
        document.getElementById("woundsValue").innerText = woundsValue;
        document.getElementById("experienceValue").innerText = experienceValue;
        document.getElementById("aggressionValue").innerText = aggressionValue;
        document.getElementById("iniativeValue").innerText = initiativeValue;
        document.getElementById("disciplineValue").innerText = disciplineValue;
        document.getElementById("disciplineValue").innerText = opennessValue;
        document.getElementById("skillValue").innerText = skillValue;
    })
    .catch(error => {
        console.error("Error loading sheet data:", error);
        document.getElementById("sheetValue").innerText = "Error";
        document.getElementById("renownValue").innerText = "Error";
        document.getElementById("woundsValue").innerText = "Error";
        document.getElementById("experienceValue").innerText = "Error";
       });

//Experimental Google Sheets Call
let isAuthenticated = false;
    let gapiLoaded = false;

    // Initialize the Google API Client
    function initApi() {
      gapi.load('client:auth2', () => {
        google.accounts.oauth2.GetAuthInstance({
          client_id: '864033286840-qjpbbdnj3ujilcfc6dfl3qpu553caldr.apps.googleusercontent.com' // Replace with your client ID
        }).then(() => {
          gapiLoaded = true;
          if (isAuthenticated) {
            document.getElementById("status").textContent = "Ready to modify spreadsheet!";
          }
        });
      });
    }

    // Authenticate the user
    function authenticate() {
      google.accounts.oauth2.getAuthInstance().signIn().then(() => {
        isAuthenticated = true;
        document.getElementById("status").textContent = "Authenticated! Ready to update value.";
      }).catch(error => {
        console.error("Error during authentication", error);
        document.getElementById("status").textContent = "Authentication failed!";
      });
    }

    // Function to increase or decrease the cell B2 value
    function changeValue(action) {
      if (!gapiLoaded) {
        initApi();
      }

      if (!isAuthenticated) {
        authenticate();
      }

      // Prepare to update the sheet
      const sheetId = "1cq8a8QDSOBE4B0JpwqGLRHkL3PiNGNcGxnNHdvFAryU";  // Your sheet ID
      const range = "Sheet1!B2";  // Cell B2

      // Fetch current value of B2
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range
      }).then(response => {
        const currentValue = parseInt(response.result.values[0][0], 10) || 1;  // Default to 1 if value is not valid

        // Determine new value
        let newValue = currentValue;
        if (action === 'increase') {
          newValue = currentValue < 3 ? currentValue + 1 : 3; // Cap the value at 3
        } else if (action === 'decrease') {
          newValue = currentValue > 1 ? currentValue - 1 : 1; // Cap the value at 1
        }

        // Update cell B2 with the new value
        const updateRequest = {
          spreadsheetId: sheetId,
          range: range,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              [newValue]
            ]
          }
        };

        // Make the API request to update the value
        gapi.client.sheets.spreadsheets.values.update(updateRequest)
          .then(() => {
            document.getElementById("status").textContent = `Cell B2 updated to ${newValue}`;
          }).catch(error => {
            console.error("Error updating the cell", error);
            document.getElementById("status").textContent = "Failed to update the value.";
          });
      }).catch(error => {
        console.error("Error fetching the cell value", error);
        document.getElementById("status").textContent = "Failed to fetch the current value.";
      });
    }

    // Load the Google API client
    gapi.load("client", () => {
      gapi.client.init({
        apiKey: 'AIzaSyCs6niQggMQJSQJC1RxyLiHFEnCu4W-BpQ', // Add your API Key here
        clientId: '864033286840-qjpbbdnj3ujilcfc6dfl3qpu553caldr.apps.googleusercontent.com', // Add your client ID
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets',
      }).then(() => {
        gapiLoaded = true;
      }).catch(error => {
        console.error("Error loading Google API", error);
      });
    });

