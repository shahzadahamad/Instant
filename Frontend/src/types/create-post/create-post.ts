interface PostItem {
  url: string;
  type: "image" | "video";
  postFilterClass: string;
  customFilter: [
    {
      label: "Contrast";
      value: 100;
      field: "contrast";
    },
    {
      label: "Brightness";
      value: 100;
      field: "brightness";
    },
    {
      label: "Saturation";
      value: 100;
      field: "saturate";
    },
    { label: "Sepia"; value: 0; field: "sepia" },
    { label: "Gray Scale"; value: 0; field: "gray" }
  ];
}

export interface PostState {
  post: PostItem[];
  postIndex: number;
  aspectRatio: number | null;
  musicId: string;
  postHoverFilterClass: string;
  postType: string;
}

export interface GetCreatePostMusicData {
  _id: string;
  title: string;
  music: string;
  image: string;
}

export interface GetSelectMusicData {
  _id: string;
  title: string;
  music: string;
  image: string;
}
