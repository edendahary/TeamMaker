import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Player } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { Tooltip } from 'bootstrap';

import {
  faStar,
  faStarHalfAlt,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
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
  faFire = faFire;
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarEmpty = faStarEmpty;

  showHalfStar = true;
  // private apiUrl = 'http://localhost:3000/api/'; // Local IP
  // private apiUrl = `https://192.168.1.112:3000/api/`; // my PC IP
  private apiUrl = 'https://teammaker-5.onrender.com/api/'; // render.com own server IP
  showBuffer: boolean = false;
  showContext = 0;
  activeButton = 1;
  activeTeams = 3;
  counter = 1;
  colNumber = 4;
  allPlayers: Player[] = [];
  threeTeam: Player[] = [];

  fourTeam: Player[] = [];
  allTeams: any;
  teams: { team: Player[]; averageGrade: number; teamColor: string }[] = [];
  disabledButtons: boolean[] = [];
  async ngOnInit() {
    this.showBuffer = true;
    this.data = await this.getPlayers();
    this.allPlayers = this.data.map((player: Player) => {
      const { name, overall_grade } = player;
      return { name, overall_grade };
    });
    this.allPlayers.sort((a, b) => b.overall_grade - a.overall_grade);
    this.showBuffer = false;
  }
  async getPlayers(): Promise<any[]> {
    const response = await axios.get(this.apiUrl + 'players');
    return response.data;
  }

  changeColor(buttonNumber: number) {
    this.showContext = 0;
    if (buttonNumber != this.activeButton) {
      if (this.allPlayers.length >= 20 && buttonNumber == 2) {
        this.activeButton = 2;
        this.activeTeams = 4;
      } else if (buttonNumber == 1) {
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
    this.showBuffer = true;
    const indices = this.disabledButtons.reduce((acc: number[], el, index) => {
      if (el) {
        acc.push(index + 1);
      }
      return acc;
    }, []);

    if (this.activeTeams == 4) {
      if (this.allPlayers.length - indices.length < 20) {
        this.Message = 'You have mark too much players.';
        this.openModal();
        this.showContext = 0;
      } else if (this.allPlayers.length - indices.length > 20) {
        this.Message =
          'You have more then 20 players for four teams. Please mark the players you dont want in your formation.';
        this.openModal();
        this.showContext = 0;
      } else {
        this.fourTeam = this.allPlayers.filter(
          (obj1, index) => indices.indexOf(index + 1) === -1
        );
        // this.SuffleFormation(this.threeTeam);
        this.allTeams = this.algoSuffleFormation(this.fourTeam);
        this.teams = this.allTeams[0];
        this.showContext = 1;
      }
    } else {
      // this.activeTeams == 3

      if (this.allPlayers.length < 15) {
        this.Message = 'You dont have 15 players. Please add more';
        this.openModal();
        this.showContext = 0;
      } else if (this.allPlayers.length - indices.length < 15) {
        this.Message = 'You have mark too much players.';
        this.openModal();
        this.showContext = 0;
      } else if (this.allPlayers.length - indices.length > 15) {
        this.Message =
          'You have more then 15 players for three teams. Please mark the players you dont want in your formation.';
        this.openModal();
        this.showContext = 0;
      } else {
        this.threeTeam = this.allPlayers.filter(
          (obj1, index) => indices.indexOf(index + 1) === -1
        );
        this.allTeams = this.algoSuffleFormation(this.threeTeam);
        this.teams = this.allTeams[0];
        this.showContext = 1;
      }
    }

    this.showBuffer = false;
  }

  // SuffleFormation(playerArray: Player[]) {
  //   this.teams = Array.from({ length: this.activeTeams }, () => ({
  //     team: [],
  //     averageGrade: 0,
  //     teamColor: '',
  //   }));
  //   // Distribute players to teams
  //   let i = 0;
  //   let direction = 1; // 1 for ascending order, -1 for descending order
  //   for (const player of playerArray) {
  //     this.teams[i % this.activeTeams].team.push(player);
  //     i += direction;

  //     // Reverse direction if the next team would be outside the range of teams
  //     if (i === this.activeTeams || i === -1) {
  //       direction *= -1;
  //       i += direction;
  //     }
  //   }
  //   this.teams.forEach((team) => {
  //     const totalGrade = team.team.reduce(
  //       (acc, player) => acc + player.overall_grade,
  //       0
  //     );
  //     const averageGrade = totalGrade / team.team.length;
  //     team.averageGrade = parseFloat(averageGrade.toFixed(2));
  //   });
  //   this.teams.forEach((team, index) => {
  //     team.teamColor = this.colors[index % this.colors.length];
  //   });
  // }

  // Shuffle array helper function
  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Algo to shuffle teams
  private algoSuffleFormation(playerArray: Player[]) {
    const teamFormations = [];

    const numberOfFormationsToGenerate = 3;
    // Generate multiple team formations
    for (
      let formationIndex = 0;
      formationIndex < numberOfFormationsToGenerate;
      formationIndex++
    ) {
      const teams: {
        team: Player[];
        averageGrade: number;
        teamColor: string;
      }[] = Array.from({ length: this.activeTeams }, () => ({
        team: [],
        averageGrade: 0,
        teamColor: '',
      }));
      let i = 0;
      let direction = 1;

      const shuffledPlayers = this.shuffle(playerArray); // Shuffle the player array

      for (const player of shuffledPlayers) {
        teams[i % this.activeTeams].team.push(player);
        i += direction;

        if (i === this.activeTeams || i === -1) {
          direction *= -1;
          i += direction;
        }
      }

      teams.forEach((team) => {
        const totalGrade = team.team.reduce(
          (acc, player) => acc + player.overall_grade,
          0
        );
        team.averageGrade = parseFloat(
          (totalGrade / team.team.length).toFixed(2)
        );
      });

      teams.forEach((team, index) => {
        team.teamColor = this.colors[index % this.colors.length];
      });

      teamFormations.push(teams);
    }
    return teamFormations;
  }
  refreshForamtion() {
    this.teams = this.allTeams[this.counter];
    this.counter++;
    if (this.counter >= this.allTeams.length) {
      this.counter = 0;
    }
  }

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
}
interface Team {
  team: Player[];
  totalGrade: number;
  teamColor: string;
}
