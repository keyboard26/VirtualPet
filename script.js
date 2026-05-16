
const statEls = {
    hunger: document.getElementById('hunger'),
    energy: document.getElementById('energy'),
    happiness: document.getElementById('happiness')
}
const petImage = document.getElementById('petImage');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const restBtn = document.getElementById('restBtn');
const reportBtn = document.getElementById('reportBtn');
const healthReportEl = document.getElementById('healthReport');
const resetBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');
const bigResetBtn = document.getElementById('bigRestart');
const startBtn = document.getElementById('startBtn');
const startp = document.getElementById('startp')
const stats = document.getElementById('stats');
const deathMessage = document.getElementById('deathMessage');
const speechBubbles = document.getElementById('speechBubbles');
const pet = {
    hunger: 5,
    energy: 5,
    happiness: 5,
}
const barEls = {
    hunger: document.getElementById('hungerBar'),
    energy: document.getElementById('energyBar'),
    happiness: document.getElementById('happinessBar')
}
const moodImages = {
    happy: "assets/Happy_Axel_Tamagotchi.GIF",
    sad: "assets/Sad_Axel_Tamagotchi.GIF",
    dead: "assets/Dead_Axel_Tamagotchi.GIF",
    paused: "assets/pause.png",
    sleep: "assets/sleep.png",
    jumpy: "assets/jumpy.gif"
}
const statWarnings = {
    hunger: document.getElementById('hungerWarn'),
    energy: document.getElementById('energyWarn'),
    happiness: document.getElementById('happyWarn')
}

let isPaused = false;
let isAsleep = false;
let isJumpy = false;


function clampStat(value) {
    return Math.max(0, Math.min(10, value));
}


function getMood() {
    // === means "strict equality", it checks both value and type
    if (pet.hunger === 0 || pet.energy === 0 || pet.happiness === 0) {
        if (pet.hunger === 0) {
            deathMessage.textContent = "Oh no!!! He starved!! You're a bad pet owner. >:(";
        } else if(pet.energy === 0) {
            deathMessage.textContent = "Why wouldn't you let him go to sleep? Welp, now he's asleep for ever...";
        } else {
            deathMessage.textContent = "You're so bad at having a pet that he died of sadness. :C";
        }
        deathMessage.classList.add("show");
        return "dead";
    } else if (isAsleep) {
        return "sleep";
    } else if (isJumpy) {
        return "jumpy";
    } else if (pet.hunger < 3 || pet.energy < 3 || pet.happiness < 3) {
        return "sad";
    } else{
        return "happy";
    }
}

function updatePetImage() {
    if (isPaused) {
        petImage.src = moodImages["paused"];
    } else {
        let temp = getMood();
        petImage.src = moodImages[temp];
        if (temp === "dead") {hideBtn()};
    };
}

function updateStats() {
    Object.keys(statEls).forEach((stat) => {
        statEls[stat].textContent = pet[stat];

        const percent = (pet[stat] / 10) * 100;
        barEls[stat].style.width = percent + "%";
        barEls[stat].style.background = barColor(pet[stat]);
        updatePetImage(stat);
    });
    updateWarnings();
    updatePetImage();
}

function updateWarnings() {
    Object.keys(statWarnings).forEach((stat) => {
        if (!statWarnings[stat]) return;
        if (pet[stat] < 4) {
            statWarnings[stat].classList.add("flashing2");
        } else {
            statWarnings[stat].classList.remove("flashing2");
        };
    });
}

function hideWarnings() {
    Object.keys(statWarnings).forEach((stat) => {
        statWarnings[stat].classList.remove("flashing2");
    });
}

function barColor(value) {
    if (value <= 2) return "#bf5555";
    if (value <= 4) return "#f2dd82";
    return "#0ff";
}

function performAction(changes, words) {
    if(getMood() === "dead") {isJumpy = false};
    Object.entries(changes).forEach(([stat, delta]) => {
        pet[stat] = clampStat(pet[stat] + delta);
    });
    speechBubbles.textContent = words;
    speechBubbles.classList.add("show");
    updateStats();
    setTimeout(() => {
        speechBubbles.classList.remove("show");
    }, 2000);
}

feedBtn.addEventListener('click', () => {
    if (isAsleep) return;
    isJumpy = true;
    if (pet.hunger < 3) {
        performAction({hunger: +2, happiness: +1}, "Feed me more!!");
    } else {
        performAction({hunger: +2, happiness: +1}, "Yummy!!");
    }; 
    setTimeout(() => {
        isJumpy = false;
        updateStats();
    }, 500);
});

