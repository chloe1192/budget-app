import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, User } from 'src/app/services/api';

@Component({
  standalone: false,
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      avatar: [null],
    })
  }

  ngOnInit() {
    this.api.fetchUser().subscribe((user: User) => {
      this.userForm.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email
      });
    });
  }

}
