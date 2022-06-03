const ATTACK_VALUE = 10;
const MONSTER_ATTACK = 12;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const STRONG_MODE_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Maximum life for You", "100");

let chosenMaxLife = parseInt( enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;


adjustHealthBars(chosenMaxLife);

function writeToLog (event, value, monsterHealth, playerHealth){
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPLayerHealth: playerHealth,
    };
    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry.target = 'GAME_OVER';
            break;
            default: 
            logEntry = {};
    }
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if(event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = 'PLAYER';
    }
    else if (event === LOG_EVENT_PLAYER_HEAL){
            logEntry.target = 'PLAYER'
        } else if (event === LOG_EVENT_GAME_OVER){
            logEntry.target = 'GAME_OVER';
            }
        battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const reverseDamage = dealPlayerDamage(MONSTER_ATTACK);
    currentPlayerHealth -= reverseDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, reverseDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert("You would be dead but the bonus life saved you");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('Player won!');
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
        
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('Monster won!');
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
        
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('Its a draw!');
        writeToLog(LOG_EVENT_GAME_OVER, 'ITS A DRAW', currentMonsterHealth, currentPlayerHealth);
   }

   if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
       reset();
   }
}

function attackMonster(mode){
    let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE; 
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK ;
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
 attackMonster('ATTACK')};


function strongAttackHandler () {
    attackMonster('STRONG_ATTACK') 
}

function healPLayerHandler (){
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('You cant heal more than your max health');
    } else {
        healValue = HEAL_VALUE;
    }
 increasePlayerHealth(HEAL_VALUE);
 currentPlayerHealth += HEAL_VALUE;
 writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
 endRound();
}

function printLogHandler(){
    // for (let i = 0; i < 3; i++) {
    //     console.log('-----------')
    // }

    let j = 0;
    while (j < 3){
        console.log('----------');
        j++;
    };

    let i = 0;
    for (const logEntry of battleLog) {
        console.log(`#${i}`)
        for (const key in logEntry) {
            console.log(`${key} => ${logEntry.key}`);
        }
        i++;
    }
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPLayerHandler);
logBtn.addEventListener('click', printLogHandler);