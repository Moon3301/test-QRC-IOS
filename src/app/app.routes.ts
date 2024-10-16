import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { MenuComponent } from './Components/menu/menu.component';
import { ScannerQRComponent } from './Components/scanner-qr/scanner-qr.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { ClientesComponent } from './Components/clientes/clientes.component';
import { UsuariosComponent } from './Components/usuarios/usuarios.component';
import { EquiposComponent } from './Components/equipos/equipos.component';
import { ConfigClienteComponent } from './Components/clientes/config-cliente/config-cliente.component';
import { MantencionesComponent } from './Components/mantenciones/mantenciones.component';
import { DocumentosComponent } from './Components/documentos/documentos.component';
import { OrdenTrabajoComponent } from './Components/mantenciones/orden-trabajo/orden-trabajo.component';
import { PlanificacionMantencionesComponent } from './Components/equipos/planificacion-mantenciones/planificacion-mantenciones.component';
import { HistoryEquipmentComponent } from './Components/equipos/history-equipment/history-equipment.component';

export const routes: Routes = [

  {
    path:'login',
    component: LoginComponent,
  },
  {
      path: '',
      redirectTo:'login',
      pathMatch: 'full'
  },
  {
    path: '',
    component: MenuComponent,
    children: [

      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'scannerQR',
        component: ScannerQRComponent
      },
      {
        path: 'clientes',
        component: ClientesComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'equipos',
        component: EquiposComponent,
      },
      {
        path: 'config-cliente/:cliente/:type',
        component: ConfigClienteComponent,
      },
      {
        path: 'mantenciones',
        component: MantencionesComponent,
      },
      {
        path: 'documentos',
        component: DocumentosComponent
      },
      {
        path: 'orden-trabajo/:id_main',
        component: OrdenTrabajoComponent
      },
      {
        path: 'PlanificacionMantencionesComponent',
        component: PlanificacionMantencionesComponent
      },
      {
        path: 'hystory-equipment/:id',
        component: HistoryEquipmentComponent
      }
      
    ]
  }

  
];
