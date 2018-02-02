function openTotalsPage(tab) {
	chrome.tabs.create({ url: "totals.html" });
}
  
chrome.browserAction.onClicked.addListener(openTotalsPage);