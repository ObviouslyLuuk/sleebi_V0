

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
function create_overlay(parent=document.body, class_=null, add_close_btn=true, timer=null, add_background=true) {
    let overlay_background, overlay
    if (add_background) {
        overlay_background = create_and_append('div', parent, null, 'overlay_background')
        overlay = create_and_append('div', overlay_background, null, 'overlay ' + class_)
    } else {
        overlay = create_and_append('div', parent, null, 'overlay ' + class_)
        overlay_background = overlay
    }
    let overlay_content = create_and_append('div', overlay, null, 'overlay_content')
    if (add_close_btn) {
        let overlay_close_btn = create_and_append('div', overlay_content, null, 'overlay_close_btn clickable_icon')
        overlay_close_btn.innerHTML = `
        <svg class="icon">
            <use xlink:href="images/sprite.svg#icon-cross"></use>
        </svg>
        `
        overlay_close_btn.addEventListener('click', function() {
            overlay_background.remove()
        })
        // Add event listener that listens for clicks on overlay_background that aren't on overlay
        overlay_background.addEventListener('click', function(event) {
            if (event.target == overlay_background) {
                overlay_background.remove()
            }
        })
        // Pressing escape will close the overlay
        window.addEventListener('keydown', function(event) {
            if (event.key == 'Escape') {
                overlay_background.remove()
            }
        })
    } else {
        // Clicking anywhere will close the overlay
        window.addEventListener('click', function() {
            overlay_background.remove()
        })
        // Pressing escape will close the overlay
        window.addEventListener('keydown', function(event) {
            if (event.key == 'Escape') {
                overlay_background.remove()
            }
        })
        // When the animation ends, remove the overlay
        overlay.addEventListener('animationend', function() {
            overlay_background.remove()
        })
    }

    if (timer != null) {
        setTimeout(function() {
            overlay_background.remove()
        }, timer)
    }

    return overlay_content
}

function create_message_overlay(message, parent=document.body, duration=2000) {
    let ani_str = `${duration/1000}s ease-in-out 0s 1 normal forwards running slideUpAndAway`
    let overlay_content = create_overlay(parent, 'message_overlay', false, undefined, false)
    overlay_content.parentElement.style.animation = ani_str
    let overlay_message = create_and_append('div', overlay_content, null, 'overlay_message')
    overlay_message.innerText = message
    return overlay_content
}





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
    rec_thumb_img.src = get_thumb_url(info)
    let rec_duration = create_and_append('div', rec_thumb_div, null, 'rec_duration')
    rec_duration.innerText = format_ms_as_time(info.duration*1000)

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
    rec_date.innerText = get_date(info, format='DD-MM-YYYY')

    return rec_vid
}
