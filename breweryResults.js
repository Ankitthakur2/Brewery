document.addEventListener('DOMContentLoaded', () => {
  const queryParams = new URLSearchParams(window.location.search);
  const city = queryParams.get('city');
  const name = queryParams.get('name');
  const type = queryParams.get('type');

  
  var apiUrl = '';
  if (city) apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=3`;

  if (name) apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_name=${name}&per_page=3`;

  if (type) {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_type=${type}&per_page=3`;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(breweries => displayBreweries(breweries))
    .catch(error => console.error('Error fetching breweries:', error));

  function displayBreweries(breweries) {
    const breweryList = document.getElementById('breweryList');

    breweryList.innerHTML = '';

    if (breweries.length === 0) {
      breweryList.innerHTML = '<p>No breweries found.</p>';
      return;
    }

    breweries.forEach(brewery => {
      const listItem = document.createElement('div');

      listItem.innerHTML = `
        <h3>${brewery.name}</h3>
        <p>Address: ${brewery.address}</p>
        <p>Phone: ${brewery.phone}</p>
        <p><a href="${brewery.website_url}" target="_blank">Website: ${brewery.website_url}</a></p>
        <p>City: ${brewery.city}, State: ${brewery.state}</p>

        <h3>Provide Feedback</h3>

        <form action="/submit-feedback" method="post">
          <label for="userid">UserId:</label>
          <input type="text" id="email" name="email" required>
          <label for="feedback">Your Feedback:</label>
          <textarea id="feedback" name="feedback" required></textarea>
          <label for="rating">Rate out of 5:</label>
          <input type="number" id="rating" name="rating" required>
          <input type="hidden" id="hiddenInput" name="hiddenInput" value="${brewery.name}">
          <button type="submit">Submit Feedback</button>
        </form>

        <h2>Reviews</h2>
        <ul id="feedbackList"></ul>
      `;
      breweryList.appendChild(listItem);

      const breweryName = brewery.name;

      fetch(`/getFeedback?breweryName=${breweryName}`)
        .then(response => response.json())
        .then(feedbackList => displayFeedback(feedbackList))
        .catch(error => console.error('Error fetching data:', error));
    });
  }

  function displayFeedback(feedbackList) {
    const feedbackUl = document.getElementById('feedbackList');
  
    feedbackList.forEach(feedback => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="feedback-item">
          <h3 class="feedback-email">User: ${feedback.email}</h3>
          <p class="feedback-rating">Rating: ${feedback.rating}/5</p>
          <div class="feedback-text">Feedback: ${feedback.feedback}</div>
          <p class="feedback-date">${new Date(feedback.createdAt).toLocaleString()}</p>
        </div>
      `;
      li.classList.add('feedback-list-item');
      feedbackUl.appendChild(li);
    });
  }
  
  
  
});
