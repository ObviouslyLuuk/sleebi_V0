

// Fetch the HTML content
HTML_TEMPLATES['results'] = null;
fetch_html('results');

function placeResultsContent() {
    let container = document.querySelector('#content-container');
    container.innerHTML = '<div class="spinner active"><img src="images/logo.svg"></div>';
    if (!HTML_TEMPLATES['results']) {
        console.log("placeResultsContent: results html not loaded yet, waiting...");
        window.addEventListener('results_html_ready', placeResultsContent);
        return;
    };
    // Open search bar by default
    document.querySelector('#navbar').dataset.mode = "search";

    // Get query from URL
    URLPARAMS = new URLSearchParams(window.location.search);
    QUERY = URLPARAMS.get('q');
    console.log("query:", QUERY);

    // Update page title
    document.title = `Search: ${QUERY}`;

    // Set search bar value to query from URL
    let search_input = document.querySelector('#search-input');
    search_input.value = QUERY;

    document.querySelector('#content-container').innerHTML = HTML_TEMPLATES['results'];

    if (!videos_info) {
        console.log("placeResultsContent: videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeResultsContent);
        return;
    };

    let rec_vids = get_search_results(QUERY, Object.values(videos_info));

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        add_rec_vid(
            document.querySelector('#search_results'),
            vid_info,
            'eager',
            320,
        );
    };
    document.querySelector('#content-container').dataset.page = "results";

    window.scrollTo(0,0);
};
