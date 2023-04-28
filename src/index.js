import "./style.css";

const picture = document.querySelector("img");
const box = document.querySelector(".box");

picture.addEventListener("click", (e) => {
  console.log("x", e.offsetX, "y", e.offsetY);
  box.style.top = `${e.offsetY}px`;
  box.style.left = `${e.offsetX}px`;
  box.style.display = "flex";
});

window.addEventListener("mouseup", (e) => {
  console.log(e.target);
  if (e.target != picture) {
    console.log(e.target, "inside if");
    box.style.display = "none";
  }
});

const squirrelBtn = document.querySelector(".squirrel-btn");
const statueBtn = document.querySelector(".statue-btn");
const snakeBtn = document.querySelector(".snake-btn");
const laptopBtn = document.querySelector(".laptop-btn");
const cinnamonBtn = document.querySelector(".cinnamon-btn");
