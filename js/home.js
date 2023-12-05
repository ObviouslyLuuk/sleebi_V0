

// Fetch the HTML content
HTML_TEMPLATES['home'] = null;
fetch_html('home');


function placeHomeContent() {
    let container = document.querySelector('#content-container');
    container.innerHTML = '<div class="spinner active"><img src="images/logo.svg"></div>';
    if (!HTML_TEMPLATES['home']) {
        console.log("home html not loaded yet, waiting...");
        window.addEventListener('home_html_ready', placeHomeContent);
        return;
    };
    container.innerHTML = HTML_TEMPLATES['home'];
    if (!videos_info) {
        console.log("videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeHomeContent);
        return;
    };

    // Update page title
    document.title = "Sleebi - for Sleep";

    // Fill in stats
    // Don't have channel stats yet
    let num_videos = Object.keys(videos_info).length;
    let num_videos_div = document.querySelector('#num_videos');
    num_videos_div.innerHTML = num_videos;

    let rec_vids = get_search_results("", Object.values(videos_info));

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        add_rec_vid(
            document.querySelector('#search_results'),
            vid_info,
            'eager',
            640,
        );
    };
    document.querySelector('#content-container').dataset.page = "home";

    window.scrollTo(0,0);
};


