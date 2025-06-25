import React, { useState, useEffect, useCallback } from "react";
import Header from "../Header/Header";
import LayoutMain from "../LayoutMain/LayoutMain";
import LayoutControls from "../LayoutMain/LayoutControls/LayoutControls";
import { useTheme } from "../../hooks/Theme/useTheme";
import { useHotkeys } from "../../hooks/Hotkeys/useHotkeys";
import { usePlayerStore } from "../../hooks/Player/usePlayerStore";
import { usePlaylist, PlaylistItem } from "../../hooks/Playlist/usePlaylist";
import "./YouTubeAudioPlayer.scss";

const INITIAL_PLAYLIST_ID = "RDCdqPv4Jks_w";
const YT_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = import.meta.env.VITE_PLAYER as string;

const YouTubePlaylistPlayer: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { playlist, currentIndex, changeTrack, setPlaylist, loading, error } =
    usePlaylist(INITIAL_PLAYLIST_ID);

  const {
    playerRef,
    isPlaying,
    play,
    pause,
    progress,
    duration,
    volume,
    setVolume,
    seekTo,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    onReady,
    onProgress,
    onError,
  } = usePlayerStore();

  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  useHotkeys({
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  });

  const handlePlayerReady = useCallback(() => {
    onReady();
  }, [onReady]);

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      playerRef.current?.seekTo(0);
      play();
    } else {
      const next = (currentIndex + 1) % playlist.length;
      changeTrack(next, true, play, seekTo);
    }
  }, [currentIndex, playlist.length, repeatMode, changeTrack, play, seekTo]);

  // Поиск треков
  const handleSearch = useCallback(
    async (query: string) => {
      if (!API_KEY) return;
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        maxResults: "10",
        q: query,
        key: API_KEY,
      });
      const res = await fetch(`${YT_SEARCH_API}?${params}`);
      const json = await res.json();
      const newList: PlaylistItem[] = json.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
      }));
      setPlaylist(newList);
      changeTrack(
        0,
        false,
        () => {},
        () => {}
      );
    },
    [setPlaylist, changeTrack]
  );

  const currentVideoId = playlist[currentIndex]?.videoId;
  const url = currentVideoId
    ? `https://www.youtube.com/watch?v=${currentVideoId}`
    : "";

  if (loading) return <div className="loading">Loading playlist...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div
      className={`yt-audio-player-container ${
        showVideo ? "layout--with-video" : "layout--no-video"
      }`}
    >
      <Header
        title="YouTube Playlist Audio"
        onSearch={handleSearch}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        extraControls={
          <button
            type="button"
            className="video-toggle-btn"
            onClick={() => setShowVideo((v) => !v)}
          >
            {showVideo ? "Hide Video" : "Show Video"}
          </button>
        }
      />

      <LayoutMain
        url={url}
        showVideo={showVideo}
        playerRef={playerRef}
        isPlaying={isPlaying}
        volume={volume}
        onReady={handlePlayerReady}
        onProgress={onProgress}
        onEnded={handleEnded}
        onError={onError}
        playlist={playlist}
        currentIndex={currentIndex}
        changeTrack={changeTrack}
        play={play}
        seekTo={seekTo}
        loading={loading}
      />

      <LayoutControls
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={() => changeTrack(currentIndex - 1, true, play, seekTo)}
        onNext={() => changeTrack(currentIndex + 1, true, play, seekTo)}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeat}
        progress={progress}
        duration={duration}
        onSeek={seekTo}
        volume={volume}
        onVolumeChange={setVolume}
      />
    </div>
  );
};

export default YouTubePlaylistPlayer;
