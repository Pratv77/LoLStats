const apiKey = "RGAPI-6e9d7c84-4dd4-4b4a-b2fb-a2b6a3e153d7";

// Get player's username from search
const urlValue = window.location.search;
const urlParams = new URLSearchParams(urlValue)

const username = urlParams.get('username')

