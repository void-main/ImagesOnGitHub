var oldSize = 0;

//Github uses window.history api for url change
//Since I can not detect that, all I can do is to record the stack size change
function detectStackSizeChange() {
  var curSize = window.history.length;
  if (oldSize != curSize) {
    oldSize = curSize;
    safari.self.tab.dispatchMessage("testImageFile", window.location);
  };
}

setInterval(detectStackSizeChange, 500);
