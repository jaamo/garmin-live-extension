var distanceElement = document.querySelectorAll('.activity-stats li:first-child strong');
var displayLabel;

if (distanceElement.length > 0) {

    createDistanceDisplay();

    setInterval(() => {
        updateDistance();
    }, 1000);

}

function updateDistance() {

    // Get distance.
    var distance = parseFloat(distanceElement[0].innerHTML.replace(/<.*/, ''));

    updateDistanceDisplay(distance);
    console.log(distance);

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

function updateDistanceDisplay(distance) {
    displayLabel.innerHTML = 'Distance: ' + distance + ' km';    
}

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



