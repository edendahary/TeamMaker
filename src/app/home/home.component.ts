import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TeamsComponent } from '../teams/teams.component';
import axios from 'axios';
import { ParticleAnimationComponent } from "../particle-animation/particle-animation.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfAlt, faFire } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';



@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    RouterOutlet,
    FormsModule,
    RouterModule,
    TeamsComponent,
    ParticleAnimationComponent,
    FontAwesomeModule,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @ViewChild('myModal') model: ElementRef | undefined;
  @ViewChild('modelError') modelError: ElementRef | undefined;
  PlayerObj: Player = new Player();
  playerList: Player[] = [];
  Message: string = '';
  // private apiUrl = 'http://localhost:3000/api/';   // localhost
  private apiUrl = 'https://teammaker-5.onrender.com/api/'; // my server on render.com IP
  // private apiUrl = `https://192.168.1.112:3000/api/`; // my pc IP
  showBuffer: boolean = false;
  data: any;
  faFire = faFire;
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarEmpty = faStarEmpty;

  showHalfStar = true;

  getStarIcon(num: number, grade: number) {
    if (num <= grade) {
      return this.faStar;
    } else if (
      num > grade &&
      num < grade + 1 &&
      grade % 1 >= 0.5 &&
      this.showHalfStar
    ) {
      return this.faStarHalfAlt;
    } else {
      return this.faStarEmpty;
    }
  }

  rateStar(field: string, index: number): void {
    switch (field) {
      case 'dribbling':
      case 'shot':
      case 'pace':
      case 'pass':
      case 'accuracy':
      case 'attack':
      case 'defense':
        debugger;
        this.PlayerObj[field] =
          index + 0.5 <= this.PlayerObj[field] ? index + 1 : index + 0.5;
        break;
    }
  }

  async ngOnInit() {
    this.showBuffer = true;
    this.data = await this.getPlayers();
    this.showBuffer = false;
  }

  async refreshePage() {
    this.showBuffer = true;

    this.data = await this.getPlayers();
    this.showBuffer = false;
  }
  async getPlayers(): Promise<any[]> {
    const response = await axios.get(this.apiUrl + 'players');
    return response.data;
  }

  async addPlayer(player: any): Promise<any> {
    const response = await axios.post(this.apiUrl + 'players', player);
    if (response.status == 201) {
      this.refreshePage();
    }
  }
  async updatePlayer(player: any): Promise<any> {
    this.showBuffer = true;
    player.overall_grade = this.playerTotalAverage();
    const response = await axios.put(
      `${this.apiUrl}updateplayer/${player._id}`,
      player
    );
    if (response.status == 200) {
      this.closeModel();
    }
    this.showBuffer = false;
  }
  async deletePlayer(player: any): Promise<any> {
    const response = await axios.delete(
      this.apiUrl + `deleteplayer/${player._id}`
    );
    if (response.status == 201) {
      alert('player Deleted!');
      this.refreshePage();
    }
  }

  openModal() {
    if (this.model != null) {
      this.model.nativeElement.style.display = 'block';
    }
  }
  closeModel() {
    this.PlayerObj = new Player();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }
  errorMessage() {
    this.Message = 'Validation is required!';
    this.openError();
  }
  openError() {
    if (this.modelError != null) {
      this.modelError.nativeElement.style.display = 'block';
    }
  }
  closeError() {
    if (this.modelError != null) {
      this.modelError.nativeElement.style.display = 'none';
    }
  }
  onEdit(item: Player) {
    this.PlayerObj = item;
    this.openModal();
  }
  onDelete(item: Player) {
    const isDelete = confirm('Are you sure you want to Delete');
    if (isDelete) {
      this.deletePlayer(item);
    }
  }
  playerTotalAverage() {
    return parseFloat(
      (
        (this.PlayerObj.accuracy +
          this.PlayerObj.dribbling +
          this.PlayerObj.pace +
          this.PlayerObj.pass +
          this.PlayerObj.shot +
          this.PlayerObj.attack +
          this.PlayerObj.defense) /
        7
      ).toFixed(2)
    );
  }

  async savePlayer() {
    this.showBuffer = true;
    this.PlayerObj.overall_grade = this.playerTotalAverage();

    const newPlayer = await this.addPlayer(this.PlayerObj);
    if (newPlayer) {
      alert('New player added');
    }
    this.closeModel();
    this.showBuffer = false;
  }
}

export class Player {
  _id: number | undefined;
  name!: string;
  mobile!: string;
  shot!: number;
  pass!: number;
  accuracy!: number;
  pace!: number;
  dribbling!: number;
  overall_grade: number;
  attack!: number;
  defense!: number;
  marked: any;
  hovered: boolean;
  constructor() {
    this.overall_grade = 0;
    this.hovered = true;
  }
}
