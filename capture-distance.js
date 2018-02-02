var distanceElement = document.querySelectorAll('.activity-stats li:first-child strong');

if (distanceElement) {

    // Get distance.
    var distance = parseFloat(distanceElement[0].innerHTML.replace(/<.*/, ''));

    // Get all distances.
    chrome.storage.sync.get('distances', function(data) {

        try {

            // Parse json.        
            var distances = JSON.parse(data);

            // Set distance.
            distances[window.location.href] = distance;

            // Save.
            chrome.storage.sync.set({'distances': JSON.stringify(distances)});
            
            
        } catch(e) {

            chrome.storage.sync.set({'distances': JSON.stringify({})});    
            
        }

    });
    
}



