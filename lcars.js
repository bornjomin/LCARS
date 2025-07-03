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


    const CLIENT_ID = '864033286840-qjpbbdnj3ujilcfc6dfl3qpu553caldr.apps.googleusercontent.com'; // ✅ Replace
    const API_KEY = 'AIzaSyCs6niQggMQJSQJC1RxyLiHFEnCu4W-BpQ'; // ✅ Replace
    const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
    const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
    const SHEET_ID = '1cq8a8QDSOBE4B0JpwqGLRHkL3PiNGNcGxnNHdvFAryU';
    const RANGE = 'Sheet1!B2';

    let domReady = false;
    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    function onGapiLoad() {
      gapi.load('client', initializeGapiClient);
    }

    async function initializeGapiClient() {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      maybeEnableButtons();
    }
 window.onload = () => {
      domReady = true;
      maybeEnableButtons();

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Set later
      });

      gisInited = true;
      maybeEnableButtons();

      tokenClient.requestAccessToken({
        prompt: '',
        callback: () => {
          loadSheetData();
        }
      });
    };

    function maybeEnableButtons() {
      if (gapiInited && gisInited && domReady) {
        const statusEl = document.getElementById("status");
        if (statusEl) {
          statusEl.textContent = "Ready!";
        }
        document.querySelectorAll('nav a').forEach(btn => btn.removeAttribute('disabled'));
      }
    }

    function changeValue(action) {
      if (gapi.client.getToken()) {
        runUpdate(action);
      } else {
        tokenClient.callback = (resp) => {
          if (resp.error) {
            document.getElementById("status").textContent = "Authentication failed.";
            return;
          }
          runUpdate(action);
        };
        tokenClient.requestAccessToken({ prompt: '' });
      }
    }

    async function runUpdate(action) {
      try {
        const getResp = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: RANGE,
        });

        const currentValue = parseInt(getResp.result.values?.[0]?.[0] ?? '1', 10);
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
          resource: { values: [[newValue]] },
        });

        document.getElementById("status").textContent = `Cell B2 updated to ${newValue}`;
        loadSheetData(); // Refresh values after update
      } catch (err) {
        console.error("Error updating sheet:", err);
        document.getElementById("status").textContent = "Failed to update.";
      }
    }

    async function loadSheetData() {
      try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: 'Sheet1!B2:B6'
        });

        const values = response.result.values;

        const courageValue = values[0]?.[0] ?? '';
        const renownValue = values[1]?.[0] ?? '';
        const woundsValue = values[2]?.[0] ?? '';
        const experienceValue = values[3]?.[0] ?? '';
        const aggressionValue = values[4]?.[0] ?? '';

        document.getElementById("sheetValue").innerText = courageValue;
        document.getElementById("renownValue").innerText = renownValue;
        document.getElementById("woundsValue").innerText = woundsValue;
        document.getElementById("experienceValue").innerText = experienceValue;
        document.getElementById("aggressionValue").innerText = aggressionValue;

      } catch (error) {
        console.error("Error fetching sheet data:", error);
        document.getElementById("sheetValue").innerText = "Error";
        document.getElementById("renownValue").innerText = "Error";
        document.getElementById("woundsValue").innerText = "Error";
        document.getElementById("experienceValue").innerText = "Error";
        document.getElementById("aggressionValue").innerText = "Error";
      }
    }
    
