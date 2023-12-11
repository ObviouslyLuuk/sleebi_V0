

function redirect_results(query) {
    redirect_to(`/?q=${query}`, {page: 'results', query: query});
};

function redirect_watch(video_id, embed=false, replace=false) {
    let url = get_video_url(video_id, embed, undefined, true, true);
    redirect_to(url, {page: 'watch', video_id: video_id, embed: embed, replace: replace});
};

function redirect_home() {
    redirect_to('/', {page: 'home'});
};

function redirect_to(url, kwargs) {
    console.log(`===========================\nRedirecting to "${url}". kwargs: ${JSON.stringify(kwargs)}`);
    if (kwargs.replace) {
        window.history.replaceState(kwargs, null, url);
        console.log("Replaced state with "+url);
    } else {
        save_time_if_video();
        window.history.pushState(kwargs, null, url);
        console.log("Pushed state with "+url);
    };
    window.dispatchEvent(new Event('pushstate'));
};

function save_time_if_video() {
    URLPARAMS = new URLSearchParams(window.location.search);
    if (URLPARAMS.get('v')) {
        if (EMBED && (!yt_player || !yt_player.getDuration)) { return; };
        if (!EMBED && !video.duration) { return; };

        let video_id = URLPARAMS.get('v');
        let time = parseInt(getTime()*1000);
        let total_duration = parseInt(getDuration()*1000);
        if (total_duration - time < 5000) { return; }; // If less than 5 seconds left, don't save time
        let url = get_video_url(video_id, EMBED, time, true);
        window.history.replaceState({page: 'watch', video_id:video_id, embed:EMBED, time:time}, null, url);
        console.log(`Replaced state with time ${time}`)
    };
};

