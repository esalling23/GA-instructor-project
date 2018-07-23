console.log('loaded');
const submitSearchBtn = document.getElementById('submit-search');
const textSearchInput = document.getElementById('text-search');
const movieItem = document.getElementsByClassName('movie-item');
const searchResults = document.getElementById('movie-results');
const myFavoritesBtn = document.getElementById('my-favorites');

function displaySearchResults(results) {
  // Clear results list
  searchResults.innerHTML = '';

  // Create the list for the movie results
  let movieList = document.createElement('ul');
  // The actual movies are in an array called "search"
  // Itterate through this array to get movie information
  for (let movie in results) {
    let newMovie = document.createElement('li');
    newMovie.className = 'movie-item';
    newMovie.innerHTML = results[movie].Title;
    movieList.appendChild(newMovie);
    newMovie.addEventListener('click', function(event) {
      movieSearch(false, results[movie].Title);
    }, false);
  }
  // Append the list of movies to our search results div
  searchResults.appendChild(movieList);
}

function expandMovie(movie) {
  // Clear results list
  searchResults.innerHTML = '';

  let expandedMovie = document.createElement('div');
  // First let's show the poster
  let poster = document.createElement('img');
  poster.src = movie.Poster;
  expandedMovie.appendChild(poster);
  // Then show the title
  expandedMovie.innerHTML += '<h3>' + movie.Title + '</h3>';
  // Show the year and rating
  expandedMovie.innerHTML += '<h4>' + movie.Year + ", " + movie.Rated + '</h4>';
  // Show the plot
  expandedMovie.innerHTML += '<p>' + movie.Plot + '</p>';

  // Add any other additional information below
  // expandedMovie.appendChild(...)

  // Finally we will add a favorite button
  let favoriteBtn = document.createElement('a');
  favoriteBtn.innerHTML = 'Add to my favorites';
  favoriteBtn.className = 'favorites';
  favoriteBtn.addEventListener('click', function(event) {
    addFavorite(movie);
  }, false);
  expandedMovie.appendChild(favoriteBtn);

  searchResults.appendChild(expandedMovie);
}

function movieSearch(search, input) {
  let url = 'http://www.omdbapi.com/?apikey=8d76db95&';
  // If 'search' is true, do an open search
  // otherwise search by title to get more info about this movie
  url += search ? 's=' : 't=';
  url += input.replace(/ /g, '+');

  request('GET', url, null, function(response) {
    searchResults.innerHTML = '';
    search ? displaySearchResults(response.Search) : expandMovie(response);
  });
}

// Movie search form handlers
// Submit button click
submitSearchBtn.addEventListener('click', function(event) {
  console.log(event);
  movieSearch(true, textSearchInput.value);
}, false);

// Text field "enter" press
textSearchInput.addEventListener('keypress', function(event) {
  let key = event.which || event.keyCode;
  if (key === 13) // If user presses enter
    movieSearch(true, textSearchInput.value);
}, false);

// My favorites link
myFavoritesBtn.addEventListener('click', function(event) {
  showFavorites();
}, false);

// Add favorite
function addFavorite(movie) {
  request('POST', 'favorite', JSON.stringify(movie), function(response) {
    searchResults.innerHTML += '<p>This movie is a favorite</p>';
    console.log(response);
  });
}

// Show favorites
function showFavorites() {
  request('GET', '/favorite', null, function(response) {
    displaySearchResults(response);
    console.log(response);
  });
}

// general request function
function request(type, url, data, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(this.responseText);
      callback(response);
    }
  }
  request.open(type, url, true);
  if (data)
    request.setRequestHeader("Content-type","application/json;charset=UTF-8");
  request.send(data);
}
