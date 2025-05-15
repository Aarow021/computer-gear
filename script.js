
let gear;
let gearWrapper;
let textWrapper;
let isGearHeld = false;
let progress = 0;
let lastAngle = 0;
let textHistory = [];
let mouseX = 0;
let mouseY = 0;


// limits a number to be between a min and a max
function clamp(num, min, max) {
    return Math.max(Math.min(num, max), min)
}

// gets offset relative to the page, not the parent
function getAbsoluteOffset(element) {
  let top = 0;
  let left = 0;
  while (element) {
    top += element.offsetTop;
    left += element.offsetLeft;
    element = element.offsetParent;
  }
  return { top, left };
}

function calculateAngle() {
    const rect = gearWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2; // Center X relative to the page
    const centerY = rect.top + rect.height / 2; // Center Y relative to the page
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    if (angle < 0) {
        angle += 360; // Convert negative angles to positive (0-360)
    }
    return angle;
}

function updateText() {
    let scale = parseFloat(getComputedStyle(textWrapper).fontSize) / 20;
    textWrapper.style.maxWidth = progress * scale;
    textWrapper.style.width = progress * scale;
}

// handles gear rotation
function gearHandler() {
    if (!isGearHeld) return;
        
    let angle = calculateAngle();
    let angleDiff = angle - lastAngle;
    if (angleDiff >= 180) {
        angleDiff -= 360;
    } else if (angleDiff <= -180) {
        angleDiff += 360;
    }
    progress += angleDiff;
    progress = clamp(progress, 0, 520);
    document.getElementById('progress').innerText = `${Math.round(progress)}`;
    lastAngle = angle;
    gear.style.transform = `rotate(${progress % 360 - 180}deg)`;
    updateText();
}

function init() {
    gear = document.querySelector('.gear');
    gearWrapper = document.querySelector('.gear-wrapper');
    textWrapper = document.querySelector('.text-wrapper');
    window.addEventListener('mousemove', (e)=> {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gearHandler();
    });
    gearWrapper.addEventListener('mousedown', (e) => {
        lastAngle = calculateAngle(e);
        isGearHeld = true;
    });

    window.addEventListener('mouseup', () => {
        isGearHeld = false;
    });

    window.addEventListener('resize', updateText)
}

window.addEventListener('DOMContentLoaded', init);