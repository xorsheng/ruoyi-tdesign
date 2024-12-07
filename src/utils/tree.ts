type TreeNode = {
  children?: TreeNode[];
  [key: string]: any; // Allow other unknown properties
};

/**
 * Applies a mapping function to each node in a tree structure.
 * @param arr - The array representing the root nodes of the tree.
 * @param fn - The function to apply to each node.
 * @returns A new tree structure with the mapped values.
 */
export function treeMap(arr: TreeNode[], fn: (node: TreeNode) => TreeNode): TreeNode[] {
  return arr.map((node) => {
    const newNode = fn({ ...node }); // Apply the function to the current node
    if (node.children && node.children.length > 0) {
      newNode.children = treeMap(node.children, fn); // Recursively map children
    }
    return newNode;
  });
}
