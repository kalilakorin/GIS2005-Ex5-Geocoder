function getInputValue() {
  var userAddress = document.getElementById("userAddress").value;
  console.log("Address: " + userAddress);

  const Http = new XMLHttpRequest();
  const baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  const suffixUrl = ".json?access_token=";
  // Access token from mapbox account
  const access_token = "pk.eyJ1Ijoiam1mcmltbWwiLCJhIjoiY20wZzdid3JyMTkweTJpb3J1YnJ6b3BkNiJ9.AIq8-_n3FX7v_45I0Ria3w" 

  var async = false;
  var geocoderResults;
  var geocoderUrl = baseUrl + userAddress + suffixUrl + access_token;
  console.log("URL: " + geocoderUrl);

  Http.open("GET", geocoderUrl, async);

  Http.onreadystatechange = (e) => {
    geocoderResults = Http.responseText;  // info from the server
    console.log("ReadyState: " + Http.readyState);
    console.log("Status: " + Http.status);
    document.getElementById("geoResults").innerHTML = "All Geocoded results:<br>" + geocoderResults;
    writeCoords(geocoderResults);
  }

  Http.send();
}

function resetInputValue() {
  document.getElementById("userAddress").value = "";
  document.getElementById("geoResults").innerHTML = "";
  document.getElementById("coordinates-table").innerHTML = "";
  document.getElementById("most-likely-coordinates").innerHTML = "";
}

function writeCoords(geocoderResults) {
  let geoObj = JSON.parse(geocoderResults,(key, value)=>{
    return value;
  })
  console.log("GeoJson Object:");
  console.log(geoObj);
  
  console.log("Features:");
  let geoFeatures = geoObj.features;
  console.log(geoFeatures);

  console.log("Geo coordinate for 1st object:");
  let geoPt = geoFeatures[0].geometry.coordinates;
  console.log(geoPt);

  let geoPtText = "The most likely longitude and latitude is: " + geoPt[0] + ", " + geoPt[1];
  console.log(geoPtText);
  document.getElementById("most-likely-coordinates").innerHTML = geoPtText;

  drawCoordTable(geoFeatures);
}

function drawCoordTable(geoFeatures) {
  console.log("Coordinates:");
  var coordinateData = []
  coordinateData.push(["Location", "Longitude", "Latitude"]);

  // add the coordinates from geoFeatures to the table
  for (const i in geoFeatures) {
    coordinateData.push([(parseInt(i) + 1), geoFeatures[i].geometry.coordinates[0], geoFeatures[i].geometry.coordinates[1]]);
  }
  console.log(coordinateData);

  // generate a table with all possible address locations
  // Define table data
  const data = coordinateData;

  // Create table element
  const table = document.createElement('table');
  table.style.width = '70%';
  table.style.borderCollapse = 'collapse';

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data[0].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.border = '1px solid black';
      th.style.padding = '8px';
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  for (let i = 1; i < data.length; i++) {
      const row = document.createElement('tr');
      data[i].forEach(text => {
          const td = document.createElement('td');
          td.textContent = text;
          td.style.border = '1px solid black';
          td.style.padding = '8px';
          row.appendChild(td);
      });
      tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Append table to the container
  const container = document.getElementById('coordinates-table');
  document.getElementById("coordinates-table").innerHTML = "All potential coordinates:<br>";
  container.appendChild(table); 
}