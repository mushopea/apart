/**
 * Created by musho on 19/10/2015.
 */
(function() {
    var init, setupShepherd;

    init = function() {
        return setupShepherd();
    };

    setupShepherd = function() {
        var shepherd;
        shepherd = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
                showCancelLink: true
            }
        });
        shepherd.addStep('1', {
            title: 'Despairity',
            text: ['Show the world you don’t have to be rich to succeed. Your classmate Richard has it easy, but you know that your hard work will pay off.', '<B>Gain as much study points (score) as you can and advance to the top before Richard does!</B>'],
            //attachTo: '#time',
            classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
            buttons: [
                {
                    text: 'Skip',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.cancel
                }, {
                    text: 'Next',
                    action: shepherd.next,
                    classes: 'shepherd-button-example-primary'
                }
            ]
        });
        shepherd.addStep('2', {
            title: 'Study',
            text: 'Click here to study and generate score points.',
            attachTo: '#clickscore',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: shepherd.next
                }
            ]
        });
        shepherd.addStep('3', {
            title: 'Work',
            text: 'Click here to work and generate gold to purchase the upgrades and boosts.',
            attachTo: '#clickgold',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: shepherd.next
                }
            ]
        });
        shepherd.addStep('4', {
            title: 'Upgrades',
            text: 'Upgrades to increase your score per click permanently, helping you generate study points at a faster rate!',
            attachTo: '#upgrade-4 right',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: shepherd.next
                }
            ]
        });
        shepherd.addStep('5', {
            title: 'Boosts',
            text: 'Boosts increase your score per click for a temporary period of time. Only one boost can be used at a time.',
            attachTo: '#boost-0 left',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: shepherd.next
                }
            ]
        });

        shepherd.addStep('end', {
            title: 'Ready?',
            text: 'Press Start. You have 5 minutes! Life is short.',
            attachTo: '#time bottom',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Done',
                    action: shepherd.next
                }
            ]
        });
        return shepherd.start();
    };

    $(init);

}).call(this);
