import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TeamsComponent } from '../teams/teams.component';
import axios from 'axios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterModule, TeamsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  @ViewChild('modelError') modelError: ElementRef | undefined;
  PlayerObj: Player = new Player();
  playerList: Player[] = [];
  Message: string = '';
  // private apiUrl = 'http://localhost:3000/api/';
  private apiUrl = 'https://teammaker-5.onrender.com/api/';

  // private apiUrl = `https://192.168.1.112:3000/api/`;

  data: any;

  async ngOnInit() {
    // const localData = localStorage.getItem('angular17crud');
    this.data = await this.getPlayers();
    // if (localData != null) {
    //   this.playerList = JSON.parse(localData);
    // }
  }
  async refreshePage() {
    this.data = await this.getPlayers();
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
    player.overall_grade = this.playerTotalAverage();
    const response = await axios.put(
      `${this.apiUrl}/updateplayer/${player._id}`,
      player
    );
    if (response.status == 200) {
      this.closeModel();
    }
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
    debugger;
    this.PlayerObj = item;
    this.openModal();
  }
  onDelete(item: Player) {
    const isDelete = confirm('Are you sure you want to Delete');
    if (isDelete) {
      this.deletePlayer(item);
    }
    // if (isDelete) {
    //   const currentRecord = this.playerList.findIndex((m) => m.id === item.id);
    //   this.playerList.splice(currentRecord, 1);
    //   localStorage.setItem('angular17crud', JSON.stringify(this.playerList));
    // }
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
    this.PlayerObj.overall_grade = this.playerTotalAverage();
    const newPlayer = await this.addPlayer(this.PlayerObj);
    if (newPlayer) {
      alert('New player added');
    }
    this.closeModel();
  }
}

export class Player {
  _id: number | undefined;
  name!: string;
  mobile!: string;
  city!: string;
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
