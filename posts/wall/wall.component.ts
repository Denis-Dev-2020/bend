import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Observable, Subscription, EMPTY, forkJoin, of, fromEvent, combineLatest, Subject } from "rxjs";
import { switchMap, catchError, take, concatMap, debounceTime, map } from 'rxjs/operators';

import { CreatepostComponent } from "../../createpost/createpost.component";

import { PostsreloadService } from '../../../services/reload/postsreload.service';
import { ComprouterService } from "../../../services/comprouter/comprouter.service";
import { PostService } from "../../../services/post.service";
import { AuthService } from "../../../services/auth.service";
import { PostsfeedbackService } from "../../../services/postsfeedback.service";
import { DatamediatorpostsService } from '../../../services/datamediator/datamediatorposts.service';

import { Post } from "../../../models/Post";
import { User } from "../../../models/User";
import { Postfeedback } from "../../../models/Postfeedback";
import { Userpostfeedback } from "../../../models/Userpostfeedback";

@Component({
  selector: "app-wall",
  standalone: true,
  imports: [CreatepostComponent, CommonModule],
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.css"],
})
export class WallComponent implements OnInit {
  @Input() userId!: number;
 
  private reloadSubscription: Subscription | null = null;
 
  private fetchFeedbackSubject = new Subject<void>();
  private fetchUserFeedbackSubject = new Subject<void>();
  posts_feedback: Postfeedback[] = [];
  user_posts_feedback: Userpostfeedback[] = [];
  posts$: Observable<Post[]> = EMPTY;
  selectedPost?: Post;
  isCreatePostOpen = false;
  isDeleteConfirmationOpen = false;
  selectedPostForDeletion?: Post;

