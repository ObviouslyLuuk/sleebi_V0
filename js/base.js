
// Load video_basics.json
var videos_info;
let video_basics_request = new XMLHttpRequest();
video_basics_request.open('GET', 'data/video_basics.json');
video_basics_request.onload = function() {
    if (video_basics_request.status >= 200 && video_basics_request.status < 400) {
        // Success!
        videos_info = JSON.parse(video_basics_request.responseText);

        // Fire event
        window.dispatchEvent(new Event('videos_info_loaded'));
    } else {
        // We reached our target server, but it returned an error
        console.log("Error loading video_basics.json");
    }
};
video_basics_request.onerror = function() {
    // There was a connection error of some sort
    console.log("Error loading video_basics.json");
};
video_basics_request.send();

// Get params from URL
const URLPARAMS = new URLSearchParams(window.location.search);
const PATHNAME = window.location.pathname.split("/").splice(1);

switch (PATHNAME[0]) {
    case "":
        if (URLPARAMS.get('v')) {
            // Append js/watch.js to the body
            let script = document.createElement('script');
            script.src = 'js/watch.js';
            document.body.appendChild(script);
        } else {
            // Append js/home.js to the body
            let script = document.createElement('script');
            script.src = 'js/home.js';
            document.body.appendChild(script);
        }
        break;
    case "channel":
        console.log("channel page not yet implemented");
        break;
    case "results":
        console.log("results page not yet implemented");
        break;
    default:
        console.log("error page not yet implemented");
        break;
}