playBtn.addEventListener('click', () => {
    if (isAsleep) return;
    isJumpy = true;
    if (pet.happiness < 3) {
        performAction({happiness: +2, energy: -1, hunger: -1}, "Let's play more!!");
    };
    performAction({happiness: +2, energy: -1, hunger: -1}, "Yay!");
    setTimeout(() => {
        isJumpy = false;
        updateStats();
    }, 500);
});

restBtn.addEventListener('click', () => {
    isAsleep = true;
    sleepBtn();
    if (pet.energy < 4) {
        performAction({energy: +2, hunger: -1}, "zzZZZZzzzz");
    } else {
        performAction({energy: +2, hunger: -1}, "zzz");
    };
    setTimeout(() => {
        isAsleep = false;
        updateStats();
        sleepBtn();
    }, 1000);
});

function sleepBtn() {
    if (isAsleep) {
        feedBtn.classList.add("sleeping");
        playBtn.classList.add("sleeping");
    } else {
        feedBtn.classList.remove("sleeping");
        playBtn.classList.remove("sleeping");
    }
}

function decayStats() {
    if (getMood() === "dead" || isPaused || isAsleep) {return};
    if (pet.hunger < 4 || pet.energy < 4) {
        pet.happiness = clampStat(pet.happiness - 2);
    } else {pet.happiness = clampStat(pet.happiness - 1);}
    pet.hunger = clampStat(pet.hunger - 1);
    pet.energy = clampStat(pet.energy - 1);
    updateStats();
}


reportBtn.addEventListener('click', () => {
    healthReportEl.innerHTML = getHealthReportHTML();

    // show + auto-hide after 2 seconds
    healthReportEl.classList.add("show");
    setTimeout(() => {
        healthReportEl.classList.remove("show");
    }, 3000);
});



function getHealthReportHTML() {
    return `
        <h2>Pet Health Report</h2>
        
        <ul>
            <li><strong>Hunger:</strong> - ${pet.hunger < 3 ? "Very Hungry" : "Okay"}</li>
            <li><strong>Energy:</strong> - ${pet.energy < 3 ? "Very tired" : "Energized"}</li>
            <li><strong>Happiness:</strong> - ${pet.happiness < 4 ? "Very sad" : "Happy!"}</li>
        </ul>
    `;
}

resetBtn.addEventListener('click', () => {    
    resetPet();
});

bigResetBtn.addEventListener('click', () => {    
    resetPet();
});

function resetPet(){
    pet.hunger = 5;
    pet.energy = 5;
    pet.happiness = 5;
    isAsleep = false;
    if (isPaused) pause();
    updateStats();
    showBtn();
    sleepBtn();
    stats.classList.remove("hide");
    healthReportEl.classList.remove("show");
    speechBubbles.classList.remove("show");
}

function showBtn() {
    bigResetBtn.classList.remove("show");
    bigResetBtn.classList.remove("flashing")
    deathMessage.classList.remove("show")
    feedBtn.classList.add("btnShow");
    playBtn.classList.add("btnShow");
    restBtn.classList.add("btnShow");
    reportBtn.classList.add("btnShow");
    pauseBtn.classList.add("btnShown");
    resetBtn.classList.add("btnShown");
    updateWarnings();
}

function hideBtn() {
    feedBtn.classList.remove("btnShow");
    playBtn.classList.remove("btnShow");
    restBtn.classList.remove("btnShow");
    feedBtn.classList.remove("sleeping");
    playBtn.classList.remove("sleeping");
    reportBtn.classList.remove("btnShow");
    if (getMood() === "dead") {
        stats.classList.add("hide");
        pauseBtn.classList.remove("btnShown");
        resetBtn.classList.remove("btnShown");
        
        bigResetBtn.classList.add("show");
        bigResetBtn.classList.add("flashing")
    }
    speechBubbles.classList.remove("show");
    hideWarnings();
}

function pause(){
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Play" : "Pause";
    updatePetImage();
    
    if (isPaused) {
        healthReportEl.classList.remove("show");
        hideBtn()
    } else {
        showBtn()
    }
}

pauseBtn.addEventListener('click', () => {
    pause();
});

startBtn.addEventListener('click', () => {
    showBtn();
    updateStats();
    setInterval(decayStats, 10000);
    startBtn.classList.add("hide")
    startp.classList.add("hide")
});




