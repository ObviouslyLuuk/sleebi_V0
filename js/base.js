
// Get params from URL
var URLPARAMS = new URLSearchParams(window.location.search);
var PATHNAME = window.location.pathname.split("/").splice(1);
var VIDEO_ID;
var QUERY;

update_page_based_on_url();


// Make search bar work by directing to /?q=QUERY
let search_bar = document.querySelector('#navbar #search_bar');
search_bar.addEventListener('submit', function(e) {
    e.preventDefault();
    let query = document.querySelector('#navbar #search-input').value;
    console.log("search query entered: ", query);
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




let link; // declaring link here so it can be used in multiple places

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
    };
};
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
    console.log("new params:", URLPARAMS.toString());

    // Depending on the pathname and urlparams, place different content
    switch (PATHNAME[0]) {
        case "":
            if (URLPARAMS.get('v')) {
                console.log("placing watch page");
                placeWatchContent();
                if (!document.querySelector('#content-container').dataset.page) {
                    placeHomeContent();
                }
            } else if (URLPARAMS.get('q')) {
                console.log("placing results page");
                placeResultsContent();
                window.dispatchEvent(new Event('enterpip'));
            } else {
                console.log("placing home page");
                placeHomeContent();
                window.dispatchEvent(new Event('enterpip'));
            };
            break;
        default:
            console.log("unknown pathname. error page not yet implemented");
            break;
    };
};



// Every time something is pushed or popped from history, place content
window.addEventListener('pushstate', update_page_based_on_url);
window.addEventListener('popstate', update_page_based_on_url);


create_message_overlay('Sleebi is a work in progress, so keep in mind some features might not work', document.body, 5000);
