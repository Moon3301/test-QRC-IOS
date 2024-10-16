import { Component, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import { DocumentsService } from 'src/app/Services/documents/documents.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { api_url } from 'src/app/Services/utilities';

export interface Section {
  name: string;
  updated: Date;
}

interface Directory {
  parentDirectory: string;
  directoryName: string;
  dateModified: string;
}

interface File {
  name: string;
  updated: Date;
  downloadUrl: string;

}

@Component({
  standalone: true,
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
  imports: [MatListModule, MatDividerModule, MatIconModule, DatePipe, CommonModule, MatButtonModule]
})
export class DocumentosComponent  implements OnInit {

  files: File[] = [];
  currentPath: string = '';

  folders: Section[] = [
    {
      name: '2024',
      updated: new Date('1/1/16'),
    },
    {
      name: '2023',
      updated: new Date('1/17/16'),
    },
    {
      name: '2022',
      updated: new Date('1/28/16'),
    },
    {
      name: '2021',
      updated: new Date('1/28/16'),
    },
    {
      name: '2020',
      updated: new Date('1/28/16'),
    },
    {
      name: '2019',
      updated: new Date('1/28/16'),
    },
  ];
  
  
  constructor(private documentsService:DocumentsService) { }

  async ngOnInit() {


  }

  async openFolder(folderName: string): Promise<void> {
    this.currentPath = this.currentPath ? `${this.currentPath}\\${folderName}` : folderName;
    if (this.isMonth(folderName)) {
      console.log('Abriendo File')
      await this.getFiles(this.currentPath);
    } else {
      console.log('Abriendo Directory')
      await this.getDirectories(this.currentPath);
    }
  }

  async getFiles(directory: string){

    const response = await this.documentsService.getFiles(directory);

    this.files= response.data.map((file : { fileName: string | number, dateModified: string | Date | number}) => ({

      name: file.fileName,
      updated: new Date(file.dateModified),
      downloadUrl: this.buildDownloadUrl(directory, file.fileName) // Construir la URL de descarga

    }));

    this.folders = [];

  }

  downloadFile(downloadUrl: string): void {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank'); // Abre la URL de descarga en una nueva pestaña
    } else {
      console.error('No se pudo obtener la URL de descarga');
    }
  }


  async getDirectories(directory:string){

    const response = await this.documentsService.directoryDocument(directory);
    console.log('getDirectories: ',response)

    if(response.data){
      this.folders = response.data.map((dir: {
        dateModified: string | number | Date; directoryName: any;}) => ({
        name: dir.directoryName,
        updated: new Date(dir.dateModified)
      }))
    }else{
      this.folders = [];
    }
    

    this.files = []; // Clear files when navigating to a new directory
  }

  isMonth(folderName: string): boolean {
    return /^\d{2}$/.test(folderName); // Check if the folder name is a two-digit number (month)
  }

  async goBack(): Promise<void> {
    if (this.currentPath.includes('\\')) {
      this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('\\'));
    } else {
      this.currentPath = '';
    }

    if (this.currentPath) {
      if (this.isMonth(this.currentPath.split('\\').pop()!)) {
        await this.getFiles(this.currentPath);
      } else {
        await this.getDirectories(this.currentPath);
      }
    } else {
      // Reset to initial state if at the root
      this.folders = [
        { name: '2024', updated: new Date('1/1/16') },
        { name: '2023', updated: new Date('1/17/16') },
        { name: '2022', updated: new Date('1/28/16') },
        { name: '2021', updated: new Date('1/28/16') },
        { name: '2020', updated: new Date('1/28/16') },
        { name: '2019', updated: new Date('1/28/16') },
      ];
      this.files = [];
    }
  }

  // Función para construir la URL de descarga
  buildDownloadUrl(directory: string, fileName: string | number): string {
    // Asegurarse de que el path use el formato correcto con '/'
    const fullPath = `${directory}\\${fileName}`;
    return `https://mobile.qrc.cl/resources/maintenances/${encodeURIComponent(fullPath)}`;
  }

}
