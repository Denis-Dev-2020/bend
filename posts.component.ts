import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Observable, EMPTY, forkJoin, of, fromEvent, Subject } from "rxjs";
import { switchMap, catchError, take, concatMap, debounceTime, map } from 'rxjs/operators';

import { CreatepostComponent } from "../createpost/createpost.component";
import { MenuComponent } from "./menu/menu.component";

import { ComprouterService } from "../../services/comprouter/comprouter.service";
import { PostService } from "../../services/post.service";
import { AuthService } from "../../services/auth.service";
import { PostsfeedbackService } from "../../services/postsfeedback.service";

import { Post } from "../../models/Post";
import { User } from "../../models/User";
import { Postfeedback } from "../../models/Postfeedback";
import { Userpostfeedback } from "../../models/Userpostfeedback";

@Component({
  selector: "app-posts",
  standalone: true,
  imports: [CreatepostComponent, CommonModule, MenuComponent],
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  private fetchFeedbackSubject = new Subject<void>();
  private fetchUserFeedbackSubject = new Subject<void>();
  posts_feedback: Postfeedback[] = [];
  user_posts_feedback: Userpostfeedback[] = [];
  posts$: Observable<Post[]> = EMPTY;
  userId?: Pick<User, "id">;
  selectedPost?: Post;
  isCreatePostOpen = false;
  isDeleteConfirmationOpen = false;
  selectedPostForDeletion?: Post;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private postfeedbackService: PostsfeedbackService,
    private comprouterService: ComprouterService,
  ) {}
  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.posts$ = this.postService.fetchAll();
    this.posts$.subscribe((posts) => {
      if (posts.length > 0 && posts != null) {
        this.selectedPost = posts[posts.length - 1];
      }
    });
    this.fetchFeedbackSubject.pipe(
      debounceTime(300),
      concatMap(() => this.postfeedbackService.fetchAll())
    ).subscribe((feedbackData: any) => {this.posts_feedback = feedbackData;},
      (error: any) => {console.error("Error fetching feedback data:", error);this.posts_feedback = [];}
    );
    this.fetchUserFeedbackSubject.pipe(
      debounceTime(300),
      concatMap(() => this.postfeedbackService.userfetchAll(Number(this.userId)))
    ).subscribe((userFeedbackData: any) => {this.user_posts_feedback = userFeedbackData;},
      (error: any) => {console.error("Error fetching user feedback data:", error);this.user_posts_feedback = [];}
    );
    this.fetchFeedbackSubject.next();
    this.fetchUserFeedbackSubject.next();
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Post basic operations Start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  fetchAll(): Observable<Post[]> {
    this.posts$ = this.postService.fetchAll();
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
      concatMap(() => this.postfeedbackService.userfetchAll(Number(this.userId)))
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
    this.postService.deletePost(postId).subscribe(() => {
      this.posts$ = this.postService.fetchAll();
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
      .deleteFeedback(Number(this.userId), postId)
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  removeFeedbackCreatePositiveFeedback(postId: number): void {
    this.postfeedbackService
      .deleteFeedback(Number(this.userId), postId)
      .subscribe(() => this.createPositiveFeedback(postId));
  }
  removeFeedbackCreateNegativeFeedback(postId: number): void {
    this.postfeedbackService
      .deleteFeedback(Number(this.userId), postId)
      .subscribe(() => this.createNegativeFeedback(postId));
  }
  createPositiveFeedback(postId: number): void {
    this.postfeedbackService
      .createFeedback(Number(this.userId), postId, true)
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  createNegativeFeedback(postId: number): void {
    this.postfeedbackService
      .createFeedback(Number(this.userId), postId, false)
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Feedback End ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}