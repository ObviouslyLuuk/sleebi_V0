/**
 * Helper functions
 */

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
/**
 * Tablet check isn't super reliable because some tablets are exactly like desktops except with touchscreens
 * 
 * @returns {boolean} - True if the device is a tablet, false otherwise.
 */
window.tabletCheck = function() {
    let check = false;
    (function(a){if(/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(a)) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}
window.iOSCheck = function() {
    let check = false;
    (function(a){if(/iPhone|iPod/.test(a)) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

/**
 * Fetches the HTML from 'html/${page}.html' and injects it into the container div.
 * Sets the 'HTML_TEMPLATES[page]' to the html after successful injection.
 * Fires the '{page}_html_ready' event after injection.
 * 
 * @returns {void}
 */
function fetch_html(page, selector=null) {
    fetch(`html/${page}.html`)
        .then(response => response.text())
        .then(html => {
            // Inject the HTML into the container
            if (selector) {
                let container = document.querySelector(selector);
                container.innerHTML = html;
            }
            HTML_TEMPLATES[page] = html;
        })
        .catch(error => console.error('Error fetching HTML:', error))
        .then(() => {
            // Fire event
            window.dispatchEvent(new Event(`${page}_html_ready`));
        });
}
const HTML_TEMPLATES = {}



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

function empty_element(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}



function get_thumb_url(video_info) {
    // let video_id = video_info.id
    // return `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`
    return video_info['thumbnail_url']
}

function get_download_url(video_info) {
    let video_id = video_info['id']
    return `https://sleebi-video-bucket.s3.eu-west-3.amazonaws.com/ObviouslyASMR/${video_id}.mp4`
}

function get_date(video_info, format='Mon DD, YYYY') {
    let date = new Date(video_info['published'])
    if (format == 'Mon DD, YYYY') {
        let day = date.getDate()
        let month = date.toLocaleString('default', { month: 'short' })
        let year = date.getFullYear()
        return `${month} ${day}, ${year}`
    } else if (format == 'DD-MM-YYYY') {
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        return `${day}-${month}-${year}`
    }
}


function get_description(video_info) {
    // Find string "Go ahead and " and return everything before it
    let description = video_info['description']
    let index = description.indexOf('Go ahead and ')
    if (index != -1)
        description = description.substring(0, index)

    // Replace all links with <a> tags
    let regex = /https?:\/\/[^\s]+/g
    let matches = description.match(regex)
    if (matches != null) {
        for (let match of matches) {
            description = description.replace(match, `<a href="${match}">${match}</a>`)
        }
    }

    // Replace all timestamps with <a> tags that do video.seekTo()
    regex = /\d{1,2}:\d{2}(:\d{2})?/g
    matches = description.match(regex)
    if (matches != null) {
        for (let match of matches) {
            description = description.replace(match, `<a onclick="seekTo(calc_ms_from_time('${match}'))">${match}</a>`)
        }
    }

    // Replace all newlines with <br>
    description = description.replace(/\n/g, '<br>')

    return description
}

