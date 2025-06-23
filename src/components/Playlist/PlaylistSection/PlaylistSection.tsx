import React, { useEffect, useRef, memo } from "react";
import "./PlaylistSection.scss";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

interface Props {
  items: PlaylistItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  loading?: boolean;
}

const PlaylistSection: React.FC<Props> = ({ items, currentIndex, onSelect, loading = false }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentIndex]);

  if (loading) return <div className="yt-playlist__loading">Loading playlist...</div>;
  if (items.length === 0) return <div className="yt-playlist__empty">Playlist is empty</div>;

  return (
    <ul ref={listRef} className="yt-playlist" role="listbox" aria-activedescendant={`item-${currentIndex}`}>
      {items.map((item, idx) => (
        <li
          key={`${item.videoId}-${idx}`}
          id={`item-${idx}`}
          ref={idx === currentIndex ? activeRef : null}
          role="option"
          aria-selected={idx === currentIndex}
          className={`yt-playlist__item ${idx === currentIndex ? "yt-playlist__item--active" : ""}`}
          onClick={() => onSelect(idx)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default memo(PlaylistSection);
