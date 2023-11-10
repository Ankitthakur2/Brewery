
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
  
    searchBtn.addEventListener('click', searchBreweries);
  
    function searchBreweries() {
      const city = document.getElementById('city').value;
      const name = document.getElementById('name').value;
      const type = document.getElementById('type').value;
  
      
      var apiUrl= "";
      if(city)
      apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=3`;
      
      if(name)
      apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_name=${name}&per_page=3`;
  
      if(type)
      {
       apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_type=${type}&per_page=3`;
      }
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(breweries => displayBreweries(breweries))
        .catch(error => console.error('Error fetching breweries:', error));
    }
  
    function displayBreweries(breweries) {
      const searchParams = new URLSearchParams({
        city: document.getElementById('city').value,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
      });
  
      const newPageUrl = `breweryResults.html?${searchParams.toString()}`;
      window.location.href = newPageUrl;
    }
  });
  