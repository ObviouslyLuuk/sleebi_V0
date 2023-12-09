

function redirect_results(query) {
    redirect_to(`/?q=${query}`, {page: 'results', query: query});
};

function redirect_watch(video_id, embed=false, replace=false) {
    redirect_to(`/?v=${video_id}${embed ? "&embed=true" : ''}`, {page: 'watch', video_id: video_id, embed: embed, replace: replace});
};

function redirect_home() {
    redirect_to('/', {page: 'home'});
};

function redirect_to(url, kwargs) {
    console.log(`===========================\nChanging state to "${url}". kwargs: ${JSON.stringify(kwargs)}`);
    if (kwargs.replace) {
        window.history.replaceState(kwargs, null, url);
    } else {
        window.history.pushState(kwargs, null, url);
    };
    window.dispatchEvent(new Event('pushstate'));
};

