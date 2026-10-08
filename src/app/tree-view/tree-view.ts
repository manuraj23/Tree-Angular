import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { TreeNode } from '../treeModel';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeView implements OnChanges {

  @Input({ required: true })
  data: TreeNode[] = [];

  @Input()
  defaultExpandedIds: string[] = [];

  @Output()
  nodeSelect = new EventEmitter<TreeNode>();

  @Output()
  nodeToggle = new EventEmitter<{
    node: TreeNode;
    expanded: boolean;
  }>();

  expandedIds = new Set<string>();

  selectedId: string | null = null;

  sortedData: TreeNode[] = [];

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data']) {
      this.sortedData = this.sortTree(this.data);
    }

    if (changes['defaultExpandedIds']) {
      this.expandedIds = new Set(this.defaultExpandedIds);
    }
  }

  private sortTree(nodes: TreeNode[]): TreeNode[] {

    return [...nodes]
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: 'base'
          }
        );
      })
      .map(node => {
        if (
          node.type === 'folder' &&
          node.children
        ) {
          return {
            ...node,
            children: this.sortTree(node.children)
          };
        }
        return node;
      });
  }

  isExpanded(node: TreeNode): boolean {
    return this.expandedIds.has(node.id);
  }

  toggle(node: TreeNode): void {

    if (node.type !== 'folder') {
      return;
    }

    const currentlyExpanded =
      this.expandedIds.has(node.id);

    const updatedIds =
      new Set(this.expandedIds);

    if (currentlyExpanded) {
      updatedIds.delete(node.id);

    } else {
      updatedIds.add(node.id);
    }

    this.expandedIds = updatedIds;
    this.nodeToggle.emit({
      node,
      expanded: !currentlyExpanded
    });
  }
  select(node: TreeNode): void {
    this.selectedId = node.id;
    this.nodeSelect.emit(node);
  }

  isSelected(node: TreeNode): boolean {
    return this.selectedId === node.id;
  }
}
export { TreeView as TreeViewComponent };