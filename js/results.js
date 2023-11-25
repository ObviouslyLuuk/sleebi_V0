

// Fetch the HTML content
HTML_TEMPLATES['results'] = null;
fetch_html('results', "#content-container");

// Get query from URL
const QUERY = URLPARAMS.get('q');

// Set search bar value to query from URL
let search_input = document.querySelector('#search-input');
search_input.value = QUERY;

// Open search bar by default
document.querySelector('#navbar').dataset.mode = "search";


function placeResultsContent() {
    if (!HTML_TEMPLATES['results'] || !videos_info)
        return

    let rec_vids = get_search_results(QUERY, Object.values(videos_info));

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        add_rec_vid(
            document.querySelector('#search_results'),
            vid_info,
        );
    }

    if (mobileCheck()) {
        // Scroll to video element
        // console.log("scrolling to video");
        // video.scrollIntoView();
    }

    // Listen for resize events
    window.addEventListener('resize', function() {
        // document.body.dataset.mobile = window.mobileCheck();
        // if (!document.body.dataset.mobile) return;
        if (!window.mobileCheck()) return;

        // If mobile and width is greater than height, set landscape to true
        updateLandscape();
    });
}


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


// Call placeContent() after html_ready and videos_info_loaded events
window.addEventListener('results_html_ready', placeResultsContent);
window.addEventListener('videos_info_loaded', placeResultsContent);

// Add css/results.css to the head
link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/results.css';
document.head.appendChild(link);

