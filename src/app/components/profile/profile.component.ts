import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: {
    name: string,
    email: string,
    provider: string
  } = {
    name: '',
    email: '',
    provider: ''
  };

  constructor (
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.api.profile().subscribe(
      data => this.handleProfile(data),
      error => console.log(error)
    )
  }

  handleProfile(user: any){
    this.user = {
      name: user.name,
      email: user.email,
      provider: user.provider.charAt(0).toUpperCase() + user.provider.slice(1)
    }
  }

}
