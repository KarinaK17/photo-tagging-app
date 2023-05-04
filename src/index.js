import "./style.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

let xCoor;
let yCoor;
let startTime;
let hits = [];
let images = ["squirrel", "snake", "cinnamon", "statue", "laptop"];

const secondsInfo = document.querySelector(".seconds");
const popUpWindow = document.querySelector(".win-pop-up-window");
const StartPopUpWindow = document.querySelector(".start-pop-up-window");
const form = document.querySelector("form");
const cancelBtn = document.querySelector(".cancel-btn");
const startBtn = document.querySelector(".start-btn");
const scoreList = document.querySelector(".score-list");

const picture = document.querySelector(".collage");
const collageContainer = document.querySelector(".collage-container");
const box = document.querySelector(".box");

const squirrelBtn = document.querySelector(".squirrel-btn");
const statueBtn = document.querySelector(".statue-btn");
const snakeBtn = document.querySelector(".snake-btn");
const laptopBtn = document.querySelector(".laptop-btn");
const cinnamonBtn = document.querySelector(".cinnamon-btn");

const firebaseConfig = {
  apiKey: "AIzaSyCW44cJlHGD83d5Qu-VcpZoi3wNONgXSD0",
  authDomain: "photo-tagging-app-203ef.firebaseapp.com",
  projectId: "photo-tagging-app-203ef",
  storageBucket: "photo-tagging-app-203ef.appspot.com",
  messagingSenderId: "912055528916",
  appId: "1:912055528916:web:b0a129809631fbdd9bba41",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const playersRef = collection(db, "players");

function startGame() {
  startTime = new Date().getTime();
  StartPopUpWindow.style.display = "none";
}

startBtn.addEventListener("click", startGame);

async function getThings(db) {
  try {
    const thingsCol = collection(db, "things");
    const thingsSnapshot = await getDocs(thingsCol);
    const thingsList = thingsSnapshot.docs.map((doc) => doc.data());
    return thingsList;
  } catch (error) {
    console.error(error.message);
  }
}

async function getPlayers(db) {
  try {
    const q0 = query(playersRef, orderBy("time"), limit(20));
    const q = query(q0, orderBy("name"));
    const playersSnapshot = await getDocs(q);
    const playersList = playersSnapshot.docs.map((doc) => doc.data());
    return playersList;
  } catch (error) {
    console.error(error.message);
  }
}

function recordCorrectClick(buttonName) {
  let alreadyHit = hits.includes(buttonName);
  if (!alreadyHit) {
    hits.push(buttonName);
  }
}

async function putMarkers(hits) {
  const things = await getThings(db);
  things.forEach((thing) => {
    if (hits.includes(thing.name)) {
      const marker = document.createElement("img");
      marker.classList.add("marker");
      marker.src = "marker3.svg";
      marker.style.top = `${thing.yMarker - 50}px`;
      marker.style.left = `${thing.xMarker - 20}px`;
      collageContainer.appendChild(marker);
    }
  });
}

function removeMarkers() {
  const markers = document.querySelectorAll(".marker");
  markers.forEach((marker) => marker.remove());
}

async function checkClick(buttonName) {
  const things = await getThings(db);
  const thing = things.filter((thing) => {
    return thing.name == buttonName;
  })[0];
  if (
    xCoor >= thing.xStart &&
    xCoor <= thing.xEnd &&
    yCoor >= thing.yStart &&
    yCoor <= thing.yEnd &&
    thing.found != true
  ) {
    recordCorrectClick(buttonName);
    putMarkers(hits);
  }

  const everythingIsFound = images.every((image) => {
    return hits.includes(image);
  });

  if (everythingIsFound) {
    let finishTime = new Date().getTime();
    let seconds = Math.round((finishTime - startTime) / 1000);
    popUpWindow.style.display = "flex";
    secondsInfo.textContent = `${seconds}`;
  }
}

squirrelBtn.addEventListener("click", () => checkClick("squirrel"));
statueBtn.addEventListener("click", () => checkClick("statue"));
snakeBtn.addEventListener("click", () => checkClick("snake"));
laptopBtn.addEventListener("click", () => checkClick("laptop"));
cinnamonBtn.addEventListener("click", () => checkClick("cinnamon"));

async function showBestScores() {
  const players = await getPlayers(db);
  scoreList.innerHTML = "";
  players.forEach((player) => {
    const playerListItem = document.createElement("li");
    playerListItem.textContent = `${player.name}: ${player.time} seconds`;
    scoreList.appendChild(playerListItem);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(playersRef, {
    name: form.name.value,
    time: Number(secondsInfo.textContent),
  }).then(() => {
    form.reset();

    hits = [];
    removeMarkers();
    showBestScores();
    popUpWindow.style.display = "none";
    StartPopUpWindow.style.display = "flex";
  });
});

cancelBtn.addEventListener("click", () => {
  popUpWindow.style.display = "none";
  hits = [];
  removeMarkers();
  showBestScores();
  StartPopUpWindow.style.display = "flex";
});

picture.addEventListener("click", (e) => {
  box.style.top = `${e.offsetY}px`;
  box.style.left = `${e.offsetX}px`;
  box.style.display = "flex";
  xCoor = e.offsetX;
  yCoor = e.offsetY;
});

window.addEventListener("mouseup", (e) => {
  if (e.target != picture) {
    box.style.display = "none";
  }
});

showBestScores();
