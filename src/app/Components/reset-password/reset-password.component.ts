import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogClose } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatIconModule, 
    MatInputModule, MatButtonModule]
})
export class ResetPasswordComponent  implements OnInit {

  constructor(public matDialogRef: MatDialogRef<ResetPasswordComponent>) { }

  ngOnInit() {}

  closeModal(){
    this.matDialogRef.close();
  }

}
