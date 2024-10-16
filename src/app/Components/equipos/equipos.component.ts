import { Component, OnInit, ViewChild, ChangeDetectionStrategy, signal, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { IonicModule } from '@ionic/angular';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import {FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';

import { Equipment } from 'src/app/Interfaces/equipment';

import { ClientesService } from '../../Services/clientes/clientes.service';

import {MatDatepickerModule} from '@angular/material/datepicker';

import {provideNativeDateAdapter} from '@angular/material/core';

import {MatDividerModule} from '@angular/material/divider';

import { EquipmentService } from 'src/app/Services/equipment/equipment.service';
import { DocumentsService } from 'src/app/Services/documents/documents.service';
import {MatSidenavModule} from '@angular/material/sidenav';

import { Router } from '@angular/router';
import { EquipmentFilter, EquipmentPagination, EquipmentFilterPagination } from 'src/app/Interfaces/equipment';
import { shiftOptions, priorityOptions, equipmentCalendarOptions, months, years, EquipmentFilterMaintenanceSeed,
  MaintenanceSeed } from 'src/app/Interfaces/equipment';

import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CategoryService } from 'src/app/Services/category/category.service';
import { OrganizationService } from 'src/app/Services/organization/organization.service';
import { MaintenanceFilter, MaintenanceStatus } from 'src/app/Interfaces/maintenance';
import { MantencionesService } from 'src/app/Services/mantenciones/mantenciones.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ToastSonnerComponent } from '../toast-sonner/toast-sonner.component';

import { Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  FileSharer
} from '@byteowls/capacitor-filesharer';

@Component({
  standalone: true,
  selector: 'app-equipos',
  providers: [provideNativeDateAdapter()],
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, ReactiveFormsModule, IonicModule, MatDividerModule,
    MatExpansionModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, CommonModule, MatSidenavModule,
    MatPaginatorModule, FormsModule, MatProgressSpinnerModule, ToastSonnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class EquiposComponent  implements OnInit {

  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;

  priorityOptions = priorityOptions
  shiftOptions = shiftOptions
  equipmentCalendarOptions = equipmentCalendarOptions

  isLoadingEquipment: boolean = false;

  createForm!: FormGroup
  filterForm!: FormGroup
  updateForm!: FormGroup
  maintenanceSeed!: FormGroup
  printReportForm!: FormGroup

  @ViewChild('modalAddEquipo', { static: false }) modalAddEquipo!: IonModal;
  @ViewChildren('modalEditEquipo') modalEditEquipo!: QueryList<IonModal>;
  @ViewChildren('modalViewMantenciones') modalViewMantenciones!: QueryList<IonModal>;

  readonly panelOpenState = signal(false);
  
  dataSource:any
  paginationData: any;
  usuariosPorTipo: any;

  pages:any

  dataFormSelect: any[] = []
  dataFormInput: any[] = []

  months = months
  years = years

  acrreditation:boolean = false

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder,
    public clientes: ClientesService, public router: Router,
    private equipmentService:EquipmentService, private categoryService: CategoryService,
    private organizationService: OrganizationService, private documentsService:DocumentsService,
    private maintenanceService: MantencionesService, private platform:Platform ) {}

  async ngOnInit() {

    this.dataFormInput = [

      {name: 'Descripcion', type: 'descripcion', icon: 'description'},
      {name: 'Ubicacion', type: 'ubicacion', icon: 'pin_drop'},
      {name: 'Activo', type: 'activo', icon: ''},
      {name: 'Archivo Fisico', type: 'archivo_fisico', icon: ''},
      {name: 'Marca', type: 'marca', icon: ''},
      {name: 'Modelo', type: 'modelo', icon: ''},
      {name: 'Serie', type: 'serie', icon: ''},
  
    ]

    this.filterForm = this.formBuilder.group({

      turno: [0, ],
      criticidad: [0, ],
      cliente: ['', ],
      tipo_equipo: [{value: '', disabled: true}, ],
      calendario: [0, ],
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

    this.createForm = this.formBuilder.group({

      turno: ['', ],
      criticidad: ['', ],
      cliente: ['', Validators.required],
      tipo_equipo: ['', Validators.required,],
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

    this.printReportForm = this.formBuilder.group({
      month: [''],
      year: ['']
    })

    this.maintenanceSeed = this.formBuilder.group({
      supervisor: ['',],
      technician: ['',],
      helper: ['',],
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

    this.dataFormSelect = [

      {name: 'Turno', type: 'turno', data: shiftOptions},
      {name: 'Criticidad', type: 'criticidad', data: priorityOptions},
      {name: 'Cliente', type: 'cliente', data: updatedOrganizations},
      {name: 'Tipo de Equipo', type: 'tipo_equipo', data: []},
      {name: 'Calendario', type: 'calendario', data: equipmentCalendarOptions},
      
    ]

    this.filterForm.patchValue({  
      cliente: updatedOrganizations[0].id
    })

    await this.obtenerEquipos();

    const cliente = this.filterForm.get('cliente')?.value
    const response = await this.organizationService.findUsersByOrganizationId(cliente);
    
    this.usuariosPorTipo = response.data
    
    this.maintenanceSeed.patchValue({
      supervisor: this.usuariosPorTipo.supervisor[0].id,
      technician: this.usuariosPorTipo.technician[0].id,
      helper: this.usuariosPorTipo.helper[0].id,
    })

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 (enero) a 11 (diciembre), por eso sumamos 1
    const yearActual = fechaActual.getFullYear();

    this.printReportForm.patchValue({

      month: mesActual,
      year: yearActual

    })

    await this.loadDataEquipments();
    console.log(updatedOrganizations)

  }

  async obtenerEquipos(){

    const organizationId = this.filterForm.get('cliente')?.value || this.createForm.get('cliente')?.value || this.updateForm.get('cliente')?.value;
    const response = await this.categoryService.getCategoryByOrganization(organizationId);
  
    const equipments = response.data

    const updatedEquipments = equipments.map((org: { descr: any; }) => ({
      ...org, // Copia todos los atributos originales
      name: org.descr, // Renombra 'descr' a 'name'
      descr: undefined, // Elimina el atributo 'descr' 
    }));

    this.dataFormSelect[3].data = updatedEquipments
    
    this.cdr.detectChanges();

  }

  mapOption(id: number, options: { id: number, name: string }[]): string {
    const option = options.find(opt => opt.id === id);
    return option ? option.name : 'No definido';
  }

  async loadDataEquipments(){

    this.isLoadingEquipment = true

    await this.getEquipments();
    
    //this.filterForm.reset();
    this.updateForm.reset();
    this.createForm.reset();

    this.isLoadingEquipment = false
    
    this.cdr.detectChanges();
    
    
  }

  async cleanFilterEquipments(){
    this.filterForm.reset();
  }

  onPageChange(event: PageEvent) {
    this.getEquipments(event);
  }

  async getEquipments(pageEvent?: PageEvent){

    const response = await this.filterEquipments(pageEvent);
    
    const equipments = response.data.items
    const pages = response.data.pages

    this.dataSource = [... (equipments || [])]
    console.log(this.dataSource)
    this.paginationData = pages

    this.cdr.detectChanges();

  }

  async filterEquipments(pageEvent?: PageEvent){

    const pagination: EquipmentPagination = {
      Entity: '',
      PageIndex: pageEvent ? pageEvent.pageIndex + 1 : 1,
      PageSize: pageEvent ? pageEvent.pageSize : 10,
      PageCount: 0,
      RecordCount: 0,
      SortColumn: '',
      SortOrder: 'ASC'
    }
    
    const equipmentFilter: EquipmentFilter = {
      OrganizationId: this.filterForm.get("cliente")?.value || 0,
      Priority: this.filterForm.get("criticidad")?.value || 0,
      Shift: this.filterForm.get("turno")?.value || 0,
      CategoryId: this.filterForm.get("tipo_equipo")?.value || 0,
      Calendar: this.filterForm.get("calendario")?.value || 0,
      Asset: this.filterForm.get("activo")?.value || '',
      Descr: this.filterForm.get("descripcion")?.value || '',
      Location: this.filterForm.get("ubicacion")?.value || '',
      PhysicalFile: this.filterForm.get("archivo_fisico")?.value || '',
      Serial:this.filterForm.get("serie")?.value || '',
      Brand: this.filterForm.get("marca")?.value || '',
      Model:this.filterForm.get("modelo")?.value || '',
      Accreditation:this.filterForm.get("acreditacion")?.value || false,
      Month: 0,
      Pagination: pagination
    }

    const EquipmentFilterPagination: EquipmentFilterPagination = {
      Filter: equipmentFilter,
      Pagination: pagination
    }
    
    const response = await this.equipmentService.filterEquipments(EquipmentFilterPagination);    
    return response

  }

  async createMaintenanceBatch(pageEvent?: PageEvent){

    try{

      const month = this.printReportForm.get('month')?.value;
      const year = this.printReportForm.get('year')?.value;

      const supervisorId = this.maintenanceSeed.get('supervisor')?.value;
      const technicianId = this.maintenanceSeed.get('technician')?.value;
      const helperId = this.maintenanceSeed.get('helper')?.value;
      
      const maintenanceSeed: MaintenanceSeed = {
        SupervisorId: supervisorId,
        TechnicianId: technicianId,
        HelperId: helperId,
        Programmed: null
      }

      console.log('maintenanceSeed: ',maintenanceSeed)

      const pagination: EquipmentPagination = {
        Entity: '',
        PageIndex: pageEvent ? pageEvent.pageIndex + 1 : 1,
        PageSize: pageEvent ? pageEvent.pageSize : 10,
        PageCount: 0,
        RecordCount: 0,
        SortColumn: '',
        SortOrder: 'ASC'
      }

      console.log('pagination:', pagination)

      const equipmentFilter: EquipmentFilter = {

        OrganizationId: this.filterForm.get("cliente")?.value || 0,
        Priority: this.filterForm.get("criticidad")?.value || 0,
        Shift: this.filterForm.get("turno")?.value || 0,
        CategoryId: this.filterForm.get("tipo_equipo")?.value || 0,
        Calendar: this.filterForm.get("calendario")?.value || 0,
        Asset: this.filterForm.get("activo")?.value || '',
        Descr: this.filterForm.get("descripcion")?.value || '',
        Location: this.filterForm.get("ubicacion")?.value || '',
        PhysicalFile: this.filterForm.get("archivo_fisico")?.value || '',
        Serial:this.filterForm.get("serie")?.value || '',
        Brand: this.filterForm.get("marca")?.value || '',
        Model:this.filterForm.get("modelo")?.value || '',
        Accreditation:this.filterForm.get("acreditacion")?.value || false,
        Month: month,
        Pagination: pagination

      }

      console.log('equipmentFilter: ',equipmentFilter)

      const EquipmentFilterMaintenanceSeed: EquipmentFilterMaintenanceSeed = {
        Filter: equipmentFilter,
        Seed: maintenanceSeed
      }

      const maintenanceFilter = JSON.stringify(EquipmentFilterMaintenanceSeed)

      localStorage.setItem("MaintenanceFilter", maintenanceFilter)

      console.log('EquipmentFilterMaintenanceSeed:', EquipmentFilterMaintenanceSeed)

      const response = await this.maintenanceService.createMaintenanceBatch(EquipmentFilterMaintenanceSeed);
      console.log(response)

      this.navigateToMantencionComponent()

    }catch(error){
      console.log(error)
    }
    
  }

  async printReports(){

    const month = this.printReportForm.get('month')?.value;
    const year = this.printReportForm.get('year')?.value;
    const directory = ''

    const datePrintReport = {month: month, year: year}

    localStorage.setItem("datePrintReport", JSON.stringify(datePrintReport));

    this.toast_sonner.PromiseToast(
      'Cargando PDF ...',
      'PDF guardado en dispositivo local', 
      'Error al descargar PDF', 
      this.documentsService.monthDocuments(month, year, directory)
    )
    
    const response = await this.documentsService.monthDocuments(month, year, directory);
    console.log(response)

    const dataBlob = response.data

    const timestamp = new Date().getTime();

    if (this.platform.is('cordova') || this.platform.is('capacitor')) {

      await this.saveAndSharePDF(dataBlob, `${year}_${month}_${timestamp}`);

    }else{

      // Si es un navegador, descargar el archivo
      const url = window.URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${year}_${month}__${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    }

  }


  navigateToMantencionComponent(){

    this.router.navigate(['/PlanificacionMantencionesComponent'])
  }


  // Modal Add Mantencion
  onWillDismissAddEquipo(event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }

  async labelEquipment(equipmentId:number){

    this.toast_sonner.PromiseToast(
      'Cargando PDF ...',
      'PDF guardado en dispositivo local', 
      'Error al descargar PDF', 
      this.documentsService.labelDocuments(equipmentId)
    )

    const response = await this.documentsService.labelDocuments(equipmentId);
    console.log(response)
    const dataBlob = response.data

    const timestamp = new Date().getTime();
    
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {

      await this.saveAndSharePDF(dataBlob, `equipment_report_${equipmentId}_${timestamp}`);

    }else{
      // Si es un navegador, descargar el archivo
      const url = window.URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `equipment_report_${equipmentId}_${timestamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    }

  }

  async saveFileToDevice(blob: Blob, filename: string) {
    try {
      // Convertir el Blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {

        if(reader.result){

          const base64Data = reader.result.toString().split(',')[1];
  
          // Guardar el archivo en el directorio del sistema
          const result = await Filesystem.writeFile({
            path: `${filename}.pdf`,
            data: base64Data,
            directory: Directory.Documents, // Puedes cambiar esto a Directory.Data para un directorio accesible
          });
    
          console.log('Archivo guardado en:', result.uri);

        }
        
      };
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
    }
  }

  async saveAndSharePDF(blob: Blob, filename: string) {
    try {
      // Convertir el Blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        if (reader.result) {
          const base64Data = reader.result.toString().split(',')[1];
  
          // Guardar el archivo en el directorio de Descargas (Downloads)
          const result = await Filesystem.writeFile({
            path: `${filename}.pdf`,
            data: base64Data,
            directory: Directory.Documents, // Guardar en la carpeta Descargas
          });
  
          console.log('Archivo guardado en:', result.uri);
  
          // Compartir el archivo
          await FileSharer.share({
            filename: `${filename}.pdf`,
            base64Data: base64Data,
            contentType: 'application/pdf',
          });
        }
      };
    } catch (error) {
      console.error('Error al guardar o compartir el archivo:', error);
    }
  }



  async getUpdateEquipment(equipment: any){

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

  async confirmAddEquipo() {
    
    this.modalAddEquipo.dismiss(null,'confirm');
    await this.loadDataEquipments();
  }

 async cancelAddEquipo() {
    
    this.modalAddEquipo.dismiss(null, 'cancel');
    await this.loadDataEquipments();
  }

  // Modal Edit Mantencion
  onWillDismissEditEquipo(event: any) {

    this.cdr.detectChanges();

    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }

  trackByFn(index: number, item: any): any {
    return item.serial || item.id; // Reemplaza 'serial' por el campo que sea único para tus elementos
  }

  async confirmEditEquipo() {
    
    await Promise.all(
      this.modalEditEquipo.toArray().map(modal => modal.dismiss(null, 'confirm'))
    );
    
    await this.loadDataEquipments();
  }

  async cancelEditEquipo() {
    
    await Promise.all(
      this.modalEditEquipo.toArray().map(modal => modal.dismiss(null, 'cancel'))
    );
    await this.loadDataEquipments();
  }

  // Modal View Mantenciones
  onWillDismissViewMantenciones(event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

    }
  }

  confirmViewMantenciones() {
    this.modalViewMantenciones.toArray().forEach(modal => modal.dismiss(null, 'confirm'));
  }

  cancelViewMantenciones() {
    this.modalViewMantenciones.toArray().forEach(modal => modal.dismiss(null, 'cancel'));
  }

  async historyEquipment(_id: any, pageEvent?: PageEvent){

    const pagination: EquipmentPagination = {
      Entity: '',
      PageIndex: pageEvent ? pageEvent.pageIndex + 1 : 1,
      PageSize: pageEvent ? pageEvent.pageSize : 10,
      PageCount: 0,
      RecordCount: 0,
      SortColumn: '',
      SortOrder: 'ASC'
    }
    console.log('_id: ',_id);
    const id = parseInt(_id);
    console.log('_id: (parse_number)', id)

    const response = await this.equipmentService.historyEquipment(id, pagination);
    console.log(response)


  }

  navigateHistoryEquipment(id:number){
    this.router.navigate([`/hystory-equipment/${id}`])
  }

  async createEquipment(){

    try{

      const turno = this.createForm.get("turno")?.value || 0;
      const criticidad = this.createForm.get("criticidad")?.value || 0;
      const cliente = this.createForm.get("cliente")?.value || 0;
      const tipo_equipo = this.createForm.get("tipo_equipo")?.value || 0;
      const calendario = this.createForm.get("calendario")?.value || 0;
      const descripcion = this.createForm.get("descripcion")?.value || '';
      const ubicacion = this.createForm.get("ubicacion")?.value || '';
      const activo = this.createForm.get("activo")?.value || '';
      const archivo_fisico = this.createForm.get("archivo_fisico")?.value || '';
      const marca = this.createForm.get("marca")?.value || '';
      const modelo = this.createForm.get("modelo")?.value || '';
      const serie = this.createForm.get("serie")?.value || '';
      const acreditacion = this.createForm.get("acreditacion")?.value || false;
      const ultima_mantencion = this.createForm.get("ultima_mantencion")?.value || '';
      const programmed: string = new Date().toISOString();

      const Equipment: Equipment = {Id: 0, QR: 0, OrganizationId: cliente, Organization: '', Shift: turno, 
        Priority: criticidad, CategoryId: tipo_equipo, Category: '', Descr: descripcion, Location: ubicacion,
        PhysicalFile: archivo_fisico, Asset: activo, Serial: serie, Brand: marca, Model: modelo, Accreditation: acreditacion,
        HasObservation: false, Deleted: false, Calendar: calendario, LastMaintenance: ultima_mantencion,
        Programmed: programmed, Images: '', HasImages: false 
      }

      this.equipmentService.createEquipment(Equipment);
      await this.confirmAddEquipo();

    }catch (error){
      console.log(error)
    }
    
  }
  
  async deleteEquipment(equipmentId:number){

    const response = await this.equipmentService.deleteEquipment(equipmentId);
    console.log(response);
    this.loadDataEquipments()

  }

}
