
// [
//     'TpvoB80j3Zo',
//     'w1QPVe9jqlM',
//     '5JN3o0Q-IgA',
//     'PjaBwZkamDQ',
//     'XIcjH3a98-c',
//     'uOXj-T5D4jQ',
//     'xD90_Gh-IKo',
//     'JoLI3GYuB_A',
//     'pXIXpfWyUNE'
// ]

// Uploaded videos
VIDEO_IDS = [
    'demo480x852',
    '-9R09WrLmZc',
    '5JN3o0Q-IgA',
    'cAmIxLEANHo',
    'dt4YRc4UqK8',
    'J_ldPXab1f4',
    'JoLI3GYuB_A',
    'NJoFdZFvfcc',
    'PjaBwZkamDQ',
    'pXIXpfWyUNE',
    'TpvoB80j3Zo',
    'U2TLtSdQjpo',
    'uOXj-T5D4jQ',
    'w1QPVe9jqlM',
    'xD90_Gh-IKo',
    'XIcjH3a98-c',
    'YNMoz3OZ1JQ'
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
var URLPARAMS = new URLSearchParams(window.location.search);
var PATHNAME = window.location.pathname.split("/").splice(1);
var VIDEO_ID
var QUERY

update_page_based_on_url();


// Make search bar work by directing to /?q=QUERY
let search_bar = document.querySelector('#search_bar');
search_bar.addEventListener('submit', function(e) {
    e.preventDefault();
    let query = document.querySelector('#search-input').value;
    redirect_results(query);
});

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
    overlay_content = create_and_append('div', overlay_content); // This div is needed to not mess up the function of the close btn
    overlay_content.innerHTML = `
        <iframe 
            id='kofiframe' 
            src='https://ko-fi.com/obviouslyluuk/?hidefeed=true&widget=true&embed=true&preview=true' 
            style='
                /* position: absolute;
                width:100%;
                top: -120px;
                left: 0;
                right: 0; */
                transform: translateY(-125px);
                border: none;
                filter: invert(1) hue-rotate(180deg) grayscale(0);
                border-radius: 10px;
                '
            height='800' 
            title='kofi-obviouslyluuk'>
        </iframe>
    `;
    overlay_content.style['max-height'] = "min(90vh, 545px)";
    // overlay_content.style.overflow = "hidden";
    overlay_content.parentElement.parentElement.style['background-color'] = "black";
    overlay_content.parentElement.parentElement.style['padding'] = "0";
    overlay_content.parentElement.parentElement.style['width'] = "unset";
    overlay_content.parentElement.parentElement.style['border'] = "2px solid white";
});




let link // declaring link here so it can be used in multiple places

document.body.dataset.mobile = mobileCheck();
document.body.dataset.tablet = tabletCheck();
document.body.dataset.ios = iOSCheck();


// If mobile, set landscape to true if width is greater than height
function updateLandscape() {
    if (window.innerWidth > window.innerHeight) {
        // document.querySelector(".video-container").requestFullscreen(); // Can only be called by user interaction
        document.body.dataset.landscape = "true";
    } else {
        // document.exitFullscreen();
        document.body.dataset.landscape = "false";
    }
}
updateLandscape();


// Listen for resize events
window.addEventListener('resize', function() {
    // document.body.dataset.mobile = window.mobileCheck();
    // if (!document.body.dataset.mobile) return;
    if (!window.mobileCheck()) return;

    // If mobile and width is greater than height, set landscape to true
    updateLandscape();
});




function update_page_based_on_url() {
    // Get params from URL
    URLPARAMS = new URLSearchParams(window.location.search);
    PATHNAME = window.location.pathname.split("/").splice(1);

    // Depending on the pathname and urlparams, place different content
    switch (PATHNAME[0]) {
        case "":
            if (URLPARAMS.get('v')) {
                placeHomeContent();
                placeWatchContent();
            } else if (URLPARAMS.get('q')) {
                placeResultsContent();
                window.dispatchEvent(new Event('enterpip'));
            } else {
                placeHomeContent();
                window.dispatchEvent(new Event('enterpip'));
            }
            break;
        default:
            console.log("error page not yet implemented");
            break;
    }
}



// Every time something is pushed or popped from history, place content
window.addEventListener('pushstate', update_page_based_on_url);
window.addEventListener('popstate', update_page_based_on_url);

