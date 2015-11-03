(function() {
    // Game variables
    var levelDuration = 300;
    var raceLineHeight = 530;
    var gameHasStarted = false;
    var secondsPassed = 0;
    var hasPromptedUserToWork = false;

    // * * * * * * * * * * * * * * * * * * *
    // Player
    // * * * * * * * * * * * * * * * * * * *

    // score
    var score = 0; // change every second
    var grade = 'F9'; // change every second
    var scoreRate = 0.0; // change on event
    // gold
    var gold = 0; // change every second
    var clickGoldRate = 1;
    // boost
    var currentBoost = null; // change every second, set on event
    var currentBoostDuration = 0; // change every second, set on event
    // upgrades
    var upgradeQuantities = [0, 0, 0, 0, 0]; // change on event
    // mode
    var mode = "studying";
    // stage in life
    var stageInLife = 0;
    // prompts
    var prompted = [false, false, false, false];

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
    // Preset Variables
    // * * * * * * * * * * * * * * * * * * *

    var upgradeNames = ['Stress Balloons', 'Stationery', 'Practice Papers', 'Guidebook', 'Tuition'];
    var upgradeCosts = [10, 15, 20, 25, 30];
    var upgradeRates = [5, 15, 25, 35, 50];

    var boostNames = ['Water', 'Wilo', 'Coffee', 'Black Bull', 'Chicken Tonic'];
    var boostCosts = [1, 3, 5, 7, 10];
    var boostRates = [2, 7, 12, 17, 25];
    var boostDurations = [5, 5, 5, 5, 5];

    var grades = ['F9', 'E8', 'D7', 'C6', 'C5', 'B4', 'B3', 'A2', 'A1'];
    var scoresForGrades = [0, 350000, 450000, 500000, 550000, 600000, 650000, 700000, 850000, 99999999];

    var occupations = ['Janitor', 'Secretary', 'Office Worker', 'Supervisor', 'Manager', 'Vice CEO'];
    var scoreForOccupations = [0, 250000, 500000, 750000, 900000, 1000000, 9999999999];

    var statuses = ["You are studying to improve your score.", "You are working to earn some gold."];

    // Good events: <Text> <Percentage to change> <Title>
    var goodEvents = [
      ["My siblings are sleeping over at my aunt's - I finally have the room to myself! ", 0.1, "Home Alone!"],
      ["My brother is away on a camping trip, I can finally concentrate! ", 0.07, "Peace and Quiet"],
      ["Dad is taking an off day today, so I don't have to help him at the store - more time to study! ", 0.05, "No Work Today!"],
      ["My parents finally replaced the spoilt fan - no more studying in the stuffy heat for me!", 0.04, "Beat the Heat"],
      ["My friend invites me to study at his air-conditioned, super huge room - yay!", 0.05, "Study Buddy"],
      ["My financial aid application got approved - I can work one less job!", 0.02, "Drop the job"],
      ["I play rock-paper-scissors with my siblings to see who'll be doing the chores for the week - I win! Hah!  ", 0.01, "Rock-paper-scissors"]
    ];

    // Bad events: <Text> <Type> <Percentage to change> <Title>
    var badEvents = [
      ["I got an A- for my last test, thanks to my 3 math tuition teachers.", 1, 0.05, "Private tuition"],
      ["My dad invited the CEO of POBC Bank over for dinner - he offered me an internship! ", 1, 0.04, "Bank Internship"],
      ["Went to study abroad in the UK and learnt a lot from the experience!", 1, 0.03, "Exchange program"],
      ["My dad's company gave him 2 Macbook Pros. He said I could have one!", 1, 0.02, "Company laptop"],
      ["I was awarded a prestigious scholarship from my dad's company. All thanks to my hard work!", 1, 0.01, "Company Scholarship"],
      ["My dad sprained his leg - it's time for me to help out at his store.", 2, 0.05, "Mini Helper"],
      ["I'm down with the flu, but I really can't afford to visit the clinic - there goes my exam tomorrow.", 2, 0.04, "Flu Bug"],
      ["My parents are away to visit my grandma in the hospital - gotta prepare meals for my younger siblings.", 2, 0.03, "Home Away"],
      ["My boss just called me to take over someone's shift - I have a test tomorrow, but I really need the money...", 2, 0.02, "Money or Not?"],
      ["My parents have been arguing non-stop...I can't concentrate at all.", 2, 0.01, "Financial Woes"]
    ]; // 1 = add to rich, 2 = deduct from poor

    // Maximum Variables
    var maxGold = 900;
    var maxScore = 1000000;
    var maxScoreRate = 90000;
    var maxUpgradePurchases = 99;

    // Game Random Event Balancing variables
    var idealDiff = -50000; // further decrease this to increase difficulty
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

    function between(x, min, max) {
        return x >= min && x < max;
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

            // update display
            $("#clickscore").attr('title', 'Study for +' + scoreRate +  ' score');
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
        if ((gameHasStarted) && (mode == "studying")) {
            score += value;
            if (score > maxScore) {
                score = maxScore;
            }
        }
        updateDisplay();
    }

    function addScoreFromEvent(value) {
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
            ion.sound.play("coin");
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

        // update display
        $(String('#boost-' + boostNumber)).find(".item-active-boost").html(boostDurations[boostNumber] + ' s left');
        updateDisplay();

        // play sound
        ion.sound.play("water");
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
        updateDisplay();
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Buy functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function increaseUpgradeCost(itemNumber) {
        upgradeCosts[itemNumber]++;

        // update DOM
        var upgradeDOM = String('#upgrade-' + itemNumber);
        $(upgradeDOM).find(".item-cost").html(upgradeCosts[itemNumber]);
    }

    function buyUpgrade(itemNumber) {
        // if the player has enough gold
        if ((gold >= upgradeCosts[itemNumber]) && (upgradeQuantities[itemNumber] < maxUpgradePurchases)) {
            // buy the upgrade increase the quantity
            addUpgrade(itemNumber);
            // deduct gold
            deductGold(upgradeCosts[itemNumber]);
            // apply the effect of the upgrade (increase the rate)
            addScoreRate(upgradeRates[itemNumber]);
            // increase the cost
            increaseUpgradeCost(itemNumber);
        }
    }

    function buyBoost(itemNumber) {
        // if the player has enough gold
        if ((gold >= boostCosts[itemNumber]) && (currentBoostDuration == 0)) {
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
        ion.sound.play("richbuy");
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Random event functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    function displayEvent(kid, text, change, score, title) {
        var displayDOM;
        if (kid == "poorkid") {
            displayDOM = $('#poor-event');
        } else if (kid == "richkid") {
            displayDOM = $('#rich-event');
        } else {
            console.log("Displaying invalid kids event");
        }
        var textDOM = displayDOM.find(".event-text");
        var titleDOM = displayDOM.find(".event-title");
        var pointsDOM = displayDOM.find(".event-points");

        // set color of points DOM
        if (change == "+") {
            pointsDOM.addClass("add");
            pointsDOM.removeClass("minus");
        } else if (change == "-") {
            pointsDOM.addClass("minus");
            pointsDOM.removeClass("add");
        }

        // set html
        textDOM.html(text);
        titleDOM.html(title);
        if (score > 0) {
            pointsDOM.html(" " + change + score + " points");
        }

        displayDOM.fadeIn('fast').delay(4000).fadeOut('fast');
    }

    function triggerAnyGoodEvent() {
        var eventNumberToTrigger = Math.floor(Math.random() * goodEvents.length);
        var scoreToAdd = Math.floor(score * goodEvents[eventNumberToTrigger][1]);
        if (scoreToAdd > 0) {
            addScoreFromEvent(scoreToAdd);
            displayEvent("poorkid", goodEvents[eventNumberToTrigger][0], "+", scoreToAdd, goodEvents[eventNumberToTrigger][2]);
        }
    }

    function triggerAnyBadEvent() {
        if (score > (maxScore / 100)) {
            var eventNumberToTrigger = Math.floor(Math.random() * badEvents.length);
            var eventType = badEvents[eventNumberToTrigger][1];
            var eventText = badEvents[eventNumberToTrigger][0];
            var scoreToChange = 0;

            switch (eventType) {
                case 1: // event is to add score to the rich kid
                    scoreToChange = Math.floor(rScore * badEvents[eventNumberToTrigger][2]);
                    addScoreForRich(scoreToChange);
                    displayEvent("richkid", eventText, "+", scoreToChange, badEvents[eventNumberToTrigger][3]);
                    break;
                case 2: // event is to deduct score from poor kid
                    scoreToChange = Math.floor(score * badEvents[eventNumberToTrigger][2]);
                    deductScore(scoreToChange);
                    displayEvent("poorkid", eventText, "-", scoreToChange, badEvents[eventNumberToTrigger][3]);
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
    function fadeEnvironmentDisplay(workOrStudy) {
        var image = "";
        var sprite = "";
        if ((workOrStudy == "work") && (mode == "studying")) {
            image = "img/envpoor2.png";
            sprite = "img/sprites/poor" + stageInLife + "w.png";
        } else if ((workOrStudy == "study") && (mode == "working")) {
            image = "img/envpoor.png";
            sprite = "img/sprites/poor" + stageInLife + ".gif";
        }

        if (image == "" || sprite == "") {
            // do nothing
        } else {
            $('.poor').css('background-image', 'url(' + image + ')');
            $('.poor').find('.sprite').html('<img src="' + sprite + '">');
        }
    }

    function clickGoldChangeDisplay() {
        $("#clickgold").removeClass("unclickable");
        $("#clickscore").addClass("unclickable");
        $("#status").text(statuses[1]);
        fadeEnvironmentDisplay("work");
        ion.sound.play("work");
    }

    function clickScoreChangeDisplay() {
        // activate study and deactivate work
        $("#clickscore").removeClass("unclickable");
        $("#clickgold").addClass("unclickable");
        $("#status").text(statuses[0]);
        fadeEnvironmentDisplay("study");
    }

    function clickGold() {
        if (gameHasStarted) {
                if ((gold == 0) && (!prompted[2])) {
                    $('#prompt1').hide();
                    $('#prompt2').show();
                    prompted[2] = true;
                }

                clickGoldChangeDisplay();
                mode = "working";
                // activate work and deactivate study
                addGold(clickGoldRate);
        }
    }

    function clickScore() {
        if (gameHasStarted) {
            if (score == 0) {
                $('#prompt3').hide();
            }
            if (scoreRate == 0 && !hasPromptedUserToWork) {
                // inform the user they need to earn gold to buy upgrades
                hasPromptedUserToWork = true;
                displayEvent("poorkid", "I need to work to earn gold, in order to buy upgrades and boosts for my score rate.", "", 0, "Can't study :(")
            } else {
                clickScoreChangeDisplay();
                mode = "studying";
                addScore(scoreRate);
            }
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Update functions
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    // Buy stuff for rich kid at particular times
    function updateRichKidPurchases() {
        var thingsToBuy = [];
        switch(secondsPassed) {
            case 5:
                thingsToBuy = [4, 2, 3, 3, 1, 1, 3];
                break;
            case 15:
                thingsToBuy = [3, 3, 3, 4, 3, 4, 4];
                break;
            case 25:
                thingsToBuy = [2, 3, 4, 3, 4, 4];
                break;
            case 35:
                thingsToBuy = [4, 3, 3, 4, 4, 3];
                break;
            case 45:
                thingsToBuy = [3, 2, 3, 4, 4, 3];
                break;
            case 55:
                thingsToBuy = [3, 3, 3, 4, 4, 4];
                break;
            case 65:
                thingsToBuy = [3, 3, 2, 2, 3, 4];
                break;
            case 75:
                thingsToBuy = [2, 3, 2, 3, 4, 3];
                break;
            case 85:
                thingsToBuy = [4, 3, 3, 3, 4, 4];
                break;
            case 95:
                thingsToBuy = [3, 4, 3, 4, 3, 4];
                break;
            case 105:
                thingsToBuy = [2, 2, 3, 2, 4, 4];
                break;
            case 115:
                thingsToBuy = [2, 4, 2, 2, 4, 3];
                break;
            case 125:
                thingsToBuy = [3, 2, 2, 3, 3, 4];
                break;
            case 135:
                thingsToBuy = [4, 3, 3, 2, 4, 4];
                break;
            case 145:
                thingsToBuy = [3, 2, 4, 1, 4, 3];
                break;
            case 155:
                thingsToBuy = [3, 4, 3, 4, 4, 4];
                break;
            case 165:
                thingsToBuy = [3, 2, 2, 4, 3, 4];
                break;
            case 175:
                thingsToBuy = [2, 2, 2, 2, 3];
                break;
            case 185:
                thingsToBuy = [3, 3, 2, 1, 4];
                break;
            case 195:
                thingsToBuy = [4, 3, 3, 2, 4];
                break;
            case 215:
                thingsToBuy = [4, 3, 3, 4, 4];
                break;
            case 225:
                thingsToBuy = [4, 4, 4, 4, 4];
                break;
            case 235:
                thingsToBuy = [4, 4, 4, 4, 4];
                break;
            case 235:
                thingsToBuy = [4, 4, 4, 4, 4];
                break;
            case 235:
                thingsToBuy = [4, 4, 4, 4, 4];
                break;
            case 235:
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
                $(upgradeDOM).find(".item-active-boost").html((currentBoostDuration - 1) + ' s left');
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
        if (currentBoostDuration == 0) {
            for (var i = 0; i < boostNames.length; i++) {
                if ((gold >= boostCosts[i])) {
                    $("#boost-" + i).removeClass("unbuyable");
                } else {
                    $("#boost-" + i).addClass("unbuyable");
                }
            }
        } else {
            for (var i = 0; i < boostNames.length; i++) {
                $("#boost-" + i).addClass("unbuyable");
            }
        }

    }

    function updateStatsDisplay() {

        if (mode == "working") {
            $('.gold-stat-circle').removeClass("disabled-stat");
            $('.score-stat-circle').addClass("disabled-stat");
        } else if (mode == "studying") {
            $('.gold-stat-circle').addClass("disabled-stat");
            $('.score-stat-circle').removeClass("disabled-stat");
        }

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
        if (gameHasStarted) {
            // countdown boost
            updateBoost();

            // trigger random event if any
            updateRandomEvent();

            // do rich kids actions
            updateRichKidPurchases();
            updateRichKidStats();
            updateRichKidDisplay();

            // displays
            updateDisplay();
            updateStatsDisplay();
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Timed Events
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function changeCharacterSprites(version) {
        poorSpriteDOM = $("#poor-sprite");
        richSpriteDOM = $("#rich-sprite");

        switch (version) {
            case 1:
                stageInLife = 1;
                richSpriteDOM.html('<img src="img/sprites/rich2.gif">');
                if (mode == "studying") {
                    poorSpriteDOM.html('<img src="img/sprites/poor' + stageInLife + '.gif">');
                } else if (mode == "working") {
                    poorSpriteDOM.html('<img src="img/sprites/poor' + stageInLife + 'w.png">');
                }
                break;
            case 2:
                stageInLife = 2;
                richSpriteDOM.html('<img src="img/sprites/rich3.gif">');
                if (mode == "studying") {
                    poorSpriteDOM.html('<img src="img/sprites/poor' + stageInLife + '.gif">');
                } else if (mode == "working") {
                    poorSpriteDOM.html('<img src="img/sprites/poor' + stageInLife + 'w.png">');
                }
                break;
            default:
                break;
        }
    }

    function updateTimedEvents(diff) {
        if (diff < 10) { // red if running out of time
            $('.time-screen').addClass('last-ten-seconds');
        } else if (diff == 10) { // play clock sound at the last 10th second
            ion.sound.play("clocl");
        } else if (diff == 200) {
            changeCharacterSprites(1);
        } else if (diff == 100) {
            changeCharacterSprites(2);
        }
    }


    // * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // End game
    // * * * * * * * * * * * * * * * * * * * * * * * * * * *

    function stopSound() {
        ion.sound.destroy("hyperfun");
        ion.sound.destroy("clocl");
        ion.sound.play("Gong-sound");
    }

    function determineGrade(marks) {
        for (var i = 0; i < scoresForGrades.length-1; i++) {
            if (between(marks, scoresForGrades[0], scoresForGrades[i+1])) {
                return grades[i];
            }
        }
    }
    function determineOccupation(marks) {
        for (var i = 0; i < scoreForOccupations.length-1; i++) {
            if (between(marks, scoreForOccupations[0], scoreForOccupations[i+1])) {
                return occupations[i];
            }
        }
    }

    function showEndGame() {
        stopSound();

        $('.poor').fadeOut("slow");
        $('.rich').fadeOut("slow");
        $('.race-line-container').fadeOut("slow");
        $('#time').fadeOut("slow");
        $('#items-container').hide();

        var htmlPoor = '<div class="end-title">Final score:</div> ' + score + ' <div class="end-title">Final grade:</div> ' + determineGrade(score) + '<div class="end-title">Occupation:</div> ' + determineOccupation(score);
        var htmlRich = '<div class="end-title">Final score:</div> ' + rScore + ' <div class="end-title">Final grade:</div> ' + determineGrade(rScore) + ' <div class="end-title">Occupation:</div> CEO';
        var poorSprite = "img/sprites/end/" + determineOccupation(score) + ".png";
        var richSprite = "img/sprites/end/CEO.png";

        $('.poor-end').html(htmlPoor);
        $('.rich-end').html(htmlRich);
        $('#poor-final-sprite').html('<img src="' + poorSprite + '">');
        $('#rich-final-sprite').html('<img src="' + richSprite + '">');

        $('.final-sprite').delay(500).fadeIn("slow");
        $('.the-end').delay(500).fadeIn("slow");
        $('.restart-link-container').delay(500).fadeIn("slow");

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
            if (gameHasStarted) {
                // get the number of seconds that have elapsed since
                // startTimer() was called
                diff = duration - (((Date.now() - start) / 1000) | 0);
                secondsPassed++;

                // stop the game
                if (secondsPassed > levelDuration) {
                    gameHasStarted = false;
                    showEndGame();
                }

                // does the same job as parseInt truncates the float
                minutes = (diff / 60) | 0;
                seconds = (diff % 60) | 0;

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                update();
                updateTimedEvents(diff);

                if (diff <= 0) {
                    // add one second so that the count down starts at the full duration
                    // example 05:00 not 04:59
                    start = Date.now() + 1000;
                    $('.time-screen').removeClass('last-ten-seconds');
                }
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
            html += '<div class="item-cell unbuyable" title="+' + upgradeRates[i] + ' score per click" id="upgrade-' + i + '">';
            html += '<div class="item-img"><img src="img\/u' + upgradeNumber + '.png"><\/div>';
            html += '<div class="item-name">' + upgradeNames[i] + '<\/div>';
            html += '<div class="item-qty">Qty: ' + upgradeQuantities[i] + '<\/div>';
            html += '<img src="img\/coins.png" class="item-coin"><div class="item-cost">' + upgradeCosts[i] + '<\/div>';
            html += '<\/div>';
        }
        // boosts
        for (var i = 0; i < upgradeNames.length; i++) {
            var boostNumber = i + 1;
            html += '<div class="item-cell unbuyable" title="+' + boostRates[i] + ' score per click for ' + boostDurations[i] +  ' seconds" id="boost-' + i + '">';
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
        clickScoreDOM.attr('title', 'Study for +' + scoreRate +  ' score');
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

    function initializeSounds() {
        // Sounds preloading
        $(document).ready(function() {

            ion.sound({
                sounds: [
                    {
                        name: "richbuy"
                    },
                    {
                        name: "work"
                    },
                    {
                        name: "bgm",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        name: "hyperfun",
                        volume: 0.8,
                        loop: true
                    },
                    {
                        name: "water"
                    },
                    {
                        name: "clocl",
                        loop: true,
                        volume: 1.0
                    },
                    {
                        name: "coin"
                    },
                    {
                        name: "Gong-sound",
                        volume: 1.0
                    }
                ],
                volume: 0.9,
                path: "sounds/",
                preload: true
            });
        });
    }

    function startGame() {
        if ((!gameHasStarted) && (!Shepherd.activeTour)) {
            gameHasStarted = true;
            $('.player-screen').removeClass("grey");
            if (!prompted[1]) {
                $("#prompt1").show();
                prompted[1] = true;
            }

            // DOM
            var timeDisplay = document.querySelector('#time');
            startTimer(levelDuration, timeDisplay);

            // BGM
            ion.sound.play("hyperfun");
        }
    }


    window.onload = function () {

        // Initialization
        populateUpgradesAndBoosts();
        initializeClickables();
        initializeSounds();

        // Start game when click 'Start'
        $('#time').click(function() {
            startGame();
        });

        // Fire events when an item is clicked
        // To buy an item
        $('.item-cell').bind('click', function() {
            var itemID = String($(this).attr('id'));
            var itemNumber = itemID.charAt(itemID.length-1);

            // prompt user to study after buying things
            if ((gold > 0) && (!prompted[3]) && (gameHasStarted)) {
                $('#prompt2').hide();
                $('#prompt3').show();
                prompted[3] = true;
            }

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