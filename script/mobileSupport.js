// Activating mobile mode

export function activeMobileMode() {
  let touchstartX = 0;
  let touchendX = 0;

  let touchstartY = 0;
  let touchendY = 0;

  function checkDirectionLeftRight() {
    if (touchendX < touchstartX - 10) move("left");
    if (touchendX > touchstartX + 10) move("right");
  }

  document.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    checkDirectionLeftRight();
  });

  function checkDirectionUpDown() {
    if (touchendY < touchstartY - 10) move("up");
    if (touchendY > touchstartY + 10) move("down");
  }

  document.addEventListener("touchstart", (e) => {
    touchstartY = e.changedTouches[0].screenY;
  });

  document.addEventListener("touchend", (e) => {
    touchendY = e.changedTouches[0].screenY;
    checkDirectionUpDown();
  });
}

//export function activeMobileMode()
