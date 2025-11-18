export interface SongDeezer {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  artist: ArtistDeezer;
  album: AlbumDeezer;
  type: string;
}

export interface ArtistDeezer {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: string;
}

export interface AlbumDeezer {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
}

export interface SongAPI {
  id: string;
  title: string;
  title_short: string;
  preview: string;
  artist: ArtistAPI;
  album: AlbumAPI;
}

export interface ArtistAPI {
  name: string;
}

export interface AlbumAPI {
  cover_small: string;
  cover_xl: string;
}
