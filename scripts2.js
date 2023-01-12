const apiKey = "RGAPI-6b5811ad-95cd-4022-b717-36cb3d0e3f56";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");
let summonerId;
let response;
let playerPuuid;
const user = 13;

fetchLeague(username);

// 1st API call
async function fetchLeague(username) {
  try {
    response = await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
    );
  } catch {
    noData();
  }
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  const { name, profileIconId, summonerLevel, id, puuid } = data;
  summonerId = id;
  playerPuuid = puuid;
  rankedStats(summonerId);
  matchHistory(puuid);

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
  const { tier, rank, leaguePoints, wins, losses } = data;
  document.querySelector(
    ".ranked-img"
  ).src = `./assets/ranked-emblems/${tier}.png`;
  document.querySelector(".SD").innerHTML = "Solo Duo";
  document.querySelector(".rankSD").innerHTML =
    "Rank: " + tier + " " + rank + " " + leaguePoints + " LP";
  document.querySelector(".winrateSD").innerHTML =
    "WR: " + ((wins / (wins + losses)) * 100).toFixed(2) + "%";
  document.querySelector(".win__lossSD").innerHTML =
    wins + " W " + losses + " L ";
}

function displayRankedF(data) {
  const { tier, rank, leaguePoints, wins, losses } = data;
  document.querySelector(
    ".ranked-img2"
  ).src = `./assets/ranked-emblems/${tier}.png`;
  document.querySelector(".F").innerHTML = "Flex";
  document.querySelector(".rankF").innerHTML =
    "Rank: " + tier + " " + rank + " " + leaguePoints + " LP";
  document.querySelector(".winrateF").innerHTML =
    "WR: " + ((wins / (wins + losses)) * 100).toFixed(2) + "%";
  document.querySelector(".win__lossF").innerHTML =
    wins + " W " + losses + " L ";
}

function unranked() {
  document.querySelector(".SD").innerHTML = "Unranked";
}

function noData() {
  document.querySelector(".temp").innerHTML =
    "API Key needs to be regenerated :(";
}

// Get match history

async function matchHistory(puuid) {
  const response = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`
  );
  const data = await response.json();

  const response2 = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${data[0]}?api_key=${apiKey}` // can loop this
  );
  const data2 = await response2.json();
  console.log(data2)
  getPlayerPuuid(data2);
}

function getPlayerPuuid(data) {
  let playerId;
  let arr = data.metadata.participants;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === playerPuuid) {
      playerId = arr[i];
      break;
    }
  }


}


// gameMode = data2.info.gameMode
// champion name = data2.info.participants[7].championName
// assists = data2.info.participants[7].assists
// kills = data2.info.participants[7].kills
// deaths = data2.info.participants[7].deaths
// items = data2.info.participants[7].item0
// summoner1 id = data2.info.participants[7].summoner1Id
// summoner1 id = data2.info.participants[7].summoner2Id
// win/loss = data2.info.participants[7].win
// time played in seconds = data2.info.participants[7].timePlayed


// get all stats based off previous search
// display stats

// champ profile pic = http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${Zed}_0.jpg
// summoner spell = https://raw.githubusercontent.com/InFinity54/LoL_DDragon/master/extras/summonerspells/${summoner_spell_id}.png