

// Fetch the HTML content
HTML_TEMPLATES['results'] = null;
fetch_html('results');

function placeResultsContent() {
    if (!HTML_TEMPLATES['results']) {
        window.addEventListener('results_html_ready', placeResultsContent);
        return;
    }
    // Open search bar by default
    document.querySelector('#navbar').dataset.mode = "search";

    // Get query from URL
    URLPARAMS = new URLSearchParams(window.location.search);
    QUERY = URLPARAMS.get('q');

    // Set search bar value to query from URL
    let search_input = document.querySelector('#search-input');
    search_input.value = QUERY;

    document.querySelector('#content-container').innerHTML = HTML_TEMPLATES['results'];

    if (!videos_info) {
        window.addEventListener('videos_info_loaded', placeResultsContent);
        return;
    }

    let rec_vids = get_search_results(QUERY, Object.values(videos_info));

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        add_rec_vid(
            document.querySelector('#search_results'),
            vid_info,
        );
    }
    document.querySelector('#content-container').dataset.page = "results";
}
