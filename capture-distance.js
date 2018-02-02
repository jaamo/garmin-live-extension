var distanceElement = document.querySelectorAll('.activity-stats li:first-child strong');

if (distanceElement.length > 0) {

    setInterval(() => {
        updateDistance();
    }, 1000);

}

function updateDistance() {

    // Get distance.
    var distance = parseFloat(distanceElement[0].innerHTML.replace(/<.*/, ''));

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



