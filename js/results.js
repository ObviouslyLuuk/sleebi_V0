

// Fetch the HTML content
var html_ready = false;
fetch_html('results', "#content-container", "html_ready");

// Get query from URL
const QUERY = URLPARAMS.get('q');

// Set search bar value to query from URL
let search_input = document.querySelector('#search-input');
search_input.value = QUERY;

// Open search bar by default
document.querySelector('#navbar').dataset.mode = "search";


function placeContent() {
    if (!html_ready || !videos_info)
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
window.addEventListener('html_ready', placeContent);
window.addEventListener('videos_info_loaded', placeContent);

// Add css/results.css to the head
let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/results.css';
document.head.appendChild(link);


function add_rec_vid(parent, info) {
    let rec_vid = create_and_append('div', parent, null, 'rec_vid vid_tile')
    
    // Add onclick event to rec_vid to change video
    rec_vid.addEventListener('click', function() {
        window.location.href = `?v=${info.id}`;
    });

    // Thumbnail
    let rec_thumb_div_container = create_and_append('div', rec_vid, null, 'rec_thumb_div_container')
    let rec_thumb_div = create_and_append('div', rec_thumb_div_container, null, 'rec_thumb_div')
    let rec_thumb_img = create_and_append('img', rec_thumb_div, null, 'rec_thumb_img')
    rec_thumb_img.src = info.thumb_url
    let rec_duration = create_and_append('div', rec_thumb_div, null, 'rec_duration')
    rec_duration.innerText = info.duration

    // Metadata
    let rec_metadata = create_and_append('div', rec_vid, null, 'rec_metadata')
    let rec_title = create_and_append('h3', rec_metadata, null, 'rec_title')
    rec_title.innerText = info.title
    let rec_channel = create_and_append('div', rec_metadata, null, 'rec_channel')
    rec_channel.innerText = info.channel_name
    let rec_views_date = create_and_append('div', rec_metadata, null, 'rec_views-date')
    let rec_views = create_and_append('span', rec_views_date, null, 'rec_views')
    rec_views.innerText = views_abbr(info.views) + ' views'
    let rec_date = create_and_append('span', rec_views_date, null, 'rec_date date-span')
    rec_date.innerText = info.date

    return rec_vid
}

