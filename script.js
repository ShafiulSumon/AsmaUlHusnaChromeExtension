const language = "bn";
const url = `https://islamicapi.com/api/v1/asma-ul-husna/?language=${language}&api_key=${apiKey}`;

function FetchFromAPI() {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      const names = data?.data?.names;

      if (!Array.isArray(names) || names.length === 0) {
        throw new Error("No names found in API response");
      }

      const name = names[Math.floor(Math.random() * names.length)];
      console.log("Fetched data:", data);
      document.getElementById("nameField").textContent = name.transliteration;
      document.getElementById("meaningField").textContent = name.translation;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("nameField").textContent = "Could not load name";
      document.getElementById("meaningField").textContent =
        "Could not load meaning";
    });
}

function GetNewName() {
  FetchFromAPI();
}

const loadLocalData = async () => {
  try {
    const response = await fetch(chrome.runtime.getURL("data.json"));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading local data:", error);
    throw error;
  }
};

document.getElementById("getNameButton").addEventListener("click", GetNewName);
