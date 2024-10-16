import { Component, OnInit, ViewChild } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';

import { IonicModule } from '@ionic/angular';

import {FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';

import { OverlayEventDetail } from '@ionic/core/components';

import { IonModal } from '@ionic/angular';

import { MatDialog } from '@angular/material/dialog';

import { UsuariosService } from '../../Services/usuarios/usuarios.service';
import { Category } from '../../Interfaces/category-equip';

import {MatSelectModule} from '@angular/material/select';

import { EquiposService } from '../../Services/equipos/equipos.service';

import { TestDetalleEquipoComponent } from './test-detalle-equipo/test-detalle-equipo.component';

@Component({
  standalone: true,
  selector: 'app-test-equipo',
  templateUrl: './test-equipo.component.html',
  styleUrls: ['./test-equipo.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatTableModule, ReactiveFormsModule, IonicModule,MatSelectModule]
})
export class TestEquipoComponent  implements OnInit {

  @ViewChild(IonModal) modalRegister!: IonModal;

  displayedColumns: string[] = ['nombre'];
  dataSource: Category[] = []

  addForm!: FormGroup

  constructor(private _formBuilder: FormBuilder, private matDialog:MatDialog, private equipos:EquiposService) {}

  ngOnInit() {

    this.loadDataEquipos();

    this.addForm = this._formBuilder.group({

      nombre: ['', Validators.required],
  
    })
    
  }

  loadDataEquipos(){
    this.dataSource = [...(this.equipos.listEquipos() || [])]
  }

  onWillDismissRegister(event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

      
    }
  }

  confirmRegister() {

    this.loadDataEquipos()

    this.modalRegister.dismiss(null,'confirm');
  }

  cancelRegister() {
    this.modalRegister.dismiss(null, 'cancel');
  }

  openModalDetalleEquipo(element:any){
    
    this.matDialog.open(TestDetalleEquipoComponent, {
      width: '99%',
      height: '96%'
    })
  }

  addEquipo(){

  }

}
