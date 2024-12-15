export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
