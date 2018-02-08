function openTotalsPage(tab) {
	chrome.tabs.create({ url: "totals.html?date=2018-2-8" });
}
  
chrome.browserAction.onClicked.addListener(openTotalsPage);