function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }

    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

window.onload = function () {
    // Game variables
    var levelDuration = 60 * 2;
        // score
    var score = 0; // change every second
    var grade = 'F9'; // change every second
    var scoreRate = 0.0; // change on event
        // gold
    var gold = 0; // change every second
    var goldRate = 0.0; // change on event
        // bubbles
    var bubbleVisibilities = [false, false, false, false]; // change every second
        // boosts
    var currentBoost = null; // change every second, set on event
    var currentBoostDuration = 0; // change every second, set on event
    var boostIsBuyable = [false, false, false, false, false]; // change every second
        // upgrades
    var upgradeQuantities = [0, 0, 0, 0, 0]; // change on event
    var upgradeIsBuyable = [false, false, false, false, false]; // change every second

    // Maximum Variables
    var maxGold = 900;
    var maxScore = 1000;
    var maxScoreRate = 50;
    var maxUpgradePurchases = 99;

    // Constant Variables
    var upgradeNames = ['Stress Ball', 'Stationery', 'Practise Papers', 'Assessment Book', 'Tuition'];
    var upgradeCosts = [5, 10, 15, 25, 40];
    var upgradeRates = [0.1, 0.2, 0.5, 1, 2];

    var boostNames = ['Water', 'Milo', 'Coffee', 'Red Bull', 'Essence of Chicken'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [0.1, 0.3, 0.5, 0.7, 1];
    var boostDurations = [5, 5, 5, 5, 10];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [350, 450, 500, 550, 600, 650, 700, 1000, 999999];




    // DOM
    var timeDisplay = document.querySelector('#time');




    // Start functions
    startTimer(levelDuration, timeDisplay);
};