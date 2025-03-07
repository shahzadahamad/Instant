export interface PostLowerSectionComponentProps {
  postId: number
}

export interface ShareMOdalProps {
  postId: string
  shareModalOpen: boolean,
  handleShareModal: () => void;
}