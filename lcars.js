document.addEventListener("touchstart", function() {}, false);
let mybutton = document.getElementById("topBtn");
window.onscroll = function () {
  scrollFunction();
};
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

const CLIENT_ID = '864033286840-qjpbbdnj3ujilcfc6dfl3qpu553caldr.apps.googleusercontent.com'; // Replace with your actual client ID
const API_KEY = 'AIzaSyCs6niQggMQJSQJC1RxyLiHFEnCu4W-BpQ'; // Replace with your actual API key
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SHEET_ID = '1cq8a8QDSOBE4B0JpwqGLRHkL3PiNGNcGxnNHdvFAryU';
const COURAGE_RANGE = 'Sheet1!B2';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let domReady = false;

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
    callback: '', // Set dynamically later
  });

  gisInited = true;
  maybeEnableButtons();
};

function maybeEnableButtons() {
  if (gapiInited && gisInited && domReady) {
    const statusEl = document.getElementById("status");
    if (statusEl) {
      statusEl.textContent = "Ready!";
    }

    document.querySelectorAll('nav a').forEach((btn) => btn.removeAttribute('disabled'));

    // Authenticate and load data only once
    if (!gapi.client.getToken()) {
      tokenClient.callback = (resp) => {
        if (resp.error) {
          console.error("❌ Token error:", resp);
          document.getElementById("status").textContent = "Authentication failed.";
          return;
        }
        loadSheetData();
      };
      tokenClient.requestAccessToken({ prompt: '' });
    } else {
      loadSheetData();
    }
  }
}

async function changeValue(action) {
  if (gapi.client.getToken()) {
    await runUpdate(action);
  } else {
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        console.error("❌ Token error:", resp);
        document.getElementById("status").textContent = "Authentication failed.";
        return;
      }
      await runUpdate(action);
    };
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

async function runUpdate(action) {
  try {
    const getResp = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: COURAGE_RANGE,
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
      range: COURAGE_RANGE,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[newValue]] },
    });

    // Update the Courage display element directly:
    const courageEl = document.getElementById("sheetValue");
    if (courageEl) {
      courageEl.textContent = newValue;
    }

    // Optionally reload all sheet data to update other fields:
    loadSheetData();

  } catch (err) {
    console.error("Error updating sheet:", err);
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "Failed to update.";
  }
}

async function loadSheetData() {
  if (!domReady) {
    setTimeout(loadSheetData, 100);
    return;
  }

  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A2:B6',
    });

    console.log("✅ Google Sheets API response:", response);

    const rows = response.result.values;
    if (!rows || !Array.isArray(rows)) {
      throw new Error("No data returned from sheet.");
    }

    const valueMap = {};
    rows.forEach((row) => {
      const key = row[0];
      const val = row[1];
      valueMap[key] = val;
    });

    console.log("✅ Parsed valueMap:", valueMap);

    const updateText = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value ?? '—';
      } else {
        console.warn(`⚠️ Element with id "${id}" not found`);
      }
    };

    updateText("sheetValue", valueMap["Courage"]);
    updateText("renownValue", valueMap["Renown"]);
    updateText("woundsValue", valueMap["Wounds"]);
    updateText("experienceValue", valueMap["Experience"]);
    updateText("aggressionValue", valueMap["Aggression"]);
  } catch (error) {
    console.error("❌ Error fetching sheet data:", error);
    const ids = [
      "sheetValue",
      "renownValue",
      "woundsValue",
      "experienceValue",
      "aggressionValue",
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "Error";
    });
  }
}

// Expose to HTML inline onclick handlers
window.changeValue = changeValue;

//Toggle between main and attributes views
// Intercept click on "Attributes" link
//	document.getElementById('attributes-link').addEventListener('click', function(event) {
//		event.preventDefault(); // Prevent navigation
//
		// Hide main content
//		document.getElementById('main-content').style.display = 'none';

		// Show Attributes content
//		document.getElementById('attributes-content').style.display = 'block';
	//});

//New toggle for additional pages:
// List of all dynamic sections you want to toggle
	const sections = ['main-content', 'attributes-content', 'status-content', 'mission-content', 'skills-content'];
	document.addEventListener('DOMContentLoaded', function () {
	showSection('main-content'); // Show only main content by default
	});

	// Helper function to show one section and hide the others
	function showSection(sectionId) {
		sections.forEach(id => {
			const el = document.getElementById(id);
			if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
		});
	}

	// Attach event listeners for each link
	document.getElementById('attributes-link').addEventListener('click', function(event) {
		event.preventDefault();
		showSection('attributes-content');
	});

	document.getElementById('status-link').addEventListener('click', function(event) {
		event.preventDefault();
		showSection('status-content');
	});

	document.getElementById('mission-link').addEventListener('click', function(event) {
		event.preventDefault();
		showSection('mission-content');
	});

	document.getElementById('skills-link').addEventListener('click', function(event) {
		event.preventDefault();
		showSection('skills-content');
	});
