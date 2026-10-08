export type TreeNode = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
};