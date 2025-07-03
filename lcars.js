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
        /*const aggressionValue = jsonData.table.rows[4].c[1].v;  // B3
        const initiativeValue = jsonData.table.rows[6].c[1].v;  // B3
        const disciplineValue = jsonData.table.rows[5].c[1].v;  // B3
        const skillValue = jsonData.table.rows[8].c[1].v;  // B3
        const opennessValue = jsonData.table.rows[7].c[1].v;  // B3*/
        
        // Update the HTML elements with the retrieved values
        document.getElementById("sheetValue").innerText = courageValue;
        document.getElementById("renownValue").innerText = renownValue;
        document.getElementById("woundsValue").innerText = woundsValue;
        document.getElementById("experienceValue").innerText = experienceValue;
        /*document.getElementById("aggressionValue").innerText = aggressionValue;
        document.getElementById("iniativeValue").innerText = initiativeValue;
        document.getElementById("disciplineValue").innerText = disciplineValue;
        document.getElementById("disciplineValue").innerText = opennessValue;
        document.getElementById("skillValue").innerText = skillValue;*/
    })
    .catch(error => {
        console.error("Error loading sheet data:", error);
        document.getElementById("sheetValue").innerText = "Error";
        document.getElementById("renownValue").innerText = "Error";
        document.getElementById("woundsValue").innerText = "Error";
        document.getElementById("experienceValue").innerText = "Error";
       });

//Experimental Google Sheets Call

 const CLIENT_ID = '864033286840-qjpbbdnj3ujilcfc6dfl3qpu553caldr.apps.googleusercontent.com';  // Replace with your actual client ID
  const API_KEY = 'AIzaSyCs6niQggMQJSQJC1RxyLiHFEnCu4W-BpQ';  // Replace with your actual API key
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
  const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
  const SHEET_ID = '1cq8a8QDSOBE4B0JpwqGLRHkL3PiNGNcGxnNHdvFAryU';
  const RANGE = 'Sheet1!B2';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  document.addEventListener('DOMContentLoaded', () => {
    // Load GAPI
    gapi.load('client', initializeGapiClient);
  });

  // GAPI client init
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  // GIS token client init
  window.onload = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // will be set during request
    });
    gisInited = true;
    maybeEnableButtons();
  };

  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.querySelectorAll('nav a').forEach(btn => btn.disabled = false);
      document.getElementById("status").textContent = "Ready!";
    }
  }

  function changeValue(action) {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        console.error(resp);
        document.getElementById("status").textContent = "Authentication error.";
        return;
      }

      try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: RANGE
        });

        const currentValue = parseInt(response.result.values?.[0]?.[0] ?? '1', 10);
        let newValue = currentValue;

        if (action === 'increase') {
          newValue = Math.min(currentValue + 1, 3);
        } else if (action === 'decrease') {
          newValue = Math.max(currentValue - 1, 1);
        }

        await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: RANGE,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[newValue]],
          }
        });

        document.getElementById("status").textContent = `Cell B2 updated to ${newValue}`;
      } catch (err) {
        console.error("Error updating the cell", err);
        document.getElementById("status").textContent = "Update failed.";
      }
    };

    // Request access token (will prompt user if not previously authorized)
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

