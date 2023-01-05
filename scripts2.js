const apiKey = "RGAPI-be52d723-24ba-40c4-85f6-6226df3e3b10";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");

fetchLeague(username);

async function fetchLeague(username) {
  const response = await fetch(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
  );
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  const { name, profileIconId, summonerLevel } = data;

  document.querySelector(".name").innerHTML = name;
  document.querySelector('.profile__img').src = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${profileIconId}.png`;
  document.querySelector(".level").innerHTML = "Level: " + summonerLevel;
}


