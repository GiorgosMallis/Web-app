export type Note = {
  id: string;
  title: string;
  content: string;
  folder?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  userId: string;
};
