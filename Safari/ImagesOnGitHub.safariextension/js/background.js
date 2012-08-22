// Checks if the page is an github page
// Checks if the page file's data is an image
var toolbarBtnIdentifier = "imgCmd";
var cmdBtn;

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
function onNewPage(url) {
  cmdBtn.disabled = true;

  if (url) {
    if(inGithub(url)) {
      if (isImage(url)) {
        cmdBtn.disabled = false;
      }
    }
  }
}

var popoverIdentifier = "imagePopver";

function commandListener(event) {
  // display the image
  if (event.command == "showImage") {
    imagePopover = cmdBtn.popover;

    if (imagePopover && imagePopover.visible == false) {
      cmdBtn.popover = null;
      safari.extension.removePopover(popoverIdentifier);
    }

    myPop = safari.extension.createPopover(popoverIdentifier,
      safari.extension.baseURI + "viewer.html", 300, 400);
    cmdBtn.popover = myPop;
    cmdBtn.showPopover();
  }
}

// events when page gots changed
function pageChangeListener(event) {
  var url = safari.application.activeBrowserWindow.activeTab.url;
  onNewPage(url);
}

// respond to message
function respondToMessage(theMessageEvent) {
    if(theMessageEvent.name === "testImageFile") {
      var url = theMessageEvent.message.href;
      onNewPage(url);
    }
}

function initToolbarButton() {
  var itemArray = safari.extension.toolbarItems;
  for (var i = 0; i < itemArray.length; ++i) {
    var item = itemArray[i];
    if (item.identifier == toolbarBtnIdentifier) {
      cmdBtn = item;
      break;
    }
  }
}

safari.application.addEventListener("message",respondToMessage,false);
safari.application.addEventListener("validate", pageChangeListener, false);
safari.application.addEventListener("command", commandListener, false);

initToolbarButton();
