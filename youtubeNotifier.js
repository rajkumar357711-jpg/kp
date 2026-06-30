const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC2gHi5ghVkq_bWya0a-8gdw"; // Must start with UC...
const DISCORD_CHANNEL_ID = "1312097094814666792";

let lastVideo = null;

async function checkUploads(client) {
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/search?` +
      `key=${API_KEY}` +
      `&channelId=${CHANNEL_ID}` +
      `&part=snippet,id` +
      `&order=date` +
      `&maxResults=1` +
      `&type=video`;

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    if (data.error) {
      console.log("YouTube API Error:", data.error.message);
      return;
    }

    if (!data.items || data.items.length === 0) {
      console.log("No videos found.");
      return;
    }

    const video = data.items[0];

    if (lastVideo === video.id.videoId) return;

    lastVideo = video.id.videoId;

    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
    if (!channel) return;

    const videoURL = `https://www.youtube.com/watch?v=${video.id.videoId}`;

    channel.send(
      `🚨 **NEW VIDEO!**\n\n@everyone\n\n📺 ${video.snippet.title}\n${videoURL}`
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = { checkUploads };
