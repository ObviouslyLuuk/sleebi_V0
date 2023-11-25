
// Uploaded videos
VIDEO_IDS = [
    'TpvoB80j3Zo',
    'w1QPVe9jqlM',
    '5JN3o0Q-IgA',
    'PjaBwZkamDQ',
    'XIcjH3a98-c',
    'uOXj-T5D4jQ',
    'xD90_Gh-IKo',
    'JoLI3GYuB_A',
    'pXIXpfWyUNE'
]


// Load video_basics.json
var videos_info;
let video_basics_request = new XMLHttpRequest();
video_basics_request.open('GET', 'data/video_basics.json');
video_basics_request.onload = function() {
    if (video_basics_request.status >= 200 && video_basics_request.status < 400) {
        // Success!
        videos_info = JSON.parse(video_basics_request.responseText); // This is an object with key: video_id, value: video_info

        // Only keep video_infos that are in VIDEO_IDS
        let video_ids = Object.keys(videos_info);
        for (let video_id of video_ids) {
            if (!VIDEO_IDS.includes(video_id)) {
                delete videos_info[video_id];
            }
        }

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
        } else if (URLPARAMS.get('q')) {
            // Append js/results.js to the body
            let script = document.createElement('script');
            script.src = 'js/results.js';
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

// When clicking on search_open_btn, set data-mode of navbar to "search"
let search_open_btn = document.querySelector('#search_open_btn');
search_open_btn.addEventListener('click', function() {
    document.querySelector('#navbar').dataset.mode = "search";
});
let search_close_btn = document.querySelector('#search_close_btn');
search_close_btn.addEventListener('click', function() {
    document.querySelector('#navbar').dataset.mode = "default";
});


// When clicking the donate button, show overlay with iframe for ko-fi
let tip_btn = document.querySelector('#tip_btn');
tip_btn.addEventListener('click', function() {
    let overlay_content = create_overlay(document.body, 'tip_overlay', true, null, true);
    overlay_content = create_and_append('div', overlay_content);
    overlay_content.innerHTML = `
        <iframe 
            id='kofiframe' 
            src='https://ko-fi.com/obviouslyluuk/?hidefeed=true&widget=true&embed=true&preview=true' 
            style='
                /* position: absolute;
                top: -120px;
                left: 0;
                right: 0; */
                transform: translateY(-125px);
                border: none;
                filter: invert(1) hue-rotate(180deg) grayscale(0);
                border-radius: 10px;
                width:100%;
                ' 
            height='750' 
            title='kofi-obviouslyluuk'>
        </iframe>
    `;
    overlay_content.style.height = "545px";
    overlay_content.style.overflow = "hidden";
    overlay_content.parentElement.parentElement.style['background-color'] = "black";
});



document.body.dataset.mobile = mobileCheck();
document.body.dataset.tablet = tabletCheck();
document.body.dataset.ios = iOSCheck();
