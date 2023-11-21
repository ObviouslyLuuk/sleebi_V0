

/**
 * Creates an overlay element and appends it to the specified parent element.
 * If no parent element is provided, the overlay is appended to the document body.
 * 
 * @param {HTMLElement} [parent=document.body] - The parent element to append the overlay to.
 * @param {string} [class_=null] - The class name to add to the overlay.
 * @param {boolean} [add_close_btn=true] - Whether or not to add a close button to the overlay.
 * @param {number} [timer=null] - The amount of time in milliseconds to wait before automatically closing the overlay.
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

function create_message_overlay(message, parent=document.body) {
    let overlay_content = create_overlay(parent, 'message_overlay', false, null, false)
    let overlay_message = create_and_append('div', overlay_content, null, 'overlay_message')
    overlay_message.innerText = message
    return overlay_content
}
