import { Component, OnInit, ViewChild  } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { IonRouterOutlet, IonList } from "@ionic/angular/standalone";
import { MatDrawer } from '@angular/material/sidenav';
import { SecurityService } from 'src/app/Services/Security/security.service';
import {MatDividerModule} from '@angular/material/divider';
import { ToastSonnerComponent } from '../toast-sonner/toast-sonner.component';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

export interface Section {
  name: string;
  icon: string;
  route: string;
  roles: number[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonList, IonRouterOutlet, MatSidenavModule, RouterModule, MatButtonModule, MatIconModule,
    MatToolbarModule, MatListModule, MatDividerModule, ToastSonnerComponent, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class MenuComponent  implements OnInit {

  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;

  @ViewChild('drawer') drawer!: MatDrawer;

  currentComponent:any = 'Inicio'

  folders: Section[] = [
    {
      name: 'Inicio',
      icon: 'pie_chart',
      route: '/inicio',
      roles: [0,1,2,3,4]
    },
    {
      name: 'Scanner QR',
      icon: 'qr_code_scanner',
      route: '/scannerQR',
      roles: [0,1,2,4]
    },
    {
      name: 'Mantenciones',
      icon: 'calendar_month',
      route: '/mantenciones',
      roles: [0,1,2,4]
    },
    {
      name: 'Equipos',
      icon: 'business_center',
      route: '/equipos',
      roles: [0,1,2,4]
    },
    {
      name: 'Documentos',
      icon: 'print',
      route: '/documentos',
      roles: [0,1,2,4]
    },
    {
      name: 'Configuracion de clientes',
      icon: 'manage_accounts',
      route: '/clientes',
      roles: [0,4]
    },
    {
      name: 'Usuarios',
      icon: 'person',
      route: '/usuarios',
      roles: [0,4]
    },
  ];

  filteredFolders: Section[] = [];

  constructor(private router: Router, private security: SecurityService) { }

  async ngOnInit() {

    this.filterMenuItemsByRole();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer.close();
    });
  }

  navigateToComponent(name: string){

    this.currentComponent = name

  }

  async filterMenuItemsByRole() {

    await this.security.loadUser();
    const user = this.security.currentUser;
  
    // Asegúrate de que user.position es un número
    const userRole = user?.position;
  
    if (userRole !== undefined && userRole !== null) {
      // Filtrar las carpetas según el rol del usuario
      this.filteredFolders = this.folders.filter(folder => {
        return folder.roles.includes(userRole);
      });
    } else {
      // Manejar el caso en que no haya un rol válido (opcional)
      this.filteredFolders = [];
    }
  }

  async logout(){
    
    this.security.logout();
    this.router.navigate(['/login'])
    
    this.toast_sonner.SuccessToast('Se ha cerrado sesion');

  }

  

}
