let displayLabel;
let displayInitialized = false;

captureDistanceStrava();
captureDistanceGarmin();


/**
 * Capture distance on Strava. If distance doesn't found bail out.
 */
function captureDistanceStrava() {

    // Get distance element.
    var distanceElement = document.querySelectorAll('.activity-stats li:first-child strong');

    if (distanceElement.length == 0) {
        return;
    }

    // Get distance.
    var distance = parseFloat(distanceElement[0].innerHTML.replace(/<.*/, ''));

    saveDistance(distance);
    updateDistanceDisplay(distance);

    setTimeout(() => {
        captureDistanceStrava();
    });

}

/**
 * Capture distance on Garmin.
 */
function captureDistanceGarmin() {

    // Not in garmin page.
    if (window.location.href.indexOf('livetrack.garmin.com') == -1) {
        return false;
    }

    // Get distance element.
    var distanceElement = document.querySelectorAll('#statsPlaceholder dl:nth-child(3) dd');

    if (distanceElement.length != 0) {

        // Get distance.
        var distance = parseFloat(distanceElement[0].innerHTML.replace(/<.*/, ''));

        if (!isNaN(distance)) {

            saveDistance(distance);
            updateDistanceDisplay(distance);    
    
        }

    }

    setTimeout(() => {
        captureDistanceGarmin();
    });

}

/**
 * Save distace to local storage.
 */
function saveDistance(distance) {

    // Get all distances.
    chrome.storage.local.get('distances', function(data) {

        try {

            // Parse json.        
            var distances = JSON.parse(data.distances);

            // Set distance.
            distances[window.location.href] = distance;

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
 * Update distance display. Create display if it's not created yet.
 */
function updateDistanceDisplay(distance) {

    // Create if not exists.
    if (!displayInitialized) {
        createDistanceDisplay();
        displayInitialized = true;
    }

    displayLabel.innerHTML = 'Distance: ' + distance + ' km';    

}

/**
 * Create distance display.
 */
function createDistanceDisplay() {

    displayLabel = document.createElement('div');
    displayLabel.style.position = 'fixed';
    displayLabel.style.zIndex = '100000';
    displayLabel.style.right = '1rem';
    displayLabel.style.bottom = '0rem';
    displayLabel.style.background = 'black';
    displayLabel.style.color = 'white';
    displayLabel.style.padding = '1rem';
    displayLabel.style.fontFamily = 'arial';
    displayLabel.style.fontSize = '2rem';
    displayLabel.innerHTML = 'Distance: -';
    document.body.appendChild(displayLabel);

}



