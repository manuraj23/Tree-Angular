import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TreeViewComponent } from './tree-view/tree-view';

import { TreeNode } from './treeModel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, TreeViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  selectedNode: TreeNode | null = null;

  newNodeName = '';

  private nextNodeId = 13;

  treeData: TreeNode[] = [
    {
      id: '1',
      name: 'my-app',
      type: 'folder',

      children: [
        {
          id: '2',
          name: 'src',
          type: 'folder',

          children: [
            {
              id: '3',
              name: 'components',
              type: 'folder',

              children: [
                {
                  id: '4',
                  name: 'header.component.ts',
                  type: 'file'
                },
                {
                  id: '5',
                  name: 'button.component.ts',
                  type: 'file'
                }
              ]
            },

            {
              id: '6',
              name: 'assets',
              type: 'folder',
              children: []
            },

            {
              id: '7',
              name: 'main.ts',
              type: 'file'
            },

            {
              id: '8',
              name: 'app.component.ts',
              type: 'file'
            }
          ]
        },

        {
          id: '9',
          name: 'public',
          type: 'folder',

          children: [
            {
              id: '10',
              name: 'favicon.ico',
              type: 'file'
            }
          ]
        },

        {
          id: '11',
          name: 'package.json',
          type: 'file'
        },

        {
          id: '12',
          name: 'README.md',
          type: 'file'
        }
      ]
    }
  ];


  onNodeSelected(node: TreeNode): void {
    this.selectedNode = node;
  }


  onNodeToggled(event: {
    node: TreeNode;
    expanded: boolean;
  }): void {

    console.log(
      `${event.node.name} ${
        event.expanded
          ? 'expanded'
          : 'collapsed'
      }`
    );
  }

  addNode(type: TreeNode['type']): void {
    const name = this.newNodeName.trim();

    if (!name) {
      return;
    }

    const newNode: TreeNode = {
      id: String(this.nextNodeId++),
      name,
      type,
      ...(type === 'folder' ? { children: [] } : {})
    };

    const destinationId = this.selectedNode?.type === 'folder'
      ? this.selectedNode.id
      : this.findParentId(this.treeData, this.selectedNode?.id);

    if (destinationId) {
      this.treeData = this.addToFolder(this.treeData, destinationId, newNode);
    } else {
      this.treeData = [...this.treeData, newNode];
    }

    this.newNodeName = '';
  }

  private addToFolder(nodes: TreeNode[], folderId: string, newNode: TreeNode): TreeNode[] {
    return nodes.map(node => {
      if (node.id === folderId && node.type === 'folder') {
        return {
          ...node,
          children: [...(node.children ?? []), newNode]
        };
      }

      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: this.addToFolder(node.children, folderId, newNode)
        };
      }

      return node;
    });
  }

  private findParentId(nodes: TreeNode[], childId: string | undefined): string | undefined {
    if (!childId) {
      return undefined;
    }

    for (const node of nodes) {
      if (node.type !== 'folder' || !node.children) {
        continue;
      }

      if (node.children.some(child => child.id === childId)) {
        return node.id;
      }

      const parentId = this.findParentId(node.children, childId);
      if (parentId) {
        return parentId;
      }
    }

    return undefined;
  }
}