import { BiDotsVerticalRounded } from "react-icons/bi";
import "../scss/song.scss";
import { useRef, useState } from "react";

interface SongProps {
  id: string;
  cover: string;
  author: string;
  title: string;
  preview: string;
}

const Song = ({ id, cover, author, title, preview }: SongProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="my-1 song mx-3 d-flex align-items-center">
      <button
        data-audio-id={id}
        title="Play preview"
        onClick={() => {
          if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
          } else {
            audioRef.current?.play();
            setIsPlaying(true);
          }
        }}
      >
        <img src={cover} alt="Cover of the song" className="me-3" />
      </button>
      <audio className="d-none" ref={audioRef} src={preview} controls />
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <p className="mb-0 fw-bold">{title}</p>
        <p className="mb-0">{author}</p>
      </div>
      <div className="dots-menu fs-4 me-4">
        <BiDotsVerticalRounded />
      </div>
    </div>
  );
};

export default Song;
