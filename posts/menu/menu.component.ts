import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { postsMenuItem } from '../../../models/postsMenuItem';
import { postsSubMenuObject } from '../../../models/postsSubMenuObject';

import { PostsmenuService } from '../../../services/json/postsmenu.service';
import { DatamediatorpostsService } from '../../../services/datamediator/datamediatorposts.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements AfterViewInit, OnInit {
  menuHidden = false;
  menu: postsMenuItem[] = [];
  expandedItems: { [key: string]: boolean } = {};
  selectedTopic?: string;
  selectedSubtopic?: string;

  constructor(
    private postsmenuService: PostsmenuService,
    private datamediatorpostsService: DatamediatorpostsService
    ) {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  ngAfterViewInit() {
    const toggleButton = document.querySelector('.toggle-button');
    if (toggleButton) {
      toggleButton.classList.add('show');
    }
  }

  ngOnInit() {
    this.postsmenuService.getMenuData().subscribe(
      data => {
        this.postsmenuService.menuData = data;
      },
      error => {
        console.error('Error loading menu:', error.message);
      }
    );
    this.postsmenuService.getMenu().subscribe(
      data => {
        this.menu = data.menu;
      },
      error => {
        console.error('Error loading menu:', error.message);
      }
    );
  }

  sanitizeId(id: number): string {
    return id.toString();
  }

  isExpanded(id: string): boolean {
    return !!this.expandedItems[id];
  }

  toggleItem(id: string): void {
    this.expandedItems[id] = !this.expandedItems[id];
  }

  isSubMenuObject(item: any): item is postsSubMenuObject {
    return (item as postsSubMenuObject).topic_id !== undefined;
  }

  getTitleByCategoryId(category_id: number): string | undefined {
    return this.postsmenuService.getTitleByCategoryId(category_id);
  }

  setCategory(category_id: number): void {
    // console.log(this.postsmenuService.getNameByCategoryId(category_id)); 
  }

  selectTopic(topic_id: number): void {
    //this.selectedTopic = topic_id;
    const topicName = this.postsmenuService.getNameByCategoryId(topic_id) || '';
    this.datamediatorpostsService.setSelectedTopic(topicName);
  }

  selectSubtopic(subtopic_id: number): void {
    //this.selectedSubtopic = subtopic_id;
    const subtopicName = this.postsmenuService.getNameByCategoryId(subtopic_id) || '';
    this.datamediatorpostsService.setSelectedSubTopic(subtopicName);
  }

}