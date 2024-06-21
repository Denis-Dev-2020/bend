import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PostService } from "../../../services/post.service";
import { DatamediatorpostsService } from '../../../services/datamediator/datamediatorposts.service';

import { Post } from "../../../models/Post";

@Component({
  selector: 'app-fullpost',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fullpost.component.html',
  styleUrl: './fullpost.component.css'
})
export class FullpostComponent {
  selectedPost?: Post;
  constructor(
    private datamediatorpostsService: DatamediatorpostsService,
    private postService: PostService,
  ) {
      this.datamediatorpostsService.getSelectedPostId$().subscribe(id => {
        if (id != null) {
          this.postService.fetchOne(id).subscribe(data => {
            this.selectedPost = data;
          });
        }
      });
  }
} 
   