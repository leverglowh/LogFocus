chrome.runtime.onInstalled.addListener(() => {
  console.log('init')
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

function toggleFocusLog (isOn) {
  if (isOn) {
    console.log('logging focused elements started')
    window.logFocusFunc = window.logFocusFunc || function (e) {
      console.log('focused: ', document.activeElement);
    };
    document.addEventListener('focus', window.logFocusFunc, true);
  } else {
    console.log('logging focused elements stopped')
    document.removeEventListener('focus', window.logFocusFunc, true);
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    console.log('on');
    chrome.scripting.executeScript({
      target : {tabId : tab.id},
      func : toggleFocusLog,
      args : [ true ],
    });
  } else if (nextState === "OFF") {
    console.log('off');
    chrome.scripting.executeScript({
      target : {tabId : tab.id},
      func : toggleFocusLog,
      args : [ false ],
    });
  }
});