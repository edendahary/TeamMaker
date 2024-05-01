import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';


@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
})
export class TeamsComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  Message: string = '';
  data: any;
  colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'cyan',
    'magenta',
  ];
  private apiUrl = 'http://192.168.1.112:3000/api/';
  showContext = 0;
  activeButton = 1;
  activeTeams = 3;
  colNumber = 4;
  allPlayers: Player[] = [];
  threeTeam: Player[] = [];
  teams: { team: Player[]; averageGrade: number; teamColor: string }[] = [];
  disabledButtons: boolean[] = [];
  async ngOnInit() {
    this.data = await this.getPlayers();
    this.allPlayers = this.data.map((player: Player) => {
      const { name, overall_grade } = player;
      return { name, overall_grade };
    });
    this.allPlayers.sort((a, b) => b.overall_grade - a.overall_grade);
  }
  async getPlayers(): Promise<any[]> {
    const response = await axios.get(this.apiUrl + 'players');
    return response.data;
  }

  changeColor(buttonNumber: number) {
    this.showContext = 0;
    if (buttonNumber != this.activeButton) {
      if (this.allPlayers.length == 20 && buttonNumber == 2) {
        this.activeButton = 2;
        this.activeTeams = 4;
      } else if (this.allPlayers.length == 20 && buttonNumber == 1) {
        this.activeButton = 1;
        this.activeTeams = 3;
      } else {
        this.Message = 'You dont have 20 players. Please add more';
        this.openModal();
      }
    }
  }

  openModal() {
    if (this.model != null) {
      this.model.nativeElement.style.display = 'block';
    }
  }
  closeModal() {
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }
  toggleButton(index: number) {
    this.disabledButtons[index] = !this.disabledButtons[index];
  }
  makeForamtion() {
    debugger;
    const indices = this.disabledButtons.reduce((acc: number[], el, index) => {
      if (el) {
        acc.push(index + 1);
      }
      return acc;
    }, []);
    if (this.allPlayers.length < 15) {
      this.Message = 'You dont have 15 players. Please add more';
      this.openModal();
      this.showContext = 0;
    } else if (this.allPlayers.length > 15) {
      if (
        this.activeTeams == 4 &&
        this.allPlayers.length - indices.length < 20
      ) {
        this.Message = 'You have mark too much players.';
        this.openModal();
        this.showContext = 0;
      }
      if (this.allPlayers.length - indices.length == 15) {
        // this.threeTeam = allPlayers.allPlayers.filter(obj1 => !indices.some(obj2 => obj1.id === obj2));
        this.threeTeam = this.allPlayers.filter(
          (obj1, index) => indices.indexOf(index + 1) === -1
        );
        this.SuffleFormation(this.threeTeam);
        this.showContext = 1;
      } else if (this.allPlayers.length - indices.length < 15) {
        this.Message = 'You have mark too much players.';
        this.openModal();
        this.showContext = 0;
      } else if (
        this.activeTeams == 4 &&
        this.allPlayers.length - indices.length == 20
      ) {
        this.SuffleFormation(this.allPlayers);
        this.showContext = 1;
      } else {
        if (this.activeTeams == 4) {
          this.Message = 'You have less then 20 player.';
        } else {
          this.Message =
            'You have more then 15 players for three teams. Please mark the player you dont want in the formation.';
        }

        this.openModal();
        this.showContext = 0;
      }
    } else if (this.allPlayers.length < 20 && this.activeTeams == 4) {
      this.Message = 'You dont have 20 player. Please add more';
      this.openModal();
    } else {
      if (this.allPlayers.length == 20 && this.activeTeams == 3) {
        this.Message =
          'You have 20 players for Three teams. Please mark the players you dont want or change to Four teams';
        this.openModal();
        this.showContext = 0;
      } else {
        // Initialize three empty teams
        this.SuffleFormation(this.allPlayers);
        this.showContext = 1;
      }
    }
  }

  SuffleFormation(playerArray: Player[]) {
    this.teams = Array.from({ length: this.activeTeams }, () => ({
      team: [],
      averageGrade: 0,
      teamColor: '',
    }));
    // Distribute players to teams
    let i = 0;
    let direction = 1; // 1 for ascending order, -1 for descending order
    for (const player of playerArray) {
      this.teams[i % this.activeTeams].team.push(player);
      i += direction;

      // Reverse direction if the next team would be outside the range of teams
      if (i === this.activeTeams || i === -1) {
        direction *= -1;
        i += direction;
      }
    }
    this.teams.forEach((team) => {
      const totalGrade = team.team.reduce(
        (acc, player) => acc + player.overall_grade,
        0
      );
      const averageGrade = totalGrade / team.team.length;
      team.averageGrade = parseFloat(averageGrade.toFixed(2));
    });
    this.teams.forEach((team, index) => {
      team.teamColor = this.colors[index % this.colors.length];
    });
  }
  algoSuffleFormation(playerArray: Player[]) {
    
  }
}
