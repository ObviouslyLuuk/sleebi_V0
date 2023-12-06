import requests
import re
import json

VIDEO_URL = 'https://www.youtube.com/watch?v={video_id}'

def get_channel_icon_from_html(html):
    # URL has to start with https://yt3.ggpht.com/, end with =s176-c-k-c0x00ffffff-no-rj
    regex = r'"url":\s*"https://yt3.ggpht.com/([^"]*=s176-c-k-c0x00ffffff-no-rj)"'
    return 'https://yt3.ggpht.com/' +  re.findall(regex, html)[0]

def get_basics_from_html_request(video_id):
    """
    Return a dict with the following keys:
    id: video id
    title: video title
    description: video description
    tags: video tags
    duration: video duration in seconds
    published: video published date
    uploaded: video uploaded date
    thumbnail_url: video thumbnail url
    views: video views
    channel_id: video channel id
    channel_name: video channel name
    channel_@name: video channel @name
    channel_icon_url: video channel icon url
    """
    url = VIDEO_URL.format(video_id=video_id)
    r = requests.get(url)
    html = r.text

    # ytInitialPlayerResponse from html as json
    regex = r'ytInitialPlayerResponse\s*=\s*({.*});'
    ytInitialPlayerResponse = re.findall(regex, html)[0]
    ytInitialPlayerResponse = json.loads(ytInitialPlayerResponse)

    # Get video info from ytInitialPlayerResponse
    ytIPR = {
        'id':                   ytInitialPlayerResponse['videoDetails']['videoId'],
        'title':                ytInitialPlayerResponse['videoDetails']['title'],
        'lengthSeconds':        ytInitialPlayerResponse['videoDetails']['lengthSeconds'],
        'keywords':             ytInitialPlayerResponse['videoDetails']['keywords'],
        'channelId':            ytInitialPlayerResponse['videoDetails']['channelId'],
        'shortDescription':     ytInitialPlayerResponse['videoDetails']['shortDescription'],
        'isCrawlable':          ytInitialPlayerResponse['videoDetails']['isCrawlable'],
        'thumbnails':           ytInitialPlayerResponse['videoDetails']['thumbnail']['thumbnails'],
        'allowRatings':         ytInitialPlayerResponse['videoDetails']['allowRatings'],
        'viewCount':            ytInitialPlayerResponse['videoDetails']['viewCount'],
        'author':               ytInitialPlayerResponse['videoDetails']['author'],
        'isPrivate':            ytInitialPlayerResponse['videoDetails']['isPrivate'],
        'isUnpluggedCorpus':    ytInitialPlayerResponse['videoDetails']['isUnpluggedCorpus'],
        'isLiveContent':        ytInitialPlayerResponse['videoDetails']['isLiveContent'],
        'bestThumbnail':        ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['thumbnail']['thumbnails'][-1],
        # 'embed':                ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['embed']['iframeUrl'],
        'ownerProfileUrl':      ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['ownerProfileUrl'],
        'externalChannelId':    ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['externalChannelId'],
        'isFamilySafe':         ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['isFamilySafe'],
        'availableCountries':   ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['availableCountries'],
        'isUnlisted':           ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['isUnlisted'],
        'hasYpcMetadata':       ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['hasYpcMetadata'],
        'category':             ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['category'],
        'publishDate':          ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['publishDate'],
        'ownerChannelName':     ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['ownerChannelName'],
        'uploadDate':           ytInitialPlayerResponse['microformat']['playerMicroformatRenderer']['uploadDate'],
    }
    return { # Narrow down the info to the basics
        'id':               ytIPR['id'],
        'title':            ytIPR['title'],
        'description':      ytIPR['shortDescription'],
        'tags':             ytIPR['keywords'],
        'duration':     int(ytIPR['lengthSeconds']),
        'published':        ytIPR['publishDate'],
        'uploaded':         ytIPR['uploadDate'],
        'thumbnail_url':    ytIPR['bestThumbnail']['url'],
        'views':        int(ytIPR['viewCount']),
        'channel_id':       ytIPR['channelId'],
        'channel_name':     ytIPR['ownerChannelName'],
        'channel_@name':    ytIPR['ownerProfileUrl'].split('/')[-1],
        'channel_icon_url': get_channel_icon_from_html(html),
    }
