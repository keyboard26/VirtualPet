
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
    paused: "assets/pause.png"
}
const html = getHealthReportHTML();

let isPaused = false;


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
        let temp = getMood()
        petImage.src = moodImages[temp];

        if (temp === "dead") {hideBtn()}
    }
    
}

function updateStats() {
    Object.keys(statEls).forEach((stat) => {
        statEls[stat].textContent = pet[stat];

        const percent = (pet[stat] / 10) * 100;
        barEls[stat].style.width = percent + "%";
        barEls[stat].style.background = barColor(pet[stat]);
    })
    updatePetImage();
}

function barColor(value) {
    if (value <= 2) return "#bf5555";
    if (value <= 4) return "#f2dd82";
    return "#0ff";
}

function performAction(changes) {
    if(getMood() === "dead") {return};
    Object.entries(changes).forEach(([stat, delta]) => {
        pet[stat] = clampStat(pet[stat] + delta);
    });
    updateStats();
}

feedBtn.addEventListener('click', () => {
    performAction({hunger: +2, happiness: +1});
});

playBtn.addEventListener('click', () => {
    performAction({happiness: +2, energy: -1, hunger: -1});
});

restBtn.addEventListener('click', () => {
    performAction({energy: +2, hunger: -1});
});

function decayStats() {
    if (getMood() === "dead" || isPaused) {return};
    pet.hunger = clampStat(pet.hunger - 1);
    pet.energy = clampStat(pet.energy - 1);
    pet.happiness = clampStat(pet.happiness - 1);
    updateStats();
}


reportBtn.addEventListener('click', () => {
    healthReportEl.innerHTML = html;

    // show + auto-hide after 2 seconds
    healthReportEl.classList.add("show");
    setTimeout(() => {
        healthReportEl.classList.remove("show");
    }, 3000);
});


function getHealthReportHTML() {
    if(getMood() === "dead") {
        return `
        <h2>Pet Health Report</h2>
        <p>Your pet has passed away. Please take better care of it next time.</p>
        `;
    }
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
    if (isPaused) pause();
    updateStats();
    showBtn();
    stats.classList.remove("hide");
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
}

function hideBtn() {
    feedBtn.classList.remove("btnShow");
    playBtn.classList.remove("btnShow");
    restBtn.classList.remove("btnShow");
    reportBtn.classList.remove("btnShow");
    if (getMood() === "dead") {
        stats.classList.add("hide");
        pauseBtn.classList.remove("btnShown");
        resetBtn.classList.remove("btnShown");
        
        bigResetBtn.classList.add("show");
        bigResetBtn.classList.add("flashing")
    }
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




