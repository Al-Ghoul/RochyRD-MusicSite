type Album = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  createdAt: Date;
};

type Song = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageURL: string;
  albumId: string;
  createdAt: Date;
};
