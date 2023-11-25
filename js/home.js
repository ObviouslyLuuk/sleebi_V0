

// Fetch the HTML content
HTML_TEMPLATES['home'] = null;
fetch_html('home', "#content-container");


function placeHomeContent() {
    if (!HTML_TEMPLATES['home'] || !videos_info)
        return

    let rec_vids = get_search_results("", Object.values(videos_info));

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
window.addEventListener('home_html_ready', placeHomeContent);
window.addEventListener('videos_info_loaded', placeHomeContent);

// Add css/home.css to the head
link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/home.css';
document.head.appendChild(link);

