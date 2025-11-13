export interface Tracks {
  track: Track[];
  "@attr": Attr2;
}

export interface Track {
  name: string;
  duration: string;
  listeners: string;
  mbid?: string;
  url: string;
  streamable: Streamable;
  artist: ArtistTop;
  image: ImageTop[];
  "@attr": Attr;
}

export interface Streamable {
  "#text": string;
  fulltrack: string;
}

export interface ArtistTop {
  name: string;
  mbid?: string;
  url: string;
}

export interface ImageTop {
  "#text": string;
  size: string;
}

export interface Attr {
  rank: string;
}

export interface Attr2 {
  country: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}
