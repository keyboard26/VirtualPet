
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

const deathMessage = document.getElementById('deathMessage');

const pet = {
    hunger: 5,
    energy: 5,
    happiness: 5,
}

const moodImages = {
    happy: "assets/Happy_Axel_Tamagotchi.GIF",
    sad: "assets/Sad_Axel_Tamagotchi.GIF",
    dead: "assets/Dead_Axel_Tamagotchi.GIF",
    paused: "assets/pause.png"
}

let isPaused = false;

function clampStat(value) {
    return Math.max(0, Math.min(10, value));
}


function getMood() {
    // === means "strict equality", it checks both value and type
    if (pet.hunger === 10 || pet.energy === 0 || pet.happiness === 0) {
        if (pet.hunger === 10) {
            deathMessage.textContent = "Oh no!!! He starved!! You're a bad pet owner. >:(";
        } else if(pet.energy === 0) {
            deathMessage.textContent = "Why wouldn't you let him go to sleep? Welp, now he's asleep for ever...";
        } else {
            deathMessage.textContent = "You're so bad at having a pet that he died of sadness. :C";
        }
        deathMessage.classList.add("show");
        return "dead";
    } else if (pet.hunger > 8 || pet.energy < 3 || pet.happiness < 3) {
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
    })
    updatePetImage();
}

function performAction(changes) {
    if(getMood() === "dead") {return};
    Object.entries(changes).forEach(([stat, delta]) => {
        pet[stat] = clampStat(pet[stat] + delta);
    });
    updateStats();
}

feedBtn.addEventListener('click', () => {
    performAction({hunger: -2, happiness: +1});
});

playBtn.addEventListener('click', () => {
    performAction({happiness: +2, energy: -1, hunger: +1});
});

restBtn.addEventListener('click', () => {
    performAction({energy: +3, hunger: +1});
});

function decayStats() {
    if (getMood() === "dead" || isPaused) {return};
    pet.hunger = clampStat(pet.hunger + 1);
    pet.energy = clampStat(pet.energy - 1);
    pet.happiness = clampStat(pet.happiness - 2);
    updateStats();
}


reportBtn.addEventListener('click', () => {
    const html = getHealthReportHTML();
    healthReportEl.innerHTML = html;

    // show + auto-hide after 2 seconds
    healthReportEl.classList.add("show");
    setTimeout(() => {
        healthReportEl.classList.remove("show");
    }, 3000);
});

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
        pauseBtn.classList.remove("btnShown");
        resetBtn.classList.remove("btnShown");
        
        bigResetBtn.classList.add("show");
        bigResetBtn.classList.add("flashing")
    }
}

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
            <li><strong>Hunger:</strong> ${pet.hunger} - ${pet.hunger > 8 ? "Very hungry" : "Okay"}</li>
            <li><strong>Energy:</strong> ${pet.energy} - ${pet.energy < 3 ? "Very tired" : "Energized"}</li>
            <li><strong>Happiness:</strong> ${pet.happiness} - ${pet.happiness < 3 ? "Very sad" : "Happy"}</li>
        </ul>
    `;
}

function pause(){
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Play" : "Pause";
    updatePetImage();
    
    if (isPaused) {
        hideBtn()
    } else {
        showBtn()
    }
}

pauseBtn.addEventListener('click', () => {
    pause();
});


showBtn();
updateStats();
setInterval(decayStats, 10000);

