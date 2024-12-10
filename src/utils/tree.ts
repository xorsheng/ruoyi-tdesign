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

export function buildTree<T extends Record<string, any>>(
  source: readonly T[],
  idKey: keyof T,
  parentKey: keyof T,
  childrenKey: keyof T,
): T[] {
  const map: Readonly<Record<string, T & { [childrenKey: string]: T[] }>> = Object.freeze(
    source.reduce(
      (acc, item) => {
        return {
          ...acc,
          [item[idKey]]: { ...item, [childrenKey]: [] },
        };
      },
      {} as Record<string, T & { [childrenKey: string]: T[] }>,
    ),
  );

  return source.reduce<T[]>((acc, item) => {
    const parentId = item[parentKey];
    const currentNode = map[item[idKey]];

    if (parentId === 0 || parentId === '0') {
      // 根节点
      return [...acc, currentNode];
    }
    if (map[parentId]) {
      // 如果存在父节点，给它添加子节点
      map[parentId][childrenKey].push(currentNode);
    }

    return acc;
  }, []);
}
