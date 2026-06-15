const ytSearch = require('yt-search');

const searchMusic = async (req, res) => {
    try {
        const searchQuery = req.query.q || 'lofi study music type beat';
        const result = await ytSearch(searchQuery);
        const videos = result.videos.slice(0, 10).map(video => ({
            id: video.videoId,
            title: video.title,
            thumbnail: video.image,
            duration: video.timestamp,
            author: video.author.name,
            url: video.url
        }));

        res.status(200).json({ 
            success: true, 
            data: videos 
        });

    } catch (error) {
        console.error('Error saat mencari musik:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server pencarian musik' 
        });
    }
};

module.exports = { searchMusic };