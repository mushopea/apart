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
    var goldRate = 1; // change on event
    // bubbles
    var bubbleVisibilities = [false, false, false, false]; // change every second
// boosts
    var currentBoost = null; // change every second, set on event
    var currentBoostDuration = 0; // change every second, set on event

    // upgrades
    var upgradeQuantities = [0, 0, 0, 0, 0]; // change on event

    // Maximum Variables
    var maxGold = 900;
    var maxScore = 1000;
    var maxScoreRate = 50;
    var maxUpgradePurchases = 99;

    // Constant Variables
    var upgradeNames = ['Stress Balloons', 'Stationery', 'Practice Papers', 'Guidebook', 'Tuition'];
    var upgradeCosts = [5, 10, 15, 25, 40];
    var upgradeRates = [0.1, 0.2, 0.5, 1.0, 2.0];

    var boostNames = ['Water', 'Milo', 'Coffee', 'Red Bull', 'Chicken Essence'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [0.1, 0.3, 0.5, 0.7, 1.0];
    var boostDurations = [5, 5, 5, 5, 10];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [350, 450, 500, 550, 600, 650, 700, 1000, 999999];

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Add functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function deductScoreRate(value) {
        if (scoreRate > value) {
            scoreRate -= value;
        } else {
            scoreRate = 0;
        }
    }

    function addScoreRate(value) {
        scoreRate += value;
        if (scoreRate > maxScoreRate) { scoreRate = maxScoreRate; }
    }

    function deductGold(value) {
        if (gold >= value) {
            gold -= value;
        } else {
            gold = 0;
        }
    }

    function addGold(value) {
        if (gold > maxGold) {
            gold = maxGold;
        } else {
            gold += value;
        }
    }

    function addScore(value) {
        score += value;
        if (score > maxScore) { score = maxScore; }
    }

    function addUpgrade(upgradeNumber) {
        if(upgradeQuantities[upgradeNumber] < maxUpgradePurchases) {
            upgradeQuantities[upgradeNumber]++;
        }
        // update the display of quantity
        var upgradeDOM = String('#upgrade-' + upgradeNumber);
        $(upgradeDOM).find(".item-qty").html('Qty: ' + String(upgradeQuantities[upgradeNumber]));
    }


    function addBoost(boostNumber) {
        deductBoost();
        currentBoost = boostNumber;
        currentBoostDuration = boostDurations[boostNumber];

        // add the score rate
        rate = boostRates[boostNumber];
        addScoreRate(rate);
    }

    function deductBoost() {
        if (currentBoost !== null) {
            deductScoreRate(boostRates[currentBoost]);
            currentBoost = null;

            // update DOM, clear the countdown
            for (var i = 0; i < boostNames.length; i++) {
                var upgradeDOM = String('#boost-' + i);
                $(upgradeDOM).find(".item-active-boost").html('<br>');
            }
        }
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Buy functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function buyUpgrade(itemNumber) {
        // if the player has enough gold
        if (gold >= upgradeCosts[itemNumber]) {
            // buy the upgrade increase the quantity
            addUpgrade(itemNumber);
            // deduct gold
            deductGold(upgradeCosts[itemNumber]);
            // apply the effect of the upgrade (increase the rate)
            addScoreRate(upgradeRates[itemNumber]);
        }
    }

    function buyBoost(itemNumber) {
        // if the player has enough gold
        if (gold >= boostCosts[itemNumber]) {
            // buy the boost
            addBoost(itemNumber);
            deductGold(boostCosts[itemNumber]);
        }
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Update functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    // Update boost
    function updateBoost() {
        if ((currentBoost !== null) && (currentBoostDuration >= 0)) {

            if (currentBoostDuration == 0) {
                // deactivate the boost
                deductBoost();
            } else {
                // update DOM with the countdown
                var upgradeDOM = String('#boost-' + currentBoost);
                $(upgradeDOM).find(".item-active-boost").html(currentBoostDuration + ' s left');
                // countdown boost activation
                currentBoostDuration--;
            }
        }
    }

    // The following function greys out the items the player
    // cannot afford at the moment.
    function updateItemDisplay() {
        for (var i = 0; i < upgradeNames.length; i++) {
            if (gold >= upgradeCosts[i]) {
                $("#upgrade-" + i).removeClass("unbuyable");
            } else {
                $("#upgrade-" + i).addClass("unbuyable");
            }
        }

        for (var i = 0; i < boostNames.length; i++) {
            if (gold >= boostCosts[i]) {
                $("#boost-" + i).removeClass("unbuyable");
            } else {
                $("#boost-" + i).addClass("unbuyable");
            }
        }
    }

    function updateStatsDisplay() {
        document.querySelector('#poor-player-gold').textContent = gold;
        document.querySelector('#poor-player-score').textContent = Math.round( score * 10 ) / 10;
        document.querySelector('#poor-player-rate').textContent = '+' + Math.round( scoreRate * 10 ) / 10;
    }

    // Refreshes the entire display every second
    function updateDisplay() {
        updateItemDisplay();
        updateStatsDisplay();
    }

    function update() {
        updateBoost();
        addGold(goldRate);
        addScore(scoreRate);
        updateDisplay();
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Timer
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

            update();

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


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Startup functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

    function startGame() {
        // DOM
        var timeDisplay = document.querySelector('#time');
        startTimer(levelDuration, timeDisplay);
    }


    window.onload = function () {

        // Initialization
        populateUpgradesAndBoosts();

        // Start game when click 'Start'
        $('#time').click(function() {
            startGame();
        });

        // Fire events when an item is clicked
        // To buy an item
        $('.item-cell').bind('click', function() {
            var itemID = String($(this).attr('id'));
            var itemNumber = itemID.charAt(itemID.length-1);

            if (itemID.charAt(0) == 'b') {
                // item is a boost
                buyBoost(itemNumber);

            } else if (itemID.charAt(0) == 'u') {
                // item is an upgrade
                buyUpgrade(itemNumber);
            }

        });
    };
})();