/**
 * Helper functions
 */

/**
 * Fetches the HTML from 'html/${page}.html' and injects it into the container div.
 * Sets the 'html_ready' flag to true after successful injection.
 * Fires the 'html_ready' event after injection.
 * 
 * @returns {void}
 */
function fetch_html(page, selector, event_name) {
    fetch(`html/${page}.html`)
        .then(response => response.text())
        .then(html => {
            // Inject the HTML into the container
            let container = document.querySelector(selector);
            container.innerHTML = html;
            html_ready = true;
        })
        .catch(error => console.error('Error fetching HTML:', error))
        .then(() => {
            // Fire event
            window.dispatchEvent(new Event(event_name));
        });
}



function views_add_commas(views) {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Abbreviates the number of views to the format "X.XB", "X.XM", "X.XK", or "X".
 * @param {number} views - The number of views.
 * @returns {string|number} - The abbreviated views.
 */
function views_abbr(views) {
    if (views >= 1000000000)
        return `${(views / 1000000000).toFixed(1)}B`
    else if (views >= 1000000)
        return `${(views / 1000000).toFixed(1)}M`
    else if (views >= 1000)
        return `${(views / 1000).toFixed(1)}K`
    else
        return views
}


/**
 * Formats milliseconds as time in the format "hh:mm:ss" or "mm:ss".
 * @param {number} ms - The number of milliseconds to format.
 * @returns {string} The formatted time string.
 */
function format_ms_as_time(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    seconds -= minutes * 60
    minutes -= hours * 60

    if (hours > 0)
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    else
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
}


/**
 * Calculates the milliseconds from a given time string.
 * 
 * @param {string} time - The time string in the format "HH:MM:SS" or "MM:SS".
 * @returns {number} The calculated milliseconds.
 */
function calc_ms_from_time(time) {
    // Raise error if time is not in the format "HH:MM:SS" or "MM:SS"
    if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(time))
        throw new Error('Time must be in the format "HH:MM:SS" or "MM:SS"')

    let time_split = time.split(':')
    let hours = 0
    let minutes = 0
    let seconds = 0
    if (time_split.length == 2) {
        minutes = parseInt(time_split[0])
        seconds = parseInt(time_split[1])
    } else if (time_split.length == 3) {
        hours = parseInt(time_split[0])
        minutes = parseInt(time_split[1])
        seconds = parseInt(time_split[2])
    }
    return (hours * 3600 + minutes * 60 + seconds) * 1000
}


function create_and_append(type, parent=null, id=null, class_=null) {
    if (parent == null)
        parent = document.body

    let element = document.createElement(type)

    if (id != null)
        element.id = id
    if (class_ != null)
        element.setAttribute('class', class_)

    parent.appendChild(element)
    return element
}
