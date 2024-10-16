import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogClose } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

import {FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';

import { UsuariosService } from 'src/app/Services/usuarios/usuarios.service';
import {MatSelectModule} from '@angular/material/select';
import { EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss'],
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatFormFieldModule, MatIconModule,
    MatInputModule, MatButtonModule, MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule]
})
export class DetalleUsuarioComponent  implements OnInit {

  @Output() userUpdated = new EventEmitter<void>();

  userDetailForm!: FormGroup
  changepasswordForm!: FormGroup
  positions:any

  constructor(private _formBuilder: FormBuilder, public matDialogRef: MatDialogRef<DetalleUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, public usuarioService:UsuariosService) {

      this.positions = this.usuarioService.getPosition();
     }

  ngOnInit() {

    this.userDetailForm = this._formBuilder.group({

      username: [this.data.userName || ''],
      email: [this.data.email || ''],
      name: [this.data.name || ''],
      position: [this.data.position || ''],
    })

    const positions = this.usuarioService.getPosition();
    const positionUser = this.userDetailForm.get("position")?.value;
    const formatPosition = positions.find( x => x.id === positionUser)

    this.userDetailForm.patchValue({
      position: formatPosition?.id
    })

    this.changepasswordForm = this._formBuilder.group({
      password: ['']
    })

  }

  async updateDetailUser(){

    const updatedUser:any = {

      Id: this.data.id,
      Token: this.data.token,
      Email: this.userDetailForm.get("email")?.value,
      UserName: this.userDetailForm.get("username")?.value,
      Name: this.userDetailForm.get("name")?.value,
      Position: this.userDetailForm.get("position")?.value,
      Roles: [],
      Password: this.changepasswordForm.get("password")?.value

    }

    console.log('updatedUser: ',updatedUser)

    const response = await this.usuarioService.updateUser(updatedUser);
    console.log(response)

    // Emitir evento para notificar la actualización del usuario
    this.userUpdated.emit();

    this.closeModal()
  }

  

  closeModal(){
    this.matDialogRef.close();
  }

}
