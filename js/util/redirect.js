

function redirect_results(query) {
    window.history.pushState({}, '', `?q=${query}`);
    window.dispatchEvent(new Event('pushstate'));
}

function redirect_watch(video_id) {
    window.history.pushState({}, '', `?v=${video_id}`);
    window.dispatchEvent(new Event('pushstate'));
}

function redirect_home() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('pushstate'));
}

