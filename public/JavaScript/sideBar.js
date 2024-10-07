// used this link for sidebar https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp
// -prob a better way to do this
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "270px";
  document.getElementById("main").style.marginLeft = "300px";
  document.getElementById("header").style.marginLeft = "300px";
  document.getElementById("mySidebar").style.visibility = "visible";   
  document.getElementById("openbtn").style.visibility = "hidden"; 
  document.getElementById("mytextarea").style.width = "calc(100vw - 445px)";  
  document.getElementById("txtSend").style.width = "calc(100vw - 545px)";
  
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "30px";
  document.getElementById("header").style.marginLeft = "30px";
  document.getElementById("mySidebar").style.visibility = "hidden";   
  document.getElementById("openbtn").style.visibility = "visible";   
  document.getElementById("mytextarea").style.width = "calc(100vw - 175px)";
  document.getElementById("txtSend").style.width = "calc(100vw - 275px)";
  document.getElementById("signOutBtn").style.margin = "0";
} 