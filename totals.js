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

    if (timeLeft > 0) {
        document.querySelector('.js-time').innerHTML = parseMillisecondsIntoReadableTime(elapsedTime);
        document.querySelector('.js-time-left').innerHTML = parseMillisecondsIntoReadableTime(timeLeft);
    } else {
        document.querySelector('.js-time').innerHTML = '24:00:00';
        document.querySelector('.js-time-left').innerHTML = '00:00:00';
    }
    

}

function parseMillisecondsIntoReadableTime(milliseconds) {

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


function updateSettingsModal() {

    document.querySelector('.settings-dialog__tracker').innerHTML = '';

    chrome.storage.local.get('distances', function(data) {

        try {
    
            let distances = JSON.parse(data.distances);
    
            for (let url in distances) {
                // newTotal += distances[url];

                document.querySelector('.settings-dialog__tracker').innerHTML += 
                    '<dd class="settings-dialog__tracker__url">'+url+'</dd>\
                     <dt class="settings-dialog__tracker__distance">'+distances[url]+' km</dt>';

            }        
    
        } catch(e) {
            console.log(e);
        }
    
    });    

}

function saveBaseDistance() {

    var baseDistance = document.querySelector('.settings-dialog__base-distance').value;
    saveDistance('base', parseInt(baseDistance));
    setTimeout(function() {
        updateSettingsModal();
    }, 100);

}
  
/**
 * Save distace to local storage.
 */
function saveDistance(url, distance) {

    // Get all distances.
    chrome.storage.local.get('distances', function(data) {

        try {

            // Parse json.        
            var distances = JSON.parse(data.distances);

            // Set distance.
            distances[url] = distance;

            // Save.
            // console.log('Saved!')
            chrome.storage.local.set({'distances': JSON.stringify(distances)});
            
            
        } catch(e) {

            // console.log('Save failed!', e);
            chrome.storage.local.set({'distances': JSON.stringify({})});
            
        }

    });
        
}


/**
 * Reset.
 */
document.onkeydown = function(evt) {
    
    if (evt.key == "Escape" && confirm('Haluatko nollata kilometrit?')) {
        chrome.storage.local.set({'distances': JSON.stringify({})});    
        updateSettingsModal();    
    }

    // const keyNumber = parseInt(evt.key);
    // if (!isNaN(keyNumber) && keyNumber >= 0 && keyNumber <= 10) {
    //     chrome.storage.local.set({'distances': JSON.stringify({'lol': ultimateTotal * (keyNumber / 10)})});
    // }

};

// Toggle settings dialog on/off.
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.settings-button').addEventListener('click', function() {
        document.querySelector('.settings-dialog').classList.toggle('settings-dialog--visible');
        updateSettingsModal();
    });
    document.querySelector('.settings-dialog__save').addEventListener('click', function() {
        saveBaseDistance();
    });
});

