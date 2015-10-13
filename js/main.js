(function() {
    // Game variables
    var levelDuration = 300;
    var raceLineHeight = 530;
    var gameHasStarted = false;
    var secondsPassed = 0;

    // * * * * * * * * * * * * * * * * * * *
    // Player
    // * * * * * * * * * * * * * * * * * * *

    // score
    var score = 0; // change every second
    var grade = 'F9'; // change every second
    var scoreRate = 0.0; // change on event
    var clickScoreRate = 10;
    // gold
    var gold = 0; // change every second
    var clickGoldRate = 2;
    // boost
    var currentBoost = null; // change every second, set on event
    var currentBoostDuration = 0; // change every second, set on event
    // upgrades
    var upgradeQuantities = [0, 0, 0, 0, 0]; // change on event
    // mode
    var mode = "studying";

    // * * * * * * * * * * * * * * * * * * *
    // RichKid
    // * * * * * * * * * * * * * * * * * * *

    var rScore = 0;
    var rGrade = 'F9';
    var rScoreRate = 0.0;
    var rGold = 0;
    var rGoldRate = 50;
    var rUpgradeQuantities = [0, 0, 0, 0, 0];

    // * * * * * * * * * * * * * * * * * * *
    // Constant Variables
    // * * * * * * * * * * * * * * * * * * *

    var upgradeNames = ['Stress Balloons', 'Stationery', 'Practice Papers', 'Guidebook', 'Tuition'];
    var upgradeCosts = [5, 10, 15, 25, 40];
    var upgradeRates = [1, 2, 5, 10, 20];

    var boostNames = ['Water', 'Milo', 'Coffee', 'Red Bull', 'Chicken Roast'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [10, 30, 50, 70, 90];
    var boostDurations = [5, 5, 5, 5, 10];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [35000, 45000, 50000, 55000, 60000, 65000, 70000, 85000, 99999999];

    var statuses = ["You are studying to improve your score.", "You are working to earn some gold."];

    var goodEvents = [
      ["Good Event 1", 0.1],
      ["Good Event 2", 0.07],
      ["Good Event 3", 0.05],
      ["Good Event 4", 0.04],
      ["Good Event 5", 0.25],
      ["Good Event 6", 0.02],
      ["Good Event 7", 0.01],
    ];

    var badEvents = [
      ["Bad Event 1", 1, 0.05],
      ["Bad Event 2", 1, 0.04],
      ["Bad Event 3", 1, 0.03],
      ["Bad Event 4", 1, 0.02],
      ["Bad Event 5", 1, 0.01],
      ["Bad Event 6", 2, 0.05],
      ["Bad Event 7", 2, 0.04],
      ["Bad Event 8", 2, 0.03],
      ["Bad Event 9", 2, 0.02],
      ["Bad Event 10", 2, 0.01]
    ]; // 1 = add to rich, 2 = deduct from poor

    // Maximum Variables
    var maxGold = 900;
    var maxScore = 100000;
    var maxScoreRate = 900;
    var maxUpgradePurchases = 99;

    // Game Random Event Balancing variables
    var idealDiff = -2500;
    var maxDiff = maxScore;
    var goodRange = Math.abs(0 - maxDiff - idealDiff);
    var badRange = Math.abs(maxDiff * 2) - goodRange;


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
            if ((gold + value) > maxGold) {
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

    function deductScore(value) {
        if (gameHasStarted) {
            score -= value;
            if (score < 0) {
                score = 0;
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
    // RICH KID FUNCTIONS
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function addScoreRateForRich(value) {
        if (gameHasStarted) {
            rScoreRate  += value;
            if (rScoreRate  > maxScoreRate) { rScoreRate  = maxScoreRate; }
        }
    }

    function deductGoldForRich(value) {
        if (gameHasStarted) {
            if (rGold >= value) {
                rGold -= value;
            } else {
                rGold = 0;
            }
        }
        updateRichKidDisplay();
    }

    function addGoldForRich(value) {
        if (gameHasStarted) {
            if ((rGold+value) >= maxGold) {
                rGold = maxGold;
            } else {
                rGold += value;
            }
        }
        updateRichKidDisplay();
    }

    function addScoreForRich(value) {
        if (gameHasStarted) {
            rScore += value;
            if (rScore > maxScore) {
                rScore = maxScore;
            }
        }
        updateRichKidDisplay();
    }

    function addUpgradeForRich(upgradeNumber) {
        if (rUpgradeQuantities[upgradeNumber] < maxUpgradePurchases) {
            rUpgradeQuantities[upgradeNumber]++;

            // post on messages that rich kid bought something.
            $('.message-list').append("<li>Bought " + upgradeNames[upgradeNumber] + "<\/li>");
            $('.messages').animate({scrollTop: $('.messages').prop("scrollHeight")}, 300);
        }
    }

    function buyUpgradeForRich(itemNumber) {
        // if the player has enough rGold
        if ((rGold >= upgradeCosts[itemNumber]) && (rUpgradeQuantities[itemNumber] < maxUpgradePurchases)) {
            // buy the upgrade increase the quantity
            addUpgradeForRich(itemNumber);
            // deduct rGold
            deductGoldForRich(upgradeCosts[itemNumber]);
            // apply the effect of the upgrade (increase the rate)
            addScoreRateForRich(upgradeRates[itemNumber]);
        }
    }

    // takes in an array of things to buy
    function buyMultipleUpgradesForRich(shoppingList) {
        if ((shoppingList instanceof Array) && (shoppingList.length > 0)) {
            for (var i = 0; i < shoppingList.length; i++) { // go through shopping list and buy the things
                buyUpgradeForRich(shoppingList[i]);
            }
        }
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Random event functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    function displayEvent(kid, text, change, score) {
        var displayDOM;
        if (kid == "poorkid") {
            displayDOM = $('#poor-event');
        } else if (kid == "richkid") {
            displayDOM = $('#rich-event');
        } else {
            console.log("Displaying invalid kids event");
        }
        var textToDisplay = text + "<br>" + change + score + " points.";
        displayDOM.html(textToDisplay);
    }

    function triggerAnyGoodEvent() {
        console.log("Triggering a good event");
        var eventNumberToTrigger = Math.floor(Math.random() * goodEvents.length);
        var scoreToAdd = Math.floor(score * goodEvents[eventNumberToTrigger][1]);
        addScore(scoreToAdd);
        displayEvent("poorkid", goodEvents[eventNumberToTrigger][0], "+", scoreToAdd);
    }

    function triggerAnyBadEvent() {
        if (score > (maxScore / 5)) {
            console.log("Triggering a bad event");
            var eventNumberToTrigger = Math.floor(Math.random() * badEvents.length);
            var eventType = badEvents[eventNumberToTrigger][1];
            var eventText = badEvents[eventNumberToTrigger][0];
            var scoreToChange = 0;

            switch (eventType) {
                case 1: // event is to add score to the rich kid
                    scoreToChange = Math.floor(rScore * badEvents[eventNumberToTrigger][2]);
                    addScoreForRich(scoreToChange);
                    displayEvent("richkid", eventText, "+", scoreToChange);
                    break;
                case 2: // event is to deduct score from poor kid
                    scoreToChange = Math.floor(score * badEvents[eventNumberToTrigger][2]);
                    deductScore(scoreToChange);
                    displayEvent("poorkid", eventText, "-", scoreToChange);
                    break;
                default:
                    console.log("Invalid event type");
                    break;
            }
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

    // Buy stuff for rich kid at particular times
    function updateRichKidPurchases() {
        var thingsToBuy = [];
        switch(secondsPassed) {
            case 10:
                thingsToBuy = [4, 2, 3, 3, 1, 1, 3];
                break;
            case 30:
                thingsToBuy = [3, 3, 2, 4, 2, 1];
                break;
            case 50:
                thingsToBuy = [1, 2, 2, 3, 4];
                break;
            case 70:
                thingsToBuy = [4, 3, 2, 1, 1];
                break;
            case 90:
                thingsToBuy = [1, 2, 3, 2, 1];
                break;
            case 110:
                thingsToBuy = [3, 2, 2, 1, 1];
                break;
            case 130:
                thingsToBuy = [1, 3, 2, 1, 2];
                break;
            case 150:
                thingsToBuy = [2, 1, 1, 1, 1];
                break;
            case 170:
                thingsToBuy = [4, 1, 1, 1, 1];
                break;
            case 190:
                thingsToBuy = [3, 2, 4, 1, 3];
                break;
            case 210:
                thingsToBuy = [3, 4, 3, 4, 4];
                break;
            case 230:
                thingsToBuy = [2, 3, 2, 4, 2];
                break;
            case 250:
                thingsToBuy = [3, 2, 2, 3, 3];
                break;
            case 270:
                thingsToBuy = [4, 3, 3, 3, 4];
                break;
            case 290:
                thingsToBuy = [4, 4, 4, 4, 4];
                break;
            default:
                thingsToBuy = [];
        }
        if (thingsToBuy.length > 0) {
            buyMultipleUpgradesForRich(thingsToBuy);
        }
    }

    // Update rich kid's stats
    function updateRichKidStats() {
        addScoreForRich(rScoreRate);
        addGoldForRich(rGoldRate);
    }

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
        var randomNo = 999999;
        var currentDiff = score - rScore; // difference between poor and rich score
        var degreeOfDifference = Math.abs(currentDiff - idealDiff);

        if (currentDiff < idealDiff) { // User is lagging behind a lot, randomly trigger good events
            randomNo = (Math.random() * (goodRange - 1)) + 1;
            if (randomNo <= degreeOfDifference) {
                triggerAnyGoodEvent();
            }
        } else if (currentDiff > idealDiff) { // User is catching up too much, quick put him down! Muahaha
            randomNo = (Math.random() * (badRange - 1)) + 1;
            if (randomNo <= degreeOfDifference) {
                triggerAnyBadEvent();
            }
        }
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
        // update rich score and position
        document.getElementById("rich-race").title = round(rScore);
        var newPosition = calculateNewRacePosition(rScore);
        $("#rich-race").css({top: newPosition + "px"});
    }

    function updateRichKidDisplay() {
        document.querySelector('#rich-player-gold').textContent = rGold;
        document.querySelector('#rich-player-score').textContent = round(rScore);
        document.querySelector('#rich-player-rate').textContent = '+' + round(rScoreRate);
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

        // do rich kids actions
        updateRichKidPurchases();
        updateRichKidStats();
        updateRichKidDisplay();

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
            secondsPassed++;

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
        var clickScoreDOM = $("#clickscore");
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