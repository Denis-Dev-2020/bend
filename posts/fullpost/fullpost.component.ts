import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from "@angular/common";
import { combineLatest, Subscription, of, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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
export class FullpostComponent implements OnDestroy {
  selectedPost?: Post;
  private subscription?: Subscription;

  constructor(
    private datamediatorpostsService: DatamediatorpostsService,
    private postService: PostService,
  ) {
    this.subscription = combineLatest([
      this.datamediatorpostsService.getSelectedPostId$(),
      this.datamediatorpostsService.getSelectedTopic$(),
      this.datamediatorpostsService.getSelectedSubTopic$()
    ]).pipe(
      switchMap(([id, topic, subtopic]: [number | null, number | null, number | null]) => {
        if (id != null && topic != null && subtopic != null) {
          return this.fetchOne(topic, subtopic, id);
        }
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.selectedPost = data;
      } else {
        this.selectedPost = undefined; // Reset selectedPost if no data is returned
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchOne(topic: number, subtopic: number, id: number): Observable<Post | null> {
    return this.postService.fetchOne(topic, subtopic, id).pipe(
      catchError(() => of(null))
    );
  }
}
