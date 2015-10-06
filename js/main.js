(function() {
    // Game variables
    var levelDuration = 120;
    var levels = 1;
    var currentLevel = 1;
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
    var upgradeNames = ['Stress Balloons', 'Stationery', 'Practise Papers', 'Guidebook', 'Tuition'];
    var upgradeCosts = [5, 10, 15, 25, 40];
    var upgradeRates = [0.1, 0.2, 0.5, 1.0, 2.0];

    var boostNames = ['Water', 'Milo', 'Coffee', 'Red Bull', 'Chicken Essence'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [0.1, 0.3, 0.5, 0.7, 1.0];
    var boostDurations = [5, 5, 5, 5, 10];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [350, 450, 500, 550, 600, 650, 700, 1000, 999999];



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

            // red if running out of time
            if (diff < 10) {
                $('.time-screen').addClass('last-ten-seconds');
            }

            if (diff <= 0) {
                // add one second so that the count down starts at the full duration
                // example 05:00 not 04:59
                start = Date.now() + 1000;
                currentLevel++;
                if (currentLevel > levels) {
                    alert('Time\'s up');
                }
                $('.time-screen').removeClass('last-ten-seconds');
            }

        };
        // we don't want to wait a full second before the timer starts
        timer();
        setInterval(timer, 1000);
    }

    function populateUpgradesAndBoosts() {
        var html = '';
        // upgrades
        for (var i = 0; i < upgradeNames.length; i++) {
            var upgradeNumber = i + 1;
            html += '<div class="item-cell unbuyable" title="+' + upgradeRates[i] + ' score per second" id="upgrade-' + i + '">';
            html += '<div class="item-img"><img src="img\/u' + upgradeNumber + '.png"><\/div>';
            html += '<div class="item-name">' + upgradeNames[i] + '<\/div>';
            html += '<div class="item-qty">Qty: ' + upgradeQuantities[i] + '<\/div>';
            html += '<img src="img\/coins.png" class="item-coin"><div class="item-cost">' + upgradeCosts[i] + '<\/div>';
            html += '<\/div>';
        }
        // boosts
        for (var i = 0; i < upgradeNames.length; i++) {
            var boostNumber = i + 1;
            html += '<div class="item-cell unbuyable" title="+' + boostRates[i] + ' score for ' + boostDurations[i] +  ' seconds" id="boost-' + i + '">';
            html += '<div class="item-img"><img src="img\/b' + boostNumber + '.png"><\/div>';
            html += '<div class="item-name">' + boostNames[i] + '<\/div>';
            html += '<div class="item-active-boost"><br></div>';
            html += '<img src="img\/coins.png" class="item-coin"><div class="item-cost">' + boostCosts[i] + '<\/div>';
            html += '<\/div>';
        }
        //console.log(html);
        document.getElementById("item-screen").innerHTML = html;
    }


    window.onload = function () {
        // DOM
        var timeDisplay = document.querySelector('#time');

        // Start functions
        startTimer(levelDuration, timeDisplay);
        populateUpgradesAndBoosts();
    };
})();