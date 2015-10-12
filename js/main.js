(function() {
    // Game variables
    var levelDuration = 300;
    var levels = 1;
    var currentLevel = 1;
    var raceLineHeight = 530;
    var mode = "studying";
    var gameHasStarted = false;

    // score
    var score = 0; // change every second
    var grade = 'F9'; // change every second
    var scoreRate = 0.0; // change on event
    var clickScoreRate = 1;

    // gold
    var gold = 0; // change every second
    var goldRate = 1; // change on event
    var clickGoldRate = 1;

    // bubbles
    var bubbleVisibilities = [false, false, false, false]; // change every second
// boosts
    var currentBoost = null; // change every second, set on event
    var currentBoostDuration = 0; // change every second, set on event

    // upgrades
    var upgradeQuantities = [0, 0, 0, 0, 0]; // change on event

    // Maximum Variables
    var maxGold = 900;
    var maxScore = 10000;
    var maxScoreRate = 500;
    var maxUpgradePurchases = 99;

    // Constant Variables
    var upgradeNames = ['Stress Balloons', 'Stationery', 'Practice Papers', 'Guidebook', 'Tuition'];
    var upgradeCosts = [5, 10, 15, 25, 40];
    var upgradeRates = [10, 20, 50, 100, 200];

    var boostNames = ['Water', 'Milo', 'Coffee', 'Red Bull', 'Chicken Essence'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [10, 30, 50, 70, 100];
    var boostDurations = [5, 5, 5, 5, 10];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [350, 450, 500, 550, 600, 650, 700, 1000, 999999];

    var statuses = ['You are studying to improve your score.', 'You are working to earn some gold.'];

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Utility functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    function round(value){
        return Math.round( value * 10 ) / 10;
    }


    function calculateNewRacePosition(scoreVal) {
        var roundScore = round(scoreVal);
        var percentageOfMaxScore = roundScore/maxScore;
        var newRacePosition = Math.round(raceLineHeight - percentageOfMaxScore*raceLineHeight);
        return newRacePosition;
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Add functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function deductScoreRate(value) {
        if (gameHasStarted) {
            if (scoreRate > value) {
                scoreRate -= value;
            } else {
                scoreRate = 0;
            }
        }
        updateDisplay();
    }

    function addScoreRate(value) {
        if (gameHasStarted) {
            scoreRate += value;
            if (scoreRate > maxScoreRate) { scoreRate = maxScoreRate; }
        }
    }

    function deductGold(value) {
        if (gameHasStarted) {
            if (gold >= value) {
                gold -= value;
            } else {
                gold = 0;
            }
        }
        updateDisplay();
    }

    function addGold(value) {
        if (gameHasStarted) {
            if (gold > maxGold) {
                gold = maxGold;
            } else {
                gold += value;
            }
        }
        updateDisplay();
    }

    function addScore(value) {
        if (gameHasStarted) {
            score += value;
            if (score > maxScore) {
                score = maxScore;
            }
        }
        updateDisplay();
    }

    function addUpgrade(upgradeNumber) {
        if (upgradeQuantities[upgradeNumber] < maxUpgradePurchases) {
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
        if ((gold >= upgradeCosts[itemNumber]) && (upgradeQuantities[itemNumber] < maxUpgradePurchases)) {
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
    // Click functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    function clickGold() {
        if (gameHasStarted) {
            mode = "working";
            // activate work and deactivate study
            $("#clickgold").removeClass("unclickable");
            $("#clickscore").addClass("unclickable");
            $("#status").text(statuses[1]);

            addGold(clickGoldRate);
        }
    }

    function clickScore() {
        if (gameHasStarted) {
            mode = "studying";
            // activate study and deactivate work
            $("#clickscore").removeClass("unclickable");
            $("#clickgold").addClass("unclickable");
            $("#status").text(statuses[0]);

            addScore(clickScoreRate);
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

    // Trigger any random event
    function updateRandomEvent() {
        console.log('random event for this second');
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Update display functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

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
        document.querySelector('#poor-player-score').textContent = round(score);
        document.querySelector('#poor-player-rate').textContent = '+' + round(scoreRate);
    }

    function updateRaceLineDisplay() {
        // update poor score and position
        document.getElementById("poor-race").title = round(score);
        var newPosition = calculateNewRacePosition(score);
        $("#poor-race").css({top: newPosition + "px"});
    }

    // Refreshes the entire display every second
    function updateDisplay() {
        updateItemDisplay();
        updateStatsDisplay();
        updateRaceLineDisplay();
    }

    function update() {
        // countdown boost
        updateBoost();

        // trigger random event if any
        updateRandomEvent();

        // passive score
        if (mode == "studying") {
            addScore(scoreRate);
        }

        // displays
        updateDisplay();
        updateStatsDisplay();
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

    function initializeClickables() {
        var clickScoreDOM =  $("#clickscore");
        var clickGoldDOM = $("#clickgold");
        var statusDOM = $("#status");

        // set up click events
        clickScoreDOM.click(function () {
            clickScore();
        });
        clickGoldDOM.click(function () {
            clickGold();
        });

        // set the tooltip value
        clickScoreDOM.attr('title', 'Study for +' + clickScoreRate +  ' score');
        clickGoldDOM.attr('title', 'Work for +' + clickGoldRate +  ' gold');

        // set up the display DOM
        if (mode == "working") {
            clickGoldDOM.removeClass("unclickable");
            clickScoreDOM.addClass("unclickable");
            statusDOM.text(statuses[1]);
        } else { // studying
            clickScoreDOM.removeClass("unclickable");
            clickGoldDOM.addClass("unclickable");
            statusDOM.text(statuses[0]);
        }
    }

    function startGame() {
        gameHasStarted = true;
        $('.player-screen').removeClass("grey");
        // DOM
        var timeDisplay = document.querySelector('#time');
        startTimer(levelDuration, timeDisplay);
    }


    window.onload = function () {

        // Initialization
        populateUpgradesAndBoosts();
        initializeClickables();

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