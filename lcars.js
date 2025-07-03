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

//Courage Points Calc
// Fetch the CSV file and process it
/*fetch('PointsData.csv')
  .then(response => response.text())  // Get the raw CSV text
  .then(data => {
    // Split the CSV into rows
    const rows = data.split('\n');
    
    // Parse the rows, splitting by comma and removing any empty rows
    const parsedData = rows.map(row => row.split(',')).filter(row => row.length > 1);
    
    // Loop through the rows to find the "Courage" entry
    parsedData.forEach((row, index) => {
      if (row[0].trim() === 'Courage' && index === 1) {  // Second row, first column
        // Get the value (second column, index 1)
        const courageValue = row[1].trim();
        
        // Update the HTML element with the retrieved value
        document.getElementById('sheetValue').textContent = courageValue;
      }
    });
  })
  .catch(error => {
    console.error('Error loading or parsing the CSV file:', error);
    // Handle error case, if needed
    document.getElementById('sheetValue').textContent = 'Error loading data';
  });*/

//Calculate Status Elements
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
        
        // Update the HTML elements with the retrieved values
        document.getElementById("sheetValue").innerText = courageValue;
        document.getElementById("renownValue").innerText = renownValue;
        document.getElementById("woundsValue").innerText = woundsValue;
        document.getElementById("experienceValue").innerText = experienceValue;
    })
    .catch(error => {
        console.error("Error loading sheet data:", error);
        document.getElementById("sheetValue").innerText = "Error";
        document.getElementById("renownValue").innerText = "Error";
        document.getElementById("woundsValue").innerText = "Error";
        document.getElementById("experienceValue").innerText = "Error";
       });
