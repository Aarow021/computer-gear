
let gear;
let gearWrapper;
let textWrapper;
let isGearHeld = false;
let progress = 0;
let lastAngle = 0;
let textPointer;
let wordPool = ['Fun', 'Optimistic', 'Persistant', '😄', 'Curious', 'Dedicated', 'Happy', 'thinking', '( ˶ˆᗜˆ˵ )']
let wordCount = 0;
let mouseX = 0;
let mouseY = 0;


// limits a number to be between a min and a max
function clamp(num, min, max) {
    return Math.max(Math.min(num, max), min)
}

// returns count vw
function vw(count=1) {
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  return (viewportWidth / 100) * count;
}

// returns count vh
function vh(count=1) {
  const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  return (viewportHeight / 100) * count;
}

// returns count vmin
function vmin(count=1) {
  return Math.min(vw(count), vh(count));
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

// generates the next word
function generateWord() {
    let text = wordPool[wordCount % wordPool.length];
    const wordElement = document.createElement('span');
    wordElement.textContent = text;
    textWrapper.prepend(wordElement);
    wordCount++;
    return wordElement;
}

// checks if the text pointer has passed the boundry;
function checkPointer() {
    let pointerLeft = textPointer.offsetLeft;
    if (pointerLeft >= vmin(10)) {
        generateWord();
        let words = textWrapper.children;
        textPointer = words[0];
    }
}

// updates the text when the gear moves
function updateText() {
    let scale = parseFloat(getComputedStyle(textWrapper).fontSize) / 20;
    textWrapper.style.maxWidth = progress * scale;
    textWrapper.style.width = progress * scale;
    checkPointer();
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
    progress = clamp(progress, 0, Infinity);
    document.getElementById('progress').innerText = `${Math.round(progress)}`;
    lastAngle = angle;
    gear.style.transform = `rotate(${progress % 360 - 180}deg)`;
    updateText();
}

function init() {
    gear = document.querySelector('.gear');
    gearWrapper = document.querySelector('.gear-wrapper');
    textWrapper = document.querySelector('.text-wrapper');
    generateWord();
    generateWord();
    textPointer = generateWord();

    // handles touch/clicks
    let pointerTypes = {
        mouse: {move: 'mousemove', down: 'mousedown', up: 'mouseup'}, 
        touch: {move: 'touchmove', down: 'touchstart', up: 'touchend'}
    };
    
    for (const pointer of Object.values(pointerTypes)) {
        window.addEventListener(pointer.move, (e) => {
            if (e.type === 'mousemove') {
                mouseX = e.clientX;
                mouseY = e.clientY;
            } else if (e.type === 'touchmove' && e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
            gearHandler();
        });

        gearWrapper.addEventListener(pointer.down, (e) => {
            if (e.type === 'mousedown') {
                mouseX = e.clientX;
                mouseY = e.clientY;
            } else if (e.type === 'touchstart' && e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
            lastAngle = calculateAngle();
            isGearHeld = true;
        });
    
        window.addEventListener(pointer.up, () => {
            isGearHeld = false;
        });
    }

    window.addEventListener('resize', updateText)
}

window.addEventListener('DOMContentLoaded', init);