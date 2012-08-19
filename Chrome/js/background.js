// Checks if the page is an github page
// Checks if the page file's data is an image

function inGithub(tab) {
  return tab.url.indexOf('https://github.com') == 0;
}

// global variable that records the current page url
// The viewer.js will display the image according to this variable
var currentUrl = "";

function updateIcon(id, tab) {
  var popupPath = "";
  chrome.pageAction.setTitle({ tabId:id, title:'Testing if the file is an image...' });
  chrome.pageAction.setIcon({ tabId:id, path:'icons/icon_has_no_image.png' });

  var targetUrl = tab.url;
  if(isImage(targetUrl)) {
    popupPath = "viewer.html";
    chrome.tabs.getSelected(null,function(tab){
      currentUrl = targetUrl;
    });

    chrome.pageAction.setTitle({ tabId:id, title:'Click to view the image' });
    chrome.pageAction.setIcon({ tabId:id, path:'icons/icon_has_image.png' });
    chrome.pageAction.setPopup({ tabId:id, popup:popupPath });
  }
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var possibleImageFileType = ['png', ]

// TODO: judge the file type according to base64?
function isImage(path) {
  var isImage = false;
  path = path.toLowerCase();
  for (var imgType in possibleImageFileType) {
    if (path.endsWith(possibleImageFileType[imgType])) {
      isImage = true;
      break;
    }
  }
  return isImage;
}

// the main listener
// it dispatches the tab content to inGithub and isImageFile methods
function onNewPage(tabId, data, tab) {
  if(inGithub(tab)) {
    chrome.pageAction.show(tabId);

    // is it an image file?
    updateIcon(tabId, tab);
  } else {
    chrome.pageAction.hide(tabId);
  }
}

chrome.tabs.onUpdated.addListener(onNewPage);
