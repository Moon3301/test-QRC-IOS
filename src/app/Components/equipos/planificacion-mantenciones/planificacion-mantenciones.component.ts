import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { MaintenanceStatusOption, MaintenanceFilter, MaintenancePagination, MaintenanceFilterPagination} from 'src/app/Interfaces/maintenance';
import { Equipment, equipmentCalendarOptions, priorityOptions, shiftOptions } from 'src/app/Interfaces/equipment';
import { MantencionesService } from 'src/app/Services/mantenciones/mantenciones.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';
import { EquipmentService } from 'src/app/Services/equipment/equipment.service';
import { CategoryService } from 'src/app/Services/category/category.service';
import { OrganizationService } from 'src/app/Services/organization/organization.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';

import { OverlayEventDetail } from '@ionic/core/components';

import {MatDatepickerModule} from '@angular/material/datepicker';

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  selector: 'app-planificacion-mantenciones',
  templateUrl: './planificacion-mantenciones.component.html',
  styleUrls: ['./planificacion-mantenciones.component.scss'],
  imports: [IonicModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule,MatSelectModule, MatPaginatorModule, FormsModule, ReactiveFormsModule,
    CommonModule, MatExpansionModule, MatDatepickerModule, MatCheckboxModule, MatProgressSpinnerModule
  ]
})
export class PlanificacionMantencionesComponent  implements OnInit {

  filterForm!: FormGroup
  updateForm!: FormGroup

  dataSourceMaintenance:any
  paginationData: any;
  organizationId: number = 0

  priorityOptions = priorityOptions
  shiftOptions = shiftOptions
  equipmentCalendarOptions = equipmentCalendarOptions
  MaintenanceStatusOption = MaintenanceStatusOption

  dataFormFilter: any[] = []
  dataFormInput: any[] = []
  dataFormSelect: any[] = []

  acrreditation:boolean = false

  isLoadingMaintenances: boolean = false;

  @ViewChildren('modalEditEquipoMain') modalEditEquipoMain!: QueryList<IonModal>;

  constructor(private formBuilder: FormBuilder,private equipmentService:EquipmentService, private categoryService: CategoryService,
    private organizationService: OrganizationService, private cdr: ChangeDetectorRef, private mantencionesService: MantencionesService,
  private router:Router) {}

  async ngOnInit() {

    this.filterForm = this.formBuilder.group({

      tipo_equipo: [''],
      archivo_fisico: [''],
      estado: ['']

    })

    this.updateForm = this.formBuilder.group({

      id: [0,],
      qr: [0,],
      turno: ['', ],
      criticidad: ['', ],
      cliente: ['', Validators.required],
      tipo_equipo: ['', ],
      calendario: ['', ],
      descripcion: ['', ],
      ubicacion: ['', ],
      activo: ['', ],
      archivo_fisico: ['', ],
      marca: ['', ],
      modelo: ['', ],
      serie: ['', ],
      acreditacion: [this.acrreditation, ],
      ultima_mantencion: ['', ],

    })

    this.dataFormFilter = [
      { name: 'Tipo de Equipo', type: 'tipo_equipo', data: [] },
      { name: 'Archivo Físico', type: 'archivo_fisico', data: [{ id: 1, name: 'A01' }, { id: 2, name: 'A02' }, { id: 3, name: 'A03' }] },
      { name: 'Estado', type: 'estado', data: MaintenanceStatusOption },
    ];

    const organizations = await this.organizationService.getOrganizations();

    const updatedOrganizations = organizations.map((org: { descr: any; }) => ({
      ...org, // Copia todos los atributos originales
      name: org.descr, // Renombra 'descr' a 'name'
      descr: undefined, // Elimina el atributo 'descr' 
    }));

    this.dataFormSelect = [

      {name: 'Turno', type: 'turno', data: shiftOptions},
      {name: 'Criticidad', type: 'criticidad', data: priorityOptions},
      {name: 'Cliente', type: 'cliente', data: updatedOrganizations},
      {name: 'Tipo de Equipo', type: 'tipo_equipo', data: []},
      {name: 'Calendario', type: 'calendario', data: equipmentCalendarOptions},
      
    ]

    this.dataFormInput = [

      {name: 'Descripcion', type: 'descripcion', icon: 'description'},
      {name: 'Ubicacion', type: 'ubicacion', icon: 'pin_drop'},
      {name: 'Activo', type: 'activo', icon: ''},
      {name: 'Archivo Fisico', type: 'archivo_fisico', icon: ''},
      {name: 'Marca', type: 'marca', icon: ''},
      {name: 'Modelo', type: 'modelo', icon: ''},
      {name: 'Serie', type: 'serie', icon: ''},
  
    ]

    await this.obtenerEquipos();

    await this.getMaintenances();

  }

