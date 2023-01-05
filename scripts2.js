const apiKey = "RGAPI-5f02c47f-6b48-4377-b82d-008e2bd92af1";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");

function fetchLeague(username) {
  fetch(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}` // NA region only right now
  )
    .then((response) => response.json())
    .then((data) => this.displayData(data));
}

function displayData(data) {
  const { name, profileIconId, summonerLevel } = data;

  document.querySelector(".name").innerHTML = name;
  // document.querySelector('.profile__img').src = ;   add profile icon id to get profileicon
  document.querySelector(".level").innerHTML = "Level: " + summonerLevel;
}

fetchLeague(username);
