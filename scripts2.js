const apiKey = "RGAPI-c974402f-6b95-4071-90d1-d39cc22d9e2b";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");
let summonerId;

fetchLeague(username);

// 1st API call
async function fetchLeague(username) {
  const response = await fetch(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
  );
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  const { name, profileIconId, summonerLevel, id } = data;
  summonerId = id;
  rankedStats(summonerId);

  document.querySelector(".name").innerHTML = name;
  document.querySelector(
    ".profile__img"
  ).src = `http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${profileIconId}.png`;
  document.querySelector(".level").innerHTML = "Level: " + summonerLevel;
}

// 2nd API call
async function rankedStats(accountId) {
  const response = await fetch(
    `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${accountId}?api_key=${apiKey}`
  );
  const data = await response.json();
  checkIfRanked(data);
}

// Check if player is ranked
function checkIfRanked(data) {
  console.log(data);
  if (Object.keys(data).length == 0) {
    unranked();
  } else if (Object.keys(data).length == 1) {
    if (data[0].queueType === "RANKED_FLEX_SR") {
      displayRankedF(data[0]);
    } else {
      displayRankedSD(data[0]);
    }
  } else {
    if (data[0].queueType === "RANKED_FLEX_SR") {
      displayRankedF(data[0]);
      displayRankedSD(data[1]);
    } else {
      displayRankedF(data[1]);
      displayRankedSD(data[0]);
    }
  }
}

function displayRankedSD(data) {
  
}

function displayRankedF(data) {

}

function unranked() {

}