  async obtenerEquipos(){

    const maintenanceFilter = localStorage.getItem("MaintenanceFilter")

    if(maintenanceFilter){

      const parseEquipment = JSON.parse(maintenanceFilter)
      const organizationId = parseEquipment.Filter.OrganizationId
      this.organizationId = organizationId

      const response = await this.categoryService.getCategoryByOrganization(organizationId);
      const equipments = response.data
      const updatedEquipments = equipments.map((org: { descr: any; }) => ({
        ...org, // Copia todos los atributos originales
        name: org.descr, // Renombra 'descr' a 'name'
        descr: undefined, // Elimina el atributo 'descr' 
      }));

      this.dataFormSelect[3].data = updatedEquipments
      this.dataFormFilter[0].data = updatedEquipments

    }

  }

  async getUpdateEquipment(equipment: any){
    console.log('equipment: ',equipment)
    this.updateForm.patchValue({
      
      id: equipment.id || 0,
      qr: equipment.qr || 0,
      cliente: equipment.organizationId || 0,
      criticidad: equipment.priority || 0,
      turno: equipment.shift || 0,
      tipo_equipo: equipment.categoryId || 0,
      calendario: equipment.calendar || 0,
      activo: equipment.asset || '',
      descripcion: equipment.descr || '',
      ubicacion: equipment.location || '',
      archivo_fisico: equipment.physicalFile || '',
      serie: equipment.serial || '',
      marca: equipment.brand || '',
      modelo: equipment.model || '',
      acreditacion: equipment.accreditation || false,
      ultima_mantencion: equipment.lastMaintenance || '',
      
    })

    await this.obtenerEquipos();

  }

  async updateEquipment(){

    console.log('updateEquipment')
    const id = this.updateForm.get("id")?.value || 0;
    const qr = this.updateForm.get("qr")?.value || 0;
    const turno = this.updateForm.get("turno")?.value || 0;
    const criticidad = this.updateForm.get("criticidad")?.value || 0;
    const cliente = this.updateForm.get("cliente")?.value || 0;
    const tipo_equipo = this.updateForm.get("tipo_equipo")?.value || 0;
    const calendario = this.updateForm.get("calendario")?.value || 0;
    const descripcion = this.updateForm.get("descripcion")?.value || '';
    const ubicacion = this.updateForm.get("ubicacion")?.value || '';
    const activo = this.updateForm.get("activo")?.value || '';
    const archivo_fisico = this.updateForm.get("archivo_fisico")?.value || '';
    const marca = this.updateForm.get("marca")?.value || '';
    const modelo = this.updateForm.get("modelo")?.value || '';
    const serie = this.updateForm.get("serie")?.value || '';
    const acreditacion = this.updateForm.get("acreditacion")?.value || false;
    const ultima_mantencion = this.updateForm.get("ultima_mantencion")?.value || '';
    const programmed: string = new Date().toISOString();

    const Equipment: Equipment = {Id: id, QR: qr, OrganizationId: cliente, Organization: '', Shift: turno, 
      Priority: criticidad, CategoryId: tipo_equipo, Category: '', Descr: descripcion, Location: ubicacion,
      PhysicalFile: archivo_fisico, Asset: activo, Serial: serie, Brand: marca, Model: modelo, Accreditation: acreditacion,
      HasObservation: false, Deleted: false, Calendar: calendario, LastMaintenance: ultima_mantencion,
      Programmed: programmed, Images: '', HasImages: false 
    }

    const response = await this.equipmentService.updateEquipment(Equipment);
    console.log(response)

    await this.confirmEditEquipo();
  } 

