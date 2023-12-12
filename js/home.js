

const HOME_LOAD = document.querySelector('#home_stats_div');

HTML_TEMPLATES['home'] = null;
if (!HOME_LOAD) {
    // Fetch the HTML content
    fetch_html('home');
};


function placeHomeContent() {
    let container = document.querySelector('#content-container');
    if (!HTML_TEMPLATES['home'] && !HOME_LOAD) {
        container.innerHTML = '<div class="spinner active"><img src="images/logo.svg"></div>';
        console.log("placeHomeContent: home html not loaded yet, waiting...");
        window.addEventListener('home_html_ready', placeHomeContent, {once: true});
        return;
    } else if (HTML_TEMPLATES['home']) {
        container.innerHTML = HTML_TEMPLATES['home'];
    };
    if (!videos_info) {
        console.log("placeHomeContent: videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeHomeContent, {once: true});
        return;
    };

    // Close search bar if open
    document.querySelector('#navbar').dataset.mode = "default";

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


