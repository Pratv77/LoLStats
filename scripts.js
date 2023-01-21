function redirect() {
  // Get the value of the input box
  var input = document.getElementById("input").value;

  // Construct the URL with the input value as a query parameter
  var url = "./index2.html" + input;

  // Redirect to the URL
  window.location.href = url;
}