  onPageChange(event: PageEvent) {
    this.getMaintenances(event);
  }

  async getMaintenances(pageEvent?: PageEvent){

    this.isLoadingMaintenances = true; 

    const response = await this.filterMaintenances(pageEvent);
    this.dataSourceMaintenance = response.data.items;
    this.paginationData = response.data.pages;

    this.isLoadingMaintenances = false;

    this.cdr.detectChanges();

  }

  async filterMaintenances(pageEvent?: PageEvent){

    const pagination: MaintenancePagination = {
      Entity: '',
      PageIndex: pageEvent ? pageEvent.pageIndex + 1 : 1,
      PageSize: pageEvent ? pageEvent.pageSize : 10,
      PageCount: 0,
      RecordCount: 0,
      SortColumn: '',
      SortOrder: 'ASC'
    }

    const categoryId = this.filterForm.get("tipo_equipo")?.value || 0;
    const physicalFile = this.filterForm.get("archivo_fisico")?.value || '';
    const status = this.filterForm.get("estado")?.value || 0;

    let month;
    let year;

    const dateReport = localStorage.getItem("datePrintReport")
    if(dateReport){
      const dateReportJson = JSON.parse(dateReport)
      
      month = dateReportJson.month
      year = dateReportJson.year
    }else{
      month = 0
      year = 0
    }
    
    const maintenancesFilter: MaintenanceFilter = {

      equipmentId: 0,
      organizationId: this.organizationId,
      categoryId: categoryId,
      physicalFile: physicalFile,
      maintenanceStatus: status,
      month: month,
      year: year

    }

    const maintenanceFilterPagination: MaintenanceFilterPagination = {
      Filter: maintenancesFilter,
      Pagination: pagination
    }
    console.log('maintenanceFilterPagination: ',maintenanceFilterPagination)
    const response = await this.mantencionesService.filterMaintenances(maintenanceFilterPagination)
    console.log('response',response)
    return response
    

  }

  limpiarFiltroMantenciones(){
    this.filterForm.reset()
    this.getMaintenances();
  }

  trackByFn(index: number, item: any): any {
    return item.serial || item.id; // Reemplaza 'serial' por el campo que sea único para tus elementos
  }

  mapOption(id: number, options: { id: number, name: string }[]): string {
    const option = options.find(opt => opt.id === id);
    return option ? option.name : 'No definido';
  }

  onSelectionChange(event: MatSelectChange, item: any): void {
    console.log('El valor seleccionado ha cambiado:', event.value);
    console.log('Item relacionado:', item);

    this.getMaintenances();
    // Aquí puedes agregar la lógica adicional que necesites
  }

  // Modal Edit Mantencion
  onWillDismissEditEquipo(event: any) {

    this.cdr.detectChanges();

    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }

  async confirmEditEquipo() {
    
    await Promise.all(
      this.modalEditEquipoMain.toArray().map(modal => modal.dismiss(null, 'confirm'))
    );
  }

  async cancelEditEquipo() {
    
    await Promise.all(
      this.modalEditEquipoMain.toArray().map(modal => modal.dismiss(null, 'cancel'))
    );
    
  }

  navigateToOrdenTrabajo(id:number){
    this.router.navigate([`/orden-trabajo/${id}`])
  }



}
