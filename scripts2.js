const apiKey = "RGAPI-f83dd452-a74d-4320-aa71-501b288e90d7";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue);

const username = urlParams.get("username");
let summonerId;
let response;
let playerPuuid;
let arr = [];
let runesMap = {
  // Used mapping since I couldn't find a proper place to call each rune using the perk ID :(
  // secondary runes
  8100: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/7200_Domination.png?raw=true`,
  8000: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/7201_Precision.png?raw=true`,
  8200: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/7202_Sorcery.png?raw=true`,
  8300: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/7203_Whimsy.png?raw=true`,
  8400: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/7204_Resolve.png?raw=true`,
  // domination runes
  8112: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Domination/Electrocute/Electrocute.png?raw=true`,
  8124: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Domination/Predator/Predator.png?raw=true`,
  8128: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png?raw=true`,
  9923: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png?raw=true`,
  // inspiration runes
  8351: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png?raw=true`,
  8360: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png?raw=true`,
  8369: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png?raw=true`,
  // precision runes
  8005: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png?raw=true`,
  8008: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png?raw=true`,
  8021: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png?raw=true`,
  8010: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Precision/Conqueror/Conqueror.png?raw=true`,
  // resolve runes
  8437: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png?raw=true`,
  8439: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png?raw=true`,
  8465: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Resolve/Guardian/Guardian.png?raw=true`,
  // sorcery runes
  8214: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png?raw=true`,
  8229: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png?raw=true`,
  8230: `https://github.com/Pratv77/LoL_DDragon/blob/master/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png?raw=true`,
};

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

  let data2;

  for (i = 0; i < 5; i++) {
    let response2 = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${data[i]}?api_key=${apiKey}` // loops 4 times and appends to array for recent 4 matches
    );
    data2 = await response2.json();
    arr.push(data2);
  }
  setData(arr);
}

function setData(dataArray) {
  let playerId; //used to compare to match participants to find which participant is the user
  let playerNum; //used to get user's stats only from metadata

  for (i = 0; i < 5; i++) {
    let matchData = dataArray[i]; //put dataArray[i] in a var just for simplicity
    let arr = matchData.metadata.participants;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === playerPuuid) {
        playerId = arr[i];
        playerNum = i;
        break;
      }
    }
    // Recreate match history container here, gonna be lengthy

    var matchHistory = document.getElementById("match-history");
    let container_holder = document.createElement("div");
    container_holder.classList.add("container--holder");
    matchHistory.appendChild(container_holder);

    let container = document.createElement("div");
    container.classList.add("container");
    container_holder.appendChild(container);

    if (matchData.info.participants[playerNum].win) {
      container.classList.add("win");
    } else {
      container.classList.add("loss");
    }

    let column1column2wrapper = document.createElement("div");
    column1column2wrapper.classList.add("column1column2wrapper");
    container.appendChild(column1column2wrapper)

    let column1 = document.createElement("div");
    column1.classList.add("column1");
    column1column2wrapper.appendChild(column1);

    let champion__spells__wrapper = document.createElement("div");
    champion__spells__wrapper.classList.add("champion--spells-wrapper");
    column1.appendChild(champion__spells__wrapper);

    let champlogo = document.createElement("div");
    champlogo.classList.add("champ__logo");
    champion__spells__wrapper.appendChild(champlogo);

    let logo = document.createElement("img");
    logo.setAttribute("class", "logo img-curve");
    logo.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[playerNum].championName}_0.jpg`
    );
    champlogo.appendChild(logo);

    let summonerwrapper = document.createElement("div");
    summonerwrapper.classList.add("summoner--wrapper");
    champion__spells__wrapper.appendChild(summonerwrapper);

    let summonerspellwrapper = document.createElement("div");
    summonerspellwrapper.classList.add("summonerspell--wrapper");
    summonerwrapper.appendChild(summonerspellwrapper);

    let ss1 = document.createElement("div");
    ss1.classList.add("SS1");
    summonerspellwrapper.appendChild(ss1);

    let summonerspell1 = document.createElement("img");
    summonerspell1.setAttribute("class", "summoner_spell1");
    summonerspell1.setAttribute(
      "src",
      `https://raw.githubusercontent.com/Pratv77/LoL_DDragon/master/extras/summonerspells/${matchData.info.participants[playerNum].summoner1Id}.png`
    );
    ss1.appendChild(summonerspell1);

    let ss2 = document.createElement("div");
    ss2.classList.add("SS2");
    summonerspellwrapper.appendChild(ss2);

    let summonerspell2 = document.createElement("img");
    summonerspell2.setAttribute("class", "summoner_spell2");
    summonerspell2.setAttribute(
      "src",
      `https://raw.githubusercontent.com/Pratv77/LoL_DDragon/master/extras/summonerspells/${matchData.info.participants[playerNum].summoner2Id}.png`
    );
    ss2.appendChild(summonerspell2);

    let runeswrapper = document.createElement("div");
    runeswrapper.classList.add("runes--wrapper");
    summonerwrapper.appendChild(runeswrapper);

    let r1 = document.createElement("div");
    r1.classList.add("R1");
    runeswrapper.appendChild(r1);

    let rune1 = document.createElement("img");
    rune1.setAttribute("class", "rune1");
    rune1.setAttribute(
      "src",
      runesMap[
        matchData.info.participants[playerNum].perks.styles[0].selections[0]
          .perk
      ]
    );
    r1.appendChild(rune1);

    let r2 = document.createElement("div");
    r2.classList.add("R2");
    runeswrapper.appendChild(r2);

    let rune2 = document.createElement("img");
    rune2.setAttribute("class", "rune2");
    rune2.setAttribute(
      "src",
      runesMap[matchData.info.participants[playerNum].perks.styles[1].style]
    );
    r2.appendChild(rune2);

    let gamemode = document.createElement("div");
    gamemode.classList.add("gameMode");
    column1.appendChild(gamemode);

    let gamemode1 = document.createElement("p");
    gamemode1.classList.add("gamemode1");
    console.log(matchData.info);
    if (matchData.info.queueId == 420) {
      gamemode1.innerHTML = "Ranked Solo";
    } else if (matchData.info.queueId == 440) {
      gamemode1.innerHTML = "Ranked Flex";
    } else if (matchData.info.queueId == 450) {
      gamemode1.innerHTML = "ARAM";
    } else if (matchData.info.queueId == 900) {
      gamemode1.innerHTML = "URF";
    } else if (matchData.info.queueId == 650) {
      gamemode1.innerHTML = "ARAM";
    } else if (matchData.info.queueId == 400) {
      gamemode1.innerHTML = "Normal";
    } else if (matchData.info.queueId == 0) {
      gamemode1.innerHTML = "Custom";
    } else if (matchData.info.queueId == 0) {
      gamemode1.innerHTML = "Custom";
    } else if (matchData.info.queueId == 78) {
      gamemode1.innerHTML = "One for All";
    } else if (
      matchData.info.queueId == 830 ||
      matchData.info.queueId == 840 ||
      matchData.info.queueId == 850
    ) {
      gamemode1.innerHTML = "Co-op vs AI Bots";
    } else {
      gamemode1.innerHTML = "Special Event";
    }
    gamemode.appendChild(gamemode1);

    let column2 = document.createElement("div");
    column2.classList.add("column2");
    column1column2wrapper.appendChild(column2);

    let items = document.createElement("div");
    items.classList.add("items");
    column2.appendChild(items);

    let item1 = document.createElement("img");
    item1.setAttribute("class", "item1 img-curve-small");
    item1.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item0)
    );
    items.appendChild(item1);

    let item2 = document.createElement("img");
    item2.setAttribute("class", "item2 img-curve-small");
    item2.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item1)
    );
    items.appendChild(item2);

    let item3 = document.createElement("img");
    item3.setAttribute("class", "item3 img-curve-small");
    item3.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item2)
    );
    items.appendChild(item3);

    let item4 = document.createElement("img");
    item4.setAttribute("class", "item4 img-curve-small");
    item4.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item3)
    );
    items.appendChild(item4);

    let item5 = document.createElement("img");
    item5.setAttribute("class", "item5 img-curve-small");
    item5.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item4)
    );
    items.appendChild(item5);

    let item6 = document.createElement("img");
    item6.setAttribute("class", "item6 img-curve-small");
    item6.setAttribute(
      "src",
      checkItem(matchData.info.participants[playerNum].item5)
    );
    items.appendChild(item6);

    let kdatimeplayedwrapper = document.createElement("div");
    kdatimeplayedwrapper.classList.add("kda__time--played-wrapper");
    column2.appendChild(kdatimeplayedwrapper);

    let kda = document.createElement("div");
    kda.classList.add("kda");
    kda.innerHTML =
      matchData.info.participants[playerNum].kills +
      " / " +
      matchData.info.participants[playerNum].deaths +
      " / " +
      matchData.info.participants[playerNum].assists;
    kdatimeplayedwrapper.appendChild(kda);

    let timeplayed = document.createElement("div");
    timeplayed.classList.add("time-played");
    let timeInSeconds = matchData.info.participants[playerNum].timePlayed;
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    timeplayed.innerHTML = `${minutes}m ${seconds}s`;
    kdatimeplayedwrapper.appendChild(timeplayed);

    let column3 = document.createElement("div");
    column3.classList.add("column3");
    container.appendChild(column3);

    let team1wrapper = document.createElement("div");
    team1wrapper.classList.add("team1--wrapper");
    column3.appendChild(team1wrapper);

    let teamnamewrapper1 = document.createElement("div");
    teamnamewrapper1.classList.add("teamname--wrapper1");
    team1wrapper.appendChild(teamnamewrapper1);

    let team1p1 = document.createElement("img");
    team1p1.setAttribute("class", "team1p1 img-curve-small");
    team1p1.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[0].championName}_0.jpg`
    );
    teamnamewrapper1.appendChild(team1p1);

    let team1name1 = document.createElement("h5");
    team1name1.classList.add("team1name1", "name");
    team1name1.innerHTML = matchData.info.participants[0].summonerName;
    teamnamewrapper1.appendChild(team1name1);

    let teamnamewrapper2 = document.createElement("div");
    teamnamewrapper2.classList.add("teamname--wrapper2");
    team1wrapper.appendChild(teamnamewrapper2);

    let team1p2 = document.createElement("img");
    team1p2.setAttribute("class", "team1p2 img-curve-small");
    team1p2.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[1].championName}_0.jpg`
    );
    teamnamewrapper2.appendChild(team1p2);

    let team1name2 = document.createElement("h5");
    team1name2.classList.add("team1name2", "name");
    team1name2.innerHTML = matchData.info.participants[1].summonerName;
    teamnamewrapper2.appendChild(team1name2);

    let teamnamewrapper3 = document.createElement("div");
    teamnamewrapper3.classList.add("teamname--wrapper3");
    team1wrapper.appendChild(teamnamewrapper3);

    let team1p3 = document.createElement("img");
    team1p3.setAttribute("class", "team1p3 img-curve-small");
    team1p3.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[2].championName}_0.jpg`
    );
    teamnamewrapper3.appendChild(team1p3);

    let team1name3 = document.createElement("h5");
    team1name3.classList.add("team1name3", "name");
    team1name3.innerHTML = matchData.info.participants[2].summonerName;
    teamnamewrapper3.appendChild(team1name3);

    let teamnamewrapper4 = document.createElement("div");
    teamnamewrapper4.classList.add("teamname--wrapper4");
    team1wrapper.appendChild(teamnamewrapper4);

    let team1p4 = document.createElement("img");
    team1p4.setAttribute("class", "team1p4 img-curve-small");
    team1p4.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[3].championName}_0.jpg`
    );
    teamnamewrapper4.appendChild(team1p4);

    let team1name4 = document.createElement("h5");
    team1name4.classList.add("team1name4", "name");
    team1name4.innerHTML = matchData.info.participants[3].summonerName;
    teamnamewrapper4.appendChild(team1name4);

    let teamnamewrapper5 = document.createElement("div");
    teamnamewrapper5.classList.add("teamname--wrapper5");
    team1wrapper.appendChild(teamnamewrapper5);

    let team1p5 = document.createElement("img");
    team1p5.setAttribute("class", "team1p5 img-curve-small");
    team1p5.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[4].championName}_0.jpg`
    );
    teamnamewrapper5.appendChild(team1p5);

    let team1name5 = document.createElement("h5");
    team1name5.classList.add("team1name5", "name");
    team1name5.innerHTML = matchData.info.participants[4].summonerName;
    teamnamewrapper5.appendChild(team1name5);

    let team2wrapper = document.createElement("div");
    team2wrapper.classList.add("team2--wrapper");
    column3.appendChild(team2wrapper);

    let teamnamewrapper6 = document.createElement("div");
    teamnamewrapper6.classList.add("teamname--wrapper6");
    team2wrapper.appendChild(teamnamewrapper6);

    let team2p1 = document.createElement("img");
    team2p1.setAttribute("class", "team2p1 img-curve-small");
    team2p1.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[5].championName}_0.jpg`
    );
    teamnamewrapper6.appendChild(team2p1);

    let team2name1 = document.createElement("h5");
    team2name1.classList.add("team2name1", "name");
    team2name1.innerHTML = matchData.info.participants[5].summonerName;
    teamnamewrapper6.appendChild(team2name1);

    let teamnamewrapper7 = document.createElement("div");
    teamnamewrapper7.classList.add("teamname--wrapper7");
    team2wrapper.appendChild(teamnamewrapper7);

    let team2p2 = document.createElement("img");
    team2p2.setAttribute("class", "team2p2 img-curve-small");
    team2p2.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[6].championName}_0.jpg`
    );
    teamnamewrapper7.appendChild(team2p2);

    let team2name2 = document.createElement("h5");
    team2name2.classList.add("team2name2", "name");
    team2name2.innerHTML = matchData.info.participants[6].summonerName;
    teamnamewrapper7.appendChild(team2name2);

    let teamnamewrapper8 = document.createElement("div");
    teamnamewrapper8.classList.add("teamname--wrapper8");
    team2wrapper.appendChild(teamnamewrapper8);

    let team2p3 = document.createElement("img");
    team2p3.setAttribute("class", "team2p3 img-curve-small");
    team2p3.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[7].championName}_0.jpg`
    );
    teamnamewrapper8.appendChild(team2p3);

    let team2name3 = document.createElement("h5");
    team2name3.classList.add("team2name3", "name");
    team2name3.innerHTML = matchData.info.participants[7].summonerName;
    teamnamewrapper8.appendChild(team2name3);

    let teamnamewrapper9 = document.createElement("div");
    teamnamewrapper9.classList.add("teamname--wrapper9");
    team2wrapper.appendChild(teamnamewrapper9);

    let team2p4 = document.createElement("img");
    team2p4.setAttribute("class", "team2p4 img-curve-small");
    team2p4.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[8].championName}_0.jpg`
    );
    teamnamewrapper9.appendChild(team2p4);

    let team2name4 = document.createElement("h5");
    team2name4.classList.add("team2name4", "name");
    team2name4.innerHTML = matchData.info.participants[8].summonerName;
    teamnamewrapper9.appendChild(team2name4);

    let teamnamewrapper10 = document.createElement("div");
    teamnamewrapper10.classList.add("teamname--wrapper10");
    team2wrapper.appendChild(teamnamewrapper10);

    let team2p5 = document.createElement("img");
    team2p5.setAttribute("class", "team2p5 img-curve-small");
    team2p5.setAttribute(
      "src",
      `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${matchData.info.participants[9].championName}_0.jpg`
    );
    teamnamewrapper10.appendChild(team2p5);

    let team2name5 = document.createElement("h5");
    team2name5.classList.add("team2name5", "name");
    team2name5.innerHTML = matchData.info.participants[9].summonerName;
    teamnamewrapper10.appendChild(team2name5);
  }
}

function checkItem(itemID) {
  //just to check if an item slot is empty
  if (itemID == 0) {
    return "./assets/empty-img.png";
  } else {
    return `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${itemID}.png`;
  }
}
