import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthService } from "../../services/auth.service";
import { DatamediatorpostsService } from '../../services/datamediator/datamediatorposts.service';

import { User } from "../../models/User";

import { MenuComponent } from './menu/menu.component';
import { WallComponent } from './wall/wall.component';
import { FullpostComponent } from './fullpost/fullpost.component';
 
@Component({
  selector: "app-posts",
  standalone: true,
  imports: [CommonModule, MenuComponent, WallComponent, FullpostComponent],
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"]
})
export class PostsComponent implements OnInit {
  userId!: number;

  constructor(
    private authService: AuthService,
    private datamediatorpostsService: DatamediatorpostsService) {}

  ngOnInit(): void {
    this.authService.getUserIdFromToken2Num().subscribe((id: any) => {
      this.userId = +id;
    });
  }
}