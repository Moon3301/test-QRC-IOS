import { Component, OnInit, ViewChild, ChangeDetectionStrategy, signal, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Equipment } from 'src/app/Interfaces/equipment';
import { IonicModule } from '@ionic/angular';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';
import { MaintenanceStatusOption } from 'src/app/Interfaces/maintenance';

import { ClientesService } from '../../Services/clientes/clientes.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { months } from 'src/app/Services/utilities';
import { years } from 'src/app/Services/utilities';

import { Router } from '@angular/router';
import { shiftOptions, priorityOptions, equipmentCalendarOptions,} from 'src/app/Interfaces/equipment';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MaintenanceFilter, MaintenanceFilterPagination, MaintenancePagination } from 'src/app/Interfaces/maintenance';
import { MantencionesService } from 'src/app/Services/mantenciones/mantenciones.service';
import { OrganizationService } from 'src/app/Services/organization/organization.service';
import { CategoryService } from 'src/app/Services/category/category.service';
import { EquipmentService } from 'src/app/Services/equipment/equipment.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { DocumentsService } from 'src/app/Services/documents/documents.service';
import { ToastSonnerComponent } from '../toast-sonner/toast-sonner.component';

interface dataFilter {

  name: string;
  type: string;
  data: any[];
}
@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.component.html',
  styleUrls: ['./mantenciones.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatTableModule, ReactiveFormsModule, IonicModule, CommonModule,
    MatExpansionModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatSidenavModule, MatPaginatorModule, MatProgressSpinnerModule,
    ToastSonnerComponent],
    
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MantencionesComponent  implements OnInit {

  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;

  showFiller = false;
  MaintenanceStatusOption = MaintenanceStatusOption
  shiftOptions = shiftOptions
  priorityOptions = priorityOptions
  equipmentCalendarOptions = equipmentCalendarOptions

  dataSourceMaintenance: any
  paginationData: any;

  createForm!: FormGroup
  filterForm!: FormGroup
  updateForm!: FormGroup

  isLoadingMaintenances: boolean = false;

  dataFormSelect: any[] = []
  dataFormInput: any[] = []

  @ViewChildren('modalEditMantencion') modalEditMantencion!: QueryList<IonModal>;

  dataFilter: dataFilter[] = []
  
  constructor(private formBuilder: FormBuilder, public clientes: ClientesService, public router: Router, 
    private mantencionesService: MantencionesService, private organizationService: OrganizationService,
    private categoryService: CategoryService, private cdr: ChangeDetectorRef, private equipmentService:EquipmentService,
    private documentsService:DocumentsService ) {

  }

  async ngOnInit() {

    this.filterForm = this.formBuilder.group({

      cliente: ['', ],
      tipo_equipo: ['', ],
      month: ['', ],
      year: ['', ]

    })

    this.createForm = this.formBuilder.group({

      turno: ['', ],
      criticidad: ['', ],
      cliente: ['', Validators.required],
      tipo_equipo: ['', Validators.required,],
      periodicidad: ['', ],
      descripcion: ['', ],
      ubicacion: ['', ],
      activo: ['', ],
      archivo_fisico: ['', ],
      marca: ['', ],
      modelo: ['', ],
      serie: ['', ],
      acreditacion: ['', ],
      ultima_mantencion: ['', ],

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
      acreditacion: ['', ],
      ultima_mantencion: ['', ],

    })

    this.dataFormInput = [

      {name: 'Descripcion', type: 'descripcion', icon: 'description'},
      {name: 'Ubicacion', type: 'ubicacion', icon: 'pin_drop'},
      {name: 'Activo', type: 'activo', icon: ''},
      {name: 'Archivo Fisico', type: 'archivo_fisico', icon: ''},
      {name: 'Marca', type: 'marca', icon: ''},
      {name: 'Modelo', type: 'modelo', icon: ''},
      {name: 'Serie', type: 'serie', icon: ''},
  
    ]

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 (enero) a 11 (diciembre), por eso sumamos 1
    const yearActual = fechaActual.getFullYear();
    console.log(yearActual)

    this.filterForm.patchValue({

      month: mesActual,
      year: yearActual

    })

    this.filterForm.get('cliente')?.valueChanges.subscribe((cliente) => {
      
      if(cliente){
        this.filterForm.get('tipo_equipo')?.enable();
      }else{
        this.filterForm.get('tipo_equipo')?.disable();
      }

    })

    const organizations = await this.organizationService.getOrganizations();

    const updatedOrganizations = organizations.map((org: { descr: any; }) => ({
      ...org, // Copia todos los atributos originales
      name: org.descr, // Renombra 'descr' a 'name'
      descr: undefined, // Elimina el atributo 'descr' 
    }));

    this.dataFilter = [
      {name: 'Cliente',type: 'cliente', data: updatedOrganizations },
      {name: 'Tipo de equipo',type: 'tipo_equipo', data: [] },
      {name: 'Mes',type: 'month', data: months },
      {name: 'Año',type: 'year', data: years }
    ]

    this.filterForm.patchValue({  
      cliente: updatedOrganizations[0].id
    })

    this.dataFormSelect = [

      {name: 'Turno', type: 'turno', data: shiftOptions},
      {name: 'Criticidad', type: 'criticidad', data: priorityOptions},
      {name: 'Cliente', type: 'cliente', data: updatedOrganizations},
      {name: 'Tipo de Equipo', type: 'tipo_equipo', data: []},
      {name: 'Calendario', type: 'calendario', data: equipmentCalendarOptions},
      
    ]

    await this.obtenerEquipos();
    await this.getMaintenances();

    
    
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  async obtenerEquipos(){

    const organizationId = this.filterForm.get('cliente')?.value;
    const response = await this.categoryService.getCategoryByOrganization(organizationId);
  
    const equipments = response.data

    const updatedEquipments = equipments.map((org: { descr: any; }) => ({
      ...org, // Copia todos los atributos originales
      name: org.descr, // Renombra 'descr' a 'name'
      descr: undefined, // Elimina el atributo 'descr' 
    }));

    console.log(updatedEquipments)

    this.dataFilter[1].data = updatedEquipments
    console.log(this.dataFilter)
    this.cdr.detectChanges();

  }

  async getUpdateEquipment(equipment: any){
    console.log(equipment)
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

    await this.confirmEditMantencion();
  } 

  onWillDismissEditMantencion(event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {


    }
  }

  onPageChange(event: PageEvent) {
    this.getMaintenances(event);
  }

  async confirmEditMantencion() {
    this.modalEditMantencion.toArray().forEach(modal => modal.dismiss(null, 'confirm'));

    await this.getMaintenances();
  }

  cancelEditMantencion() {
    this.modalEditMantencion.toArray().forEach(modal => modal.dismiss(null, 'cancel'));
  }

  addMantenimiento(){

  }

  navigateToOrdenTrabajo(id:number){
    this.router.navigate([`/orden-trabajo/${id}`])
  }

  clearDataFilterMaintenance(){
    this.filterForm.reset()
  }

  async getMaintenances(pageEvent?: PageEvent){

    try{
      this.isLoadingMaintenances = true;

      const response = await this.filterMaintenances(pageEvent);
      this.dataSourceMaintenance = response.data.items;

      console.log('dataSourceMaintenance: ',this.dataSourceMaintenance)
      this.paginationData = response.data.pages;

      this.isLoadingMaintenances = false;
      this.cdr.detectChanges();

    }catch(error){
      console.log(error)
    }

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

    const cliente = this.filterForm.get("cliente")?.value|| ''
    const categoryId = this.filterForm.get("tipo_equipo")?.value || 0;
    const physicalFile = ''
    const status = 0
    const month = this.filterForm.get("month")?.value || 0
    const year = this.filterForm.get("year")?.value || 0
    
    const maintenancesFilter: MaintenanceFilter = {

      equipmentId: 0,
      organizationId: cliente,
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
    
    const response = await this.mantencionesService.filterMaintenances(maintenanceFilterPagination)
    return response
    
  }
  
  mapOption(id: number, options: { id: number, name: string }[]): string {
    const option = options.find(opt => opt.id === id);
    return option ? option.name : 'No definido';
  }

  async batchDocuments(){

    const cliente = this.filterForm.get("cliente")?.value|| ''
    const categoryId = this.filterForm.get("tipo_equipo")?.value || 0;
    const physicalFile = ''
    const status = 0
    const month = this.filterForm.get("month")?.value || 0
    const year = this.filterForm.get("year")?.value || 0
    
    const maintenancesFilter: MaintenanceFilter = {

      equipmentId: 0,
      organizationId: cliente,
      categoryId: categoryId,
      physicalFile: physicalFile,
      maintenanceStatus: status,
      month: month,
      year: year

    }

    this.toast_sonner.PromiseToast(
      'Cargando documento ...',
      'Registro guardado en dispositivo local', 
      'Error al cargar documento', 
      this.documentsService.batchDocuments(maintenancesFilter)
    )

    const response = await this.documentsService.batchDocuments(maintenancesFilter);
    console.log(response)

  }

}
