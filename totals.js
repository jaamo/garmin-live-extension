let total = 0;

setInterval(() => {
    updateTotal();
}, 1000);

function updateTotal() {

    chrome.storage.local.get('distances', function(data) {

        try {
    
            let distances = JSON.parse(data.distances);
            console.log(distances);
    
            let newTotal = 0;
            for (let url in distances) {
                newTotal += distances[url];
            }
    
            document.querySelector('.total').innerHTML = newTotal;
    
        } catch(e) {
            console.log(e);
        }
    
    });
        
}

