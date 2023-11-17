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