

function redirect_results(query) {
    redirect_to(`/?q=${query}`, {page: 'results', query: query});
};

function redirect_watch(video_id) {
    redirect_to(`/?v=${video_id}`, {page: 'watch', video_id: video_id});
};

function redirect_home() {
    redirect_to('/', {page: 'home'});
};

function redirect_to(url, kwargs) {
    console.log(`Changing state to "${url}". kwargs: ${JSON.stringify(kwargs)}`);
    window.history.pushState(kwargs, null, url);
    window.dispatchEvent(new Event('pushstate'));
};

