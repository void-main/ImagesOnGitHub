// load the image data
// display it in the canvas element
function genApiPathFromHtmlPath(htmlPath) {
  var htmlPath = htmlPath.substr(19);
  var parts = htmlPath.split('/');
  var user = parts[0];
  var repo = parts[1];
  var filePath = parts.slice(4).join('/');

  // the github api path is composed in the format of:
  // https://api.github.com/repos/:user/:repo/contents/:path
  var apiPath = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + filePath;
  return apiPath;
}

function getResponse(data) {
  $('#the_img').attr('src', 'data:image/png;base64,' + data.content);
  $('#the_img').attr('width', '100%');
}

function displayImage(path) {
  safari.extension.globalPage.contentWindow.console.log(path);
  var targetUrl = genApiPathFromHtmlPath(path);

  $.ajax({
    url: targetUrl,
    success: function(data) {
      getResponse(data);
    }
  });
}

var url = safari.application.activeBrowserWindow.activeTab.url;displayImage(url);