  selectedTopic?: number = 785923274;
  selectedSubtopic?: number = 847362948;
 
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private postfeedbackService: PostsfeedbackService,
    private comprouterService: ComprouterService,
    private datamediatorpostsService: DatamediatorpostsService,
    private postsreloadService: PostsreloadService,
  ) {
    // this.datamediatorpostsService.getSelectedTopic$().subscribe(topic => {
    //   if (topic != null) {
    //     this.selectedTopic = topic;
    //     this.datamediatorpostsService.getSelectedSubTopic$().subscribe(subtopic => {
    //       if (subtopic != null) {
    //         this.selectedSubtopic = subtopic;
    //       }
    //     });
    //   }
    // });
  } 

  ngOnInit(): void {
  this.reloadSubscription = this.postsreloadService.reload$.subscribe(() => {
    combineLatest([
      this.datamediatorpostsService.getSelectedTopic$().pipe(take(1)),
      this.datamediatorpostsService.getSelectedSubTopic$().pipe(take(1))
    ]).pipe(
      switchMap(([topic, subtopic]: [number | null, number | null]) => {
        if (topic != null && subtopic != null) {
          this.selectedTopic = topic;
          this.selectedSubtopic = subtopic;
          return this.postService.fetchAll(this.selectedTopic, this.selectedSubtopic);
        }
        return EMPTY;
      })
    ).subscribe((posts) => {
      this.posts$ = of(posts); // Assign posts$ here
      if (posts.length > 0 && posts != null) {
        this.selectPost(posts[0]);
      }
    });

    this.fetchFeedbackSubject.pipe(
      debounceTime(300),
      switchMap(() => this.postfeedbackService.fetchAll())
    ).subscribe((feedbackData: any) => {
      this.posts_feedback = feedbackData;
    }, (error: any) => {
      console.error("Error fetching feedback data:", error);
      this.posts_feedback = [];
    });

    this.fetchUserFeedbackSubject.pipe(
      debounceTime(300),
      switchMap(() => this.postfeedbackService.userfetchAll(this.userId))
    ).subscribe((userFeedbackData: any) => {
      this.user_posts_feedback = userFeedbackData;
    }, (error: any) => {
      console.error("Error fetching user feedback data:", error);
      this.user_posts_feedback = [];
    });

    this.fetchFeedbackSubject.next();
    this.fetchUserFeedbackSubject.next();
  });

  } 
  ngOnDestroy(): void {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post basic operations Start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  fetchAll(): Observable<Post[]> {
    this.posts$ = this.postService.fetchAll(this.selectedTopic!,this.selectedSubtopic!);
    setTimeout(() => {
      document.dispatchEvent(new Event('fetchFeedback'));
    }, 300);
    setTimeout(() => {
      document.dispatchEvent(new Event('fetchUserFeedback'));
    }, 600);
    fromEvent(document, 'fetchFeedback').pipe(
      debounceTime(300),
      concatMap(() => this.postfeedbackService.fetchAll())
    ).subscribe(
      (feedbackData) => {
        this.posts_feedback = feedbackData;
      },
      (error) => {
        console.error("Error fetching feedback data:", error);
        this.posts_feedback = [];
      }
    );
    fromEvent(document, 'fetchUserFeedback').pipe(
      debounceTime(300),
      concatMap(() => this.postfeedbackService.userfetchAll(this.userId))  // Update this line
    ).subscribe(
      (userFeedbackData) => {
        this.user_posts_feedback = userFeedbackData;
      },
      (error) => {
        console.error("Error fetching user feedback data:", error);
        this.user_posts_feedback = [];
      }
    );
    return this.posts$;
  }
  createPost(): void {
    this.posts$ = this.fetchAll();
  }
  delete(postId: number): void {
    this.postService.deletePost(this.selectedTopic!,this.selectedSubtopic!,postId).subscribe(() => {
      this.posts$ = this.postService.fetchAll(this.selectedTopic!,this.selectedSubtopic!);
    });
  }
  get userIdNumber(): number | undefined {
    return Number(this.userId);
  }
  toNumber(value: number | undefined): number {
    return value ? Number(value) : NaN;
  }
  selectPost(post: Post): void {
    this.selectedPost = post;
    this.datamediatorpostsService.setSelectedPostId(post.id);
  }
  openCreatePost(): void {
    this.isCreatePostOpen = true;
  }
  closeCreatePost(): void {
    this.isCreatePostOpen = false;
  }
  closeCreatePostAndRefresh(): void {
    this.isCreatePostOpen = false;
    this.comprouterService.reloadComponentDestOnly('posts');
  }
  openDeleteConfirmation(post: Post): void {
    this.selectedPostForDeletion = post;
    this.isDeleteConfirmationOpen = true;
  }
  closeDeleteConfirmation(): void {
    this.selectedPostForDeletion = undefined;
    this.isDeleteConfirmationOpen = false;
    this.comprouterService.reloadComponentDestOnly('posts');
  }
  confirmDelete(): void {
    if (this.selectedPostForDeletion) {
      this.delete(this.selectedPostForDeletion.id);
      this.closeDeleteConfirmation();
      this.comprouterService.reloadComponentDestOnly('posts');
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post basic operations End ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Feedback Start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getFeedbackCount(
    postId: number,
    feedbackType: "feedback_type_true_count" | "feedback_type_false_count"
  ): number {
    const postFeedback = this.posts_feedback.find(
      (feedback) => feedback.post_id === postId
    ) as any;
    return postFeedback ? postFeedback[feedbackType] : 0;
  }
  isFeedbackActive(postId: number, feedbackType: boolean): boolean {
    const userFeedback = this.user_posts_feedback.find(
      (feedback) => feedback.post_id === postId
    );
    return userFeedback ? userFeedback.feedback_type === feedbackType : false;
  }
  removeFeedback(postId: number): void {
    this.postfeedbackService
      .deleteFeedback(this.userId, postId)  // Update this line
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  removeFeedbackCreatePositiveFeedback(postId: number): void {
    this.postfeedbackService
      .deleteFeedback(this.userId, postId)  // Update this line
      .subscribe(() => this.createPositiveFeedback(postId));
  }
  removeFeedbackCreateNegativeFeedback(postId: number): void {
    this.postfeedbackService
      .deleteFeedback(this.userId, postId)  // Update this line
      .subscribe(() => this.createNegativeFeedback(postId));
  }
  createPositiveFeedback(postId: number): void {
    this.postfeedbackService
      .createFeedback(this.userId, postId, true)  // Update this line
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  createNegativeFeedback(postId: number): void {
    this.postfeedbackService
      .createFeedback(this.userId, postId, false)  // Update this line
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Feedback End ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
