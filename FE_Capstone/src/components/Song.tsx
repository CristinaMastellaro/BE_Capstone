import { Row } from "react-bootstrap";
import { BiDotsVertical } from "react-icons/bi";
import "../scss/song.scss";

interface SongProps {
  cover: string;
  author: string;
  title: string;
}

const Song = ({ cover, author, title }: SongProps) => {
  return (
    <div className="my-1 song mx-3 d-flex">
      <img src={cover} alt="Cover of the song" className="me-3" />
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <span>{title}</span>
        <span className="mb-0">{author}</span>
      </div>
      <div>
        <BiDotsVertical />
      </div>
    </div>
  );
};

export default Song;
