import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-particle-animation',
  standalone: true,
  imports: [],
  templateUrl: './particle-animation.component.html',
  styleUrl: './particle-animation.component.css',
})
export class ParticleAnimationComponent implements OnInit {
  particles: number[] = Array(50).fill(0);

  constructor() {}

  ngOnInit(): void {}
}
