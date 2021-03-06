// load the image data
// display it in the canvas element
function genApiPathFromHtmlPath(htmlPath) {
  var htmlPath = htmlPath.substr(19);
  var parts = htmlPath.split('/');
  var user = parts[0];
  var repo = parts[1];
  var branch = parts[3];
  var filePath = parts.slice(4).join('/');

  // the github api path is composed in the format of:
  // https://api.github.com/repos/:user/:repo/contents/:path?ref=:branch
  var apiPath = "https://api.github.com/repos/"
    + user + "/" + repo + "/contents/" + filePath + "?ref=" + branch;
  return apiPath;
}

function getResponse(data) {
  $('#the_img').attr('src', 'data:image/png;base64,' + data.content);
  $('#the_img').attr('width', '100%');
}

function displayImage(path) {
  var targetUrl = genApiPathFromHtmlPath(path);

  $.ajax({
    url: targetUrl,
    success: function(data) {
      getResponse(data);
    },
    error: function(error) {
      safari.extension.globalPage.contentWindow.console.log(error);
    }
  });
}

var url = safari.application.activeBrowserWindow.activeTab.url;
displayImage(url);
