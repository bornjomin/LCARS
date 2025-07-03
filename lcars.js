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
fetch('PointsData.csv')
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
  });
