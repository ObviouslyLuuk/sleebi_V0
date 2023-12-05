

/**
 * Creates an overlay element and appends it to the specified parent element.
 * If no parent element is provided, the overlay is appended to the document body.
 * 
 * @param {HTMLElement} [parent=document.body] - The parent element to append the overlay to.
 * @param {string} [class_=null] - The class name to add to the overlay.
 * @param {boolean} [add_close_btn=true] - Whether or not to add a close button to the overlay.
 * @param {number} [timer=null] - The amount of time in milliseconds to wait before automatically closing the overlay.
 * @param {boolean} [add_background=true] - Whether or not to add a background to the overlay.
 * @returns {HTMLElement} The content element of the created overlay.
 */
function create_overlay(parent=document.body, class_='', add_close_btn=true, timer=null, add_background=true) {
    let overlay_background, overlay;
    if (add_background) {
        overlay_background = create_and_append('div', parent, null, 'overlay_background');
        overlay = create_and_append('div', overlay_background, null, 'overlay ' + class_);
    } else {
        overlay = create_and_append('div', parent, null, 'overlay ' + class_);
        overlay_background = overlay;
    };
    let overlay_content = create_and_append('div', overlay, null, 'overlay_content');
    if (add_close_btn) {
        let overlay_close_btn = create_and_append('div', overlay_content, null, 'overlay_close_btn clickable_icon');
        overlay_close_btn.innerHTML = `
        <svg class="icon">
            <use xlink:href="images/sprite.svg#icon-cross"></use>
        </svg>
        `;
        // When close button is clicked, remove the overlay
        overlay_close_btn.addEventListener('click', function() {
            overlay_background.remove();
        });
        // Add event listener that listens for clicks on overlay_background that aren't on overlay
        overlay_background.addEventListener('click', function(event) {
            if (event.target == overlay_background) {
                overlay_background.remove();
            };
        });
        // Pressing escape will close the overlay
        window.addEventListener('keydown', function(event) {
            if (event.key == 'Escape') {
                overlay_background.remove();
            };
        });
    } else {
        // Clicking anywhere will close the overlay
        window.addEventListener('click', function() {
            overlay_background.remove();
        });
        // Pressing escape will close the overlay
        window.addEventListener('keydown', function(event) {
            if (event.key == 'Escape') {
                overlay_background.remove();
            };
        });
        // When the animation ends, remove the overlay
        overlay.addEventListener('animationend', function() {
            overlay_background.remove();
        });
    };

    if (timer != null) {
        setTimeout(function() {
            overlay_background.remove();
        }, timer);
    };

    return overlay_content;
};

function create_message_overlay(message, parent=document.body, duration=2000) {
    let ani_str = `${duration/1000}s ease-in-out 0s 1 normal forwards running slideUpAndAway`;
    let overlay_content = create_overlay(parent, 'message_overlay', false, undefined, false);
    overlay_content.parentElement.style.animation = ani_str;
    let overlay_message = create_and_append('div', overlay_content, null, 'overlay_message');
    overlay_message.innerText = message;
    return overlay_content;
};





function add_rec_vid(parent, info, img_loading='eager', max_width=1280) {
    let rec_vid = create_and_append('div', parent, null, 'rec_vid vid_tile');
    
    // Add onclick event to rec_vid to change video
    rec_vid.addEventListener('click', function() {
        redirect_watch(info.id);
    });

    // Thumbnail
    let rec_thumb_div_container = create_and_append('div', rec_vid, null, 'rec_thumb_div_container');
    let rec_thumb_div = create_and_append('div', rec_thumb_div_container, null, 'rec_thumb_div');
    let rec_thumb_img = create_and_append('img', rec_thumb_div, null, 'rec_thumb_img');
    thumb_urls = get_thumb_urls(info);
    rec_thumb_img.width = 480;
    rec_thumb_img.height = 270;
    if (img_loading == 'lazy') {
        rec_thumb_img.loading = 'lazy';
    };
    // sizes is about the viewport width, not the image width
    // this means the 1280px is overkill because we often have a viewport that wide, but the image is never that wide
    // rec_thumb_img.sizes = `
    //     (max-width: 320px) 320px,
    //     (max-width: 480px) 480px, 
    //     (max-width: 640px) 640px, 
    //     1280px`;
    // Create sizes attribute based on max_width
    let sizes = '';
    let widths = [320, 480, 640, 1280];
    for (let width of widths) {
        if (width < max_width) {
            sizes += `(max-width: ${width}px) ${width}px, `;
        } else {
            sizes += `${max_width}px`;
            break;
        };
    };
    rec_thumb_img.sizes = sizes;
    rec_thumb_img.srcset = `
        ${thumb_urls['low']} 320w,
        ${thumb_urls['medium']} 480w,
        ${thumb_urls['high']} 640w,
        ${thumb_urls['maxres']} 1280w
    `;
    rec_thumb_img.src = thumb_urls['low'];
    rec_thumb_img.alt = "video thumbnail";
    let rec_duration = create_and_append('div', rec_thumb_div, null, 'rec_duration');
    rec_duration.innerText = format_ms_as_time(info.duration*1000);
    let rec_play_btn = create_and_append('div', rec_thumb_div, null, 'rec_play_btn');
    rec_play_btn.innerHTML = `
        <svg class="play-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
    `;
    // Metadata
    let rec_metadata = create_and_append('div', rec_vid, null, 'rec_metadata');
    let rec_title = create_and_append('h6', rec_metadata, null, 'rec_title');
    rec_title.innerText = info.title;
    let rec_channel = create_and_append('div', rec_metadata, null, 'rec_channel');
    rec_channel.innerText = info.channel_name;
    let rec_views_date = create_and_append('div', rec_metadata, null, 'rec_views-date');
    let rec_views = create_and_append('span', rec_views_date, null, 'rec_views');
    rec_views.innerText = views_abbr(info.views) + ' views';
    let rec_date = create_and_append('span', rec_views_date, null, 'rec_date date-span');
    rec_date.innerText = get_date(info, format='DD-MM-YYYY');

    // Add interval that listens for the position of the rec_vid in the viewport
    // If it is not in the viewport, set loading to lazy
    // Add event listener to remove the interval when the image is loaded
    if (img_loading != 'lazy') {
        let rec_thumb_img_interval = setInterval(function() {
            rec_thumb_img.addEventListener('load', function() {
                clearInterval(rec_thumb_img_interval);
            });
            let rect = rec_thumb_img.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) {
                rec_thumb_img.loading = 'lazy';
            } else {
                rec_thumb_img.loading = img_loading;
            };
        }, 50);
    };

    return rec_vid;
};
