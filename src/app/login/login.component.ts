import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('VerificationModal') model: ElementRef | undefined;
  @ViewChild('modelError') modelError: ElementRef | undefined;
  // private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://teammaker-5.onrender.com';
  // private apiUrl = `https://192.168.1.112:3000`

  isRegister: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  verificationCode: string = '';
  Message: string = '';
  isLogin: boolean = false;
  showBuffer: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async getUserByEmail() {
    const response = await axios.get(`${this.apiUrl}/api/user/${this.email}`);
    return response.data;
  }
  async getUsers() {
    const response = await axios.get(`${this.apiUrl}/api/users`);
    return response.data;
  }
  async updateUser(user: any) {
    const response = await axios.put(
      `${this.apiUrl}/api/updateuser/${user.email}`,
      user
    );
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
  }

  async login() {
    this.showBuffer = true;
    const user = await this.getUserByEmail();
    if (user) {
      if (
        user.email === this.email &&
        user.password === this.password &&
        user.userverify === true
      ) {
        user.isLogin = true;
        const userLogedIn = await this.updateUser({ user });
        this.authService.setIsLoggedIn(true); // Set user as logged in
        this.router.navigateByUrl('');
      } else {
        this.Message = 'Email or Password are incorrect. Please try again.';
        this.openError();
      }
    } else {
      this.Message = 'Email or Password are incorrect. Please try again.';
      this.openError();
    }
    this.email = '';
    this.password = '';
    this.showBuffer = false;
  }

  async sendMailVerificationCode(): Promise<any[]> {
    const response = await axios.post(this.apiUrl + '/sendVerificationCode', {
      name: this.name,
      email: this.email,
      password: this.password,
    });
    return response.data;
  }
  async register() {
    const verify = await this.sendMailVerificationCode();
    if (verify) {
      this.openModal();
    } else {
      this.openError();
      this.Message = 'This email already in use try a another one.';
    }
  }
  async VerificationCode() {
    const user = await this.getUserByEmail();
    if (user && user.verification === this.verificationCode) {
      alert('user Created!');
      this.closeModal();
      user.userverify = true;
      const updateNewUser = await this.updateUser(user);
      this.toggleForm();
      this.name = '';
      this.email = '';
      this.password = '';
    } else {
      alert('Verification Code is invaild');
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
}
