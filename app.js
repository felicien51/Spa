// Store saved words
var savedWords = [];

// This runs when the user clicks Search
function searchWord() {
  var word = document.getElementById("wordInput").value;

  // Check if input is empty
  if (word === "") {
    document.getElementById("errorMsg").textContent = "Please type a word first!";
    return;
  }

  // Clear old content
  document.getElementById("errorMsg").textContent = "";
  document.getElementById("result").style.display = "none";

  // Fetch from the dictionary API
  fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Word not found!");
      }
      return response.json();
    })
    .then(function(data) {
      showResult(data);
    })
    .catch(function(error) {
      document.getElementById("errorMsg").textContent = error.message;
    });
}

// Display the word result on the page
function showResult(data) {
  var entry = data[0];
  var word = entry.word;
  var phonetic = entry.phonetic || "";
  var meaning = entry.meanings[0];
  var partOfSpeech = meaning.partOfSpeech;
  var definition = meaning.definitions[0].definition;
  var example = meaning.definitions[0].example || "";

  var html = "";
  html += "<p class='word-title'>" + word + "</p>";
  html += "<p class='phonetic'>" + phonetic + "</p>";
  html += "<p class='part-of-speech'>" + partOfSpeech + "</p>";
  html += "<p class='definition'>• " + definition + "</p>";

  if (example !== "") {
    html += "<p class='example'>\"" + example + "\"</p>";
  }

  html += "<button class='save-btn' onclick='saveWord(\"" + word + "\")'>⭐ Save Word</button>";

  document.getElementById("result").innerHTML = html;
  document.getElementById("result").style.display = "block";
}

// Save a word to the saved list
function saveWord(word) {
  if (savedWords.includes(word)) {
    alert(word + " is already saved!");
    return;
  }

  savedWords.push(word);
  updateSavedList();
}

// Update the saved words section
function updateSavedList() {
  var container = document.getElementById("savedWords");
  container.innerHTML = "";

  if (savedWords.length === 0) {
    container.innerHTML = "<p id='emptyMsg'>No saved words yet.</p>";
    return;
  }

  for (var i = 0; i < savedWords.length; i++) {
    var chip = document.createElement("span");
    chip.className = "saved-chip";
    chip.textContent = savedWords[i];
    chip.onclick = function() {
      document.getElementById("wordInput").value = this.textContent;
      searchWord();
    };
    container.appendChild(chip);
  }
}

// Allow pressing Enter to search
document.getElementById("wordInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchWord();
  }
});
