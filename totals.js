let total = 0;
const ultimateTotal = 1400;
setInterval(() => {
    updateTotal();
    updateClock();
}, 1000);

function updateTotal() {

    chrome.storage.local.get('distances', function(data) {

        try {
    
            let distances = JSON.parse(data.distances);
            // console.log(distances);
    
            let newTotal = 0;
            for (let url in distances) {
                newTotal += distances[url];
            }
    
            document.querySelector('.js-distance').innerHTML = newTotal.toFixed();
            document.querySelector('.js-distance-left').innerHTML = (ultimateTotal - newTotal).toFixed();

            // Mask. 13vh - 20vh & 54vh - 84vh.
            // Some fuzziness here since the route is in two pieces. Don't even try to understand.
            const line1Start = 8;
            const line1End = 19;
            const line2Start = 55;
            const line2End = 82;
            const progress = newTotal / ultimateTotal;
            const totalVH = (line2End - line2Start) + (line1End - line1Start);
            let progressVH = line1Start + progress * totalVH;
            if (progressVH > line1End) {
                progressVH += line2Start - line1End;
            }
            document.querySelector('.map-route-mask').style.height = progressVH + 'vh';
            
    
        } catch(e) {
            console.log(e);
        }
    
    });
        
}

function updateClock() {

    const timeParts = window.location.toString().replace(/.*date=/, '').split('-');

    const startTime = new Date(timeParts[0], timeParts[1] - 1, timeParts[2], 12, 0, 0);
    const currentTime = new Date();

    const elapsedTime = currentTime.getTime() - startTime.getTime();
    const timeLeft = 24 * 3600 * 1000 - elapsedTime;

    document.querySelector('.js-time').innerHTML = parseMillisecondsIntoReadableTime(elapsedTime);
    document.querySelector('.js-time-left').innerHTML = parseMillisecondsIntoReadableTime(timeLeft);
    

}

function parseMillisecondsIntoReadableTime(milliseconds){

    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + ':' + m + ':' + s;
  }
  

document.onkeydown = function(evt) {
    
    if (evt.key == "Escape") {
        chrome.storage.local.set({'distances': JSON.stringify({})});        
    }

    const keyNumber = parseInt(evt.key);
    if (!isNaN(keyNumber) && keyNumber >= 0 && keyNumber <= 10) {
        chrome.storage.local.set({'distances': JSON.stringify({'lol': ultimateTotal * (keyNumber / 10)})});
    }

};
