var irc = require('irc');
var client = new irc.Client('irc.mozilla.org', 'carly_rae_jenkins', {
    channels: ['#amo', '#breakpad'],
});

function contains(message, list) {
    for(var i=0;i<list.length;i++) {
        var l = list[i];
        if(message.indexOf(l) > -1)
            return true;
    }
}

var jenkins = "jenkins";
var waiting = false;

client.addListener('message', function(from, to, message) {
    if(from != jenkins)
        return;

    if(contains(message, [": FAILURE in", ": UNSTABLE in"])) {
        waiting = true;
        setTimeout(function() {
            waiting = false;
        }, 5000);
    } else if(waiting) {
        var pos = 0;
        if((pos = message.indexOf(": ")) == -1)
            return;

        var victim = message.substring(2, pos);
        client.say(to, "The build is broken");
        client.say(to, "And this is crazy");
        client.say(to, "but " + victim + " broke it");
        client.say(to, "so fix it maybe");
        waiting = false;
    }

});
