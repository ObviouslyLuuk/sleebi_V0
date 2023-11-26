

// Fetch the HTML content
HTML_TEMPLATES['home'] = null;
fetch_html('home');


function placeHomeContent() {
    if (!HTML_TEMPLATES['home']) {
        console.log("home html not loaded yet, waiting...");
        window.addEventListener('home_html_ready', placeHomeContent);
        return;
    }
    document.querySelector('#content-container').innerHTML = HTML_TEMPLATES['home'];
    if (!videos_info) {
        console.log("videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeHomeContent);
        return;
    }

    let rec_vids = get_search_results("", Object.values(videos_info));

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        add_rec_vid(
            document.querySelector('#search_results'),
            vid_info,
        );
    }
    document.querySelector('#content-container').dataset.page = "home";
}


