// Checks if the page is an github page
// Checks if the page file's data is an image


function inGithub(url) {
  return url.indexOf('https://github.com') == 0;
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
// TODO: why the heck is the item button be so slow?
function onNewPage(event) {
  event.target.disabled = true;

  var url = safari.application.activeBrowserWindow.activeTab.url;
  if (url) {
    if(inGithub(url)) {
      if (isImage(url)) {
        event.target.disabled = false;
      }
    }
  }
}

var popoverIdentifier = "imagePopver";

function commandListener(event) {
  // display the image
  if (event.command == "showImage") {
    showBtnItem = event.target;
    imagePopover = showBtnItem.popover;

    if (imagePopover && imagePopover.visible == false) {
      showBtnItem.popover = null;
      safari.extension.removePopover(popoverIdentifier);
    }

    myPop = safari.extension.createPopover(popoverIdentifier,
      safari.extension.baseURI + "viewer.html", 300, 400);
    showBtnItem.popover = myPop;
    showBtnItem.showPopover();
  }
}

// events when page gots changed
function pageChangeListener(event) {
  onNewPage(event);
}

safari.application.addEventListener("navigate", pageChangeListener, false);
safari.application.addEventListener("validate", pageChangeListener, false);
safari.application.addEventListener("command", commandListener, false);
