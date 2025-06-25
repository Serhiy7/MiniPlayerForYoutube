import React from "react";
import ControlsWithTooltip from "../../Controls/ControlsWithTooltip/ControlsWithTooltip";
import { ProgressWithTime } from "../../ProgressWithTime/ProgressWithTime";
import VolumeWithLabel from "../../VolumeSection/VolumeWithLabel/VolumeWithLabel";
import "./LayoutControls.scss";

interface LayoutControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: "none" | "one" | "all";
  onToggleRepeat: () => void;
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
}) => (
  <div className="layout-controls">
    <ControlsWithTooltip
      isPlaying={isPlaying}
      onPlayPause={onPlayPause}
      onPrev={onPrev}
      onNext={onNext}
      isShuffle={isShuffle}
      onToggleShuffle={onToggleShuffle}
      repeatMode={repeatMode}
      onToggleRepeat={onToggleRepeat}
    />

    <div className="progress-volume-section">
      <ProgressWithTime
        progress={progress}
        duration={duration}
        onSeek={onSeek}
      />
      <VolumeWithLabel volume={volume} onVolumeChange={onVolumeChange} />
    </div>
  </div>
);

export default LayoutControls;
