var szloch = document.querySelector(".szloch-foto");
var mind = document.querySelector(".mind");
let TalkingSzloch = 0;
const toggleTalkingButton = document.getElementById("toggleTalkingButton");
const toggleTalkingImg = document.getElementById("toggleTalkingImg");
let mindArr = [];
var currLang = "en";

window.addEventListener("load", function () {
  load_text();
  showLanguage("en");
});

function load_text(lang) {
  let fileName;
  switch (lang) {
    case "pl":
      fileName = "szlochlist.txt";
      break;
    case "en":
      fileName = "englist.txt";
      break;
    case "ru":
      fileName = "russian.txt";
      break;
    default:
      fileName = "szlochlist.txt";
  }
  fetch("quotes/" + fileName)
    .then((response) => response.text())
    .then((text) => {
      mindArr = text
        .split("\n")
        .map((line) =>
          line.trim().replace(/"/g, "").endsWith(",")
            ? line.trim().replace(/"/g, "").slice(0, -1)
            : line.trim().replace(/"/g, "")
        );
      mindArr = mindArr.filter((line) => line !== "");
    })
    .catch((error) => console.error(error));
}

const TalkingChance = 30;

const shakePhoto = () => {
  const randomNum = Math.floor(Math.random() * 30);
  if (randomNum === 0 && TalkingSzloch == 1 && currLang === "pl") {
    playRandomTrack();
  } else {
    szloch.classList.add("shake-animation");
    setTimeout(generate, 1000);
  }
};

const generate = () => {
  generateMind();
  szloch.classList.remove("shake-animation");
};

const usedQuotes = new Set();
var usedQuotesCount = 40;

const generateMind = () => {
  let randomMind;
  do {
    randomMind = mindArr[Math.floor(Math.random() * mindArr.length)];
  } while (usedQuotes.has(randomMind));
  usedQuotes.add(randomMind);
  if (usedQuotes.size > usedQuotesCount) {
    usedQuotes.delete([...usedQuotes][0]);
  }
  mind.innerHTML = `"${randomMind}"`;
};

szloch.addEventListener("click", shakePhoto);

var audio = document.getElementById("myAudio");
var button = document.getElementById("toggleButton");

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    button.innerHTML = '<img src="img/musicStart.png">';
  } else {
    audio.pause();
    button.innerHTML = '<img src="img/musicStop.png">';
  }
}

audio.addEventListener("play", function () {
  button.innerHTML = '<img src="img/musicStart.png" alt="Volume On">Music On';
});

audio.addEventListener("pause", function () {
  button.innerHTML = '<img src="img/musicStop.png" alt="Volume Off">Music Off';
});

function toggleTalking() {
  TalkingSzloch = TalkingSzloch === 0 ? 1 : 0;
  if (TalkingSzloch === 0) {
    toggleTalkingImg.src = "img/SzlochMuted.png";
    toggleTalkingButton.title =
      "(Only Polish Version for now!)Now the Szlachcielec will only communicate in writing, click again if you want to hear his beautiful voice";
  } else {
    toggleTalkingImg.src = "img/SzlochTalking.png";
    toggleTalkingButton.title =
      "(Only Polish Version for now!)Now the Szlachcielec will occasionally speak in words, interrupting the music, click again if you don t want to hear him";
  }
}

const playRandomTrack = () => {
  fetch("quotes/audioMap.txt")
    .then((response) => response.text())
    .then((text) => {
      const lines = text
        .trim()
        .split("\n")
        .map((line) => line.trim());
      const tracks = [];
      for (let i = 0; i < lines.length; i += 2) {
        tracks.push({ title: lines[i], url: lines[i + 1] });
      }
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      const audio = new Audio(randomTrack.url);
      audio.play();
      const szloch = document.querySelector(".szloch-foto");
      const mind = document.querySelector(".mind");
      szloch.classList.add("shake-animation");
      mind.innerHTML = `"${randomTrack.title}"`;
      setTimeout(() => {
        szloch.classList.remove("shake-animation");
      }, 1000);
    })
    .catch((error) => console.error(error));
};

function showLanguage(lang) {
  const versions = document.querySelectorAll(".hero-bg");
  currLang = lang;
  load_text(lang);
  versions.forEach((version) => {
    version.style.display = "none";
  });

  const selectedVersion = document.querySelector(`.hero-bg.${lang}-version`);
  selectedVersion.style.display = "block";

  szloch = selectedVersion.querySelector(".szloch-foto");
  szloch.addEventListener("click", shakePhoto);
  mind = selectedVersion.querySelector(".mind");
}
