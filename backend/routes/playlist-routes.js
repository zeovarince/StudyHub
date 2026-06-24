const express = require('express');
const router = express.Router();

const {
    createPlaylist,
    getMyPlaylists,
    searchPlaylists,
    addSongToPlaylist,
    getPlaylistSongs,
    removeSongFromPlaylist,
    deletePlaylist
} = require('../controllers/playlist-controller');

const verifyToken = require('../middlewares/auth-middleware');

router.get('/search', verifyToken, searchPlaylists);

router.post('/', verifyToken, createPlaylist);
router.get('/', verifyToken, getMyPlaylists);
router.delete('/:playlistId', verifyToken, deletePlaylist);

router.get('/:playlistId/songs', verifyToken, getPlaylistSongs);
router.post('/:playlistId/songs', verifyToken, addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', verifyToken, removeSongFromPlaylist);

module.exports = router;