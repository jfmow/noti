/**
 * 
 * The whole purpose of this function is to detect if the device went to sleep because if it did
 * then the js will stop until it turns on again.
 * 
 * I have this because I want to block page updates, fetch the data from the db and render 
 * everything again because stuff could have changed from another device and we could be editing old data.
 * 
 * This is the code which allows for detection of this event:
 
    var myWorker = new Worker("/workers/DetectWakeup.js");
    myWorker.onmessage = function (ev) {
        if (ev && ev.data === 'wakeup') {
            // wakeup function here
        }
    }

 */

var lastTime = (new Date()).getTime();
var checkInterval = 3000;

setInterval(function () {
    var currentTime = (new Date()).getTime();
    //console.log("Check", lastTime, currentTime, (lastTime + checkInterval * 2))

    if (currentTime > (lastTime + checkInterval * 2)) {  // ignore small delays
        postMessage("wakeup");
    }

    lastTime = currentTime;
}, checkInterval);