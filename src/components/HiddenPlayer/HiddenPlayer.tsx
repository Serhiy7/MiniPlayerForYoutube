import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import ReactPlayer from "react-player";
import "./HiddenPlayer.scss";

interface Props {
  url: string;
  playing: boolean;
  volume: number;
  onReady: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
  showVideo: boolean;
}

const HiddenPlayer = forwardRef<ReactPlayer, Props>(
  (
    { url, playing, volume, onReady, onProgress, onEnded, onError, showVideo },
    ref
  ) => {
    const localRef = useRef<ReactPlayer>(null);

    useImperativeHandle(ref, () => localRef.current!);

    const handleReady = useCallback(() => {
      onReady();
    }, [onReady]);

    return (
      <div
        className={`hidden-player-wrapper ${
          showVideo ? "hidden-player-wrapper--visible" : ""
        }`}
      >
        <ReactPlayer
          ref={localRef}
          url={url}
          playing={playing}
          volume={volume / 100}
          controls={false}
          width="100%"
          height="100%"
          onReady={handleReady}
          onProgress={onProgress}
          onEnded={onEnded}
          onError={onError}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                playsinline: 1,
                showinfo: 0,
                autohide: 1,
                cc_load_policy: 0,
                color: "white",
                hl: "en",
                enablejsapi: 1,
                widget_referrer: window.location.origin,
              },
            },
          }}
        />
      </div>
    );
  }
);

export default HiddenPlayer;
