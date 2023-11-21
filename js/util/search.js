

/**
 * Returns an array of search results based on the given query and videos.
 * The results are sorted by relevance, which is determined by the title that contains the most words in the query.
 *
 * @param {string} query - The search query.
 * @param {Array<Object>} videos - An array of video objects.
 * @return {Array<Object>} An array of video objects sorted by relevance.
 */
function get_search_results(query, videos) {
    // Sort videos by relevance
    // Relevance is determined by the title that contains the most words in the query
    let results = [];
    query = query.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Remove all punctuation from query
    let query_words = query.split(' ');
    for (let video of videos) {
        let title = video['title'];
        let relevance = 0;
        for (let word of query_words) {
            if (title.includes(word)) {
                relevance++;
            }
        }
        results.push([video, relevance]);
    }
    results.sort((a, b) => b[0]["views"] - a[0]["views"]);
    results.sort((a, b) => b[1] - a[1]);
    results = results.map(result => result[0]);
    return results;
}

// Make search bar work by directing to /?q=QUERY
let search_bar = document.querySelector('#search_bar');
search_bar.addEventListener('submit', function(e) {
    e.preventDefault();
    let query = document.querySelector('#search-input').value;
    window.location.href = `/?q=${query}`;
});
