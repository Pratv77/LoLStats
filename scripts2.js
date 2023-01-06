const apiKey = "RGAPI-c974402f-6b95-4071-90d1-d39cc22d9e2b";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");
let summonerId;

fetchLeague(username);

var Map = {};
Map["IRON"] = 1;
Map["BRONZE"] = 2;
Map["SILVER"] = 3;
Map["GOLD"] = 4;
Map["PLATINUM"] = 5;
Map["DIAMOND"] = 6;
Map["MASTERS"] = 7;
Map["GRANDMASTER"] = 8;
Map["CHALLENGER"] = 9;
Map["IV"] = 10;
Map["III"] = 11;
Map["II"] = 12;
Map["I"] = 13;

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

// Check if Ranked SoloDuo or Flex
function checkIfRanked(data) {
  checkHigherRank(data);

  // for (let i = 0; i < Object.keys(data).length; i++) {
  //   if (data[i].queueType === "RANKED_SOLO_5x5") {
  //     displayRankedSD(data);
  //   } else if (data[i].queueType === "RANKED_FLEX_SR") {
  //     displayRankedFl(data);
  //   }
  // }
}

function checkHigherRank(data) {
  let higherRank = "";

  if (Map[data[0].tier] > Map[data[1].tier]) {
    higherRank = data[0].queueType;
  } else if (Map[data[0].tier] < Map[data[1].tier]) {
    higherRank = data[1].queueType;
  } else if (Map[data[0].tier] == Map[data[1].tier]) {
    if (Map[data[0].rank] > Map[data[1].rank]) {
      higherRank = data[0].queueType;
    } else if (Map[data[0].rank] == Map[data[1].rank]) {
      if (data[0].leaguePoints > data[1].leaguePoints) {
        higherRank = data[0].queueType;
      } else {
        higherRank = data[1].queueType;
      }
    } else {
      higherRank = data[1].queueType;
    }
  }

  if (higherRank === "RANKED_FLEX_SR") {
    displayRankedFl(data);
  } else {
    displayRankedSD(data);
  }
}

function displayRankedSD(data) {
  console.log("solo duo");
}

function displayRankedFl(data) {
  console.log("flex");
}
