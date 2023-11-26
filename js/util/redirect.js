

function redirect_results(query) {
    redirect_to(`/?q=${query}`);
}

function redirect_watch(video_id) {
    redirect_to(`/?v=${video_id}`);
}

function redirect_home() {
    redirect_to('/');
}

function redirect_to(url) {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new Event('pushstate'));
}

