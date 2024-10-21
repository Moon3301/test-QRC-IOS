import { Component, OnInit } from '@angular/core';

import { OrganizationService } from 'src/app/Services/organization/organization.service';
import { SecurityService } from 'src/app/Services/Security/security.service';
import { CategoryService } from 'src/app/Services/category/category.service';
import { DashboardService } from 'src/app/Services/Dashboard/dashboard.service';

import { Category } from 'src/app/Interfaces/category-equip';

import { ChartModule } from 'primeng/chart';
import { IonContent, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup,} from '@angular/forms';
import { group } from '@angular/animations';

import { years } from 'src/app/Services/utilities';
import { months } from 'src/app/Services/utilities';

import { ChangeDetectorRef } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';


interface PieChart {

    name: string,
    value: number

}

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, ChartModule, MatProgressSpinnerModule, CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatMenuModule, IonContent
  ]
})
export class InicioComponent  implements OnInit {

    configPieChartDay: any;
    dataPieDay!: PieChart[];

    dataPieChartNight: any;
    dataPieNight!: PieChart[];

    dataBarChartDay:any;
    dataBarDay: any

    dataBarChartNight:any;
    dataBarNight: any

    optionsPieChart: any;
    optionsBarChart: any;   

    isLoading: boolean = true
    filterForm!: FormGroup
    dataFormSelect: any[] = []
    years = years
    months = months

    constructor(private organizations: OrganizationService, private security:SecurityService, private categoryService: CategoryService,
        private formBuilder: FormBuilder, private dashboardService:DashboardService, private cdr: ChangeDetectorRef
    ) {}

    

    async ngOnInit() {

        this.filterForm = this.formBuilder.group({

            cliente: [''],
            month: [],
            year: []

        })

        

        const organizations = await this.organizations.getOrganizations();

        const updatedOrganizations = organizations.map((org: { descr: any; }) => ({
        ...org, // Copia todos los atributos originales
        name: org.descr, // Renombra 'descr' a 'name'
        descr: undefined, // Elimina el atributo 'descr' 
        }));

        this.dataFormSelect = [

            {name: 'Cliente', type: 'cliente', data: updatedOrganizations},
            {name: 'Mes', type: 'month', data: months},
            {name: 'Año', type: 'year', data: years},
            
        ]

        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 (enero) a 11 (diciembre), por eso sumamos 1
        const yearActual = fechaActual.getFullYear();
        console.log(yearActual)
        console.log(mesActual)

        this.filterForm.patchValue({

            month: mesActual,
            year: yearActual

        })

        this.filterForm.patchValue({  
            cliente: updatedOrganizations[0].id
        })



        // Nos suscribimos a los cambios del formulario
        this.filterForm.valueChanges.subscribe(() => {
            this.loadDataCharts().then(() =>{
                this.initializeChartData();
                this.cdr.detectChanges();
            })
            
        });

        console.log('dataFormSelect: ',this.dataFormSelect)

        await this.loadDataCharts();

        this.initializeChartData()
        
    }

    async loadDataStatusDay(){
        const responseStatusDay = await this.StatusChart(1);
        const { pending, finished, total } = responseStatusDay.data;

        console.log('responseStatusDay: ',responseStatusDay)
        this.dataPieDay = [
            { name: 'Pending', value: pending },
            { name: 'Finished', value: finished },
            { name: 'Total', value: total }
        ]
        this.cdr.detectChanges();
    }

    async loadDataStatusNight(){
        const responseStatusNight = await this.StatusChart(2);
        const { pending, finished, total } = responseStatusNight.data;
        console.log('responseStatusNight: ',responseStatusNight)

        this.dataPieNight = [
            { name: 'Pending', value: pending },
            { name: 'Finished', value: finished },
            { name: 'Total', value: finished }
        ]
    }

    async loadDataPriorityDay(){
        const responseProrityDay = await this.priorityChart(1);
        const { finishedPriority, pendingPriority} = responseProrityDay.data;
        console.log('responseProrityDay: ',responseProrityDay)

        const newObjectPending = pendingPriority.map((value: any, index: number) => ({
            name: `criticidad ${index + 1}`,
            value: value
        }));

        const newObjectFinished = finishedPriority.map((value: any, index: number) => ({
            name: `criticidad ${index + 1}`,
            value: value
        }));
        
        
        this.dataBarDay = [
            { name: 'Pending', value: newObjectPending },
            { name: 'Finished', value: newObjectFinished },
        ]
    }

    async loadDataPriorityNight(){


        const responsePriorityNight = await this.priorityChart(2);
        const { finishedPriority, pendingPriority} = responsePriorityNight.data;
        console.log('responsePriorityNight: ',responsePriorityNight)

        const newObjectPending = pendingPriority.map((value: any, index: number) => ({
            name: `criticidad ${index + 1}`,
            value: value
        }));

        const newObjectFinished = finishedPriority.map((value: any, index: number) => ({
            name: `criticidad ${index + 1}`,
            value: value
        }));

        this.dataBarNight = [
            { name: 'Pending', value: newObjectPending },
            { name: 'Finished', value: newObjectFinished },
        ]
    }

    async loadDataCharts(){

        await this.loadDataStatusDay()
        await this.loadDataStatusNight()
        await this.loadDataPriorityDay()
        await this.loadDataPriorityNight()
        
    }

    async StatusChart(shiftV:number){

        const organizationId = this.filterForm.get("cliente")?.value
        const month = this.filterForm.get("month")?.value 
        const year = this.filterForm.get("year")?.value 
        const shift = shiftV

        const filter = {
            organizationId,
            month,
            year,
            shift
        }
        
        const responseStatus = await this.dashboardService.getGraphicStatus(filter);
        console.log(responseStatus)
        return responseStatus
        
    }

    async priorityChart(shiftV:number){

        const organizationId = this.filterForm.get("cliente")?.value
        const month = this.filterForm.get("month")?.value 
        const year = this.filterForm.get("year")?.value 
        const shift = shiftV

        const filter = {
            organizationId,
            month,
            year,
            shift
        }
        
        const responsePriority = await this.dashboardService.getGraphicPriority(filter);

        console.log(responsePriority)
        return responsePriority

    }

    async filterDataPriority(){

    }

    ngAfterViewInit() {

        

        // Simular un retraso para la carga de la interfaz gráfica
        setTimeout(() => {
            this.isLoading = false;
        }, 1000); // Ajusta el tiempo según sea necesario
    }

    async initializeChartData() {

        this.configurationPieChartDay();
        this.configurationPieChartNight();

        this.configurationBarChartDay();
        this.configurationBarChartNight();

    }





    configurationPieChartDay(){

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.configPieChartDay = {
            labels: [this.dataPieDay[0].name, this.dataPieDay[1].name],
            datasets: [
                {
                    data: [this.dataPieDay[0].value, this.dataPieDay[1].value],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.optionsPieChart = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    configurationPieChartNight(){

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.dataPieChartNight = {
            labels: [this.dataPieNight[0].name, this.dataPieNight[1].name],
            datasets: [
                {
                    data: [this.dataPieNight[0].value, this.dataPieNight[1].value],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.optionsPieChart = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    configurationBarChartDay(){

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.dataBarChartDay = {
            labels: [
                        this.dataBarDay[0].value[0].name, this.dataBarDay[0].value[1].name,
                        this.dataBarDay[0].value[2].name, this.dataBarDay[0].value[3].name
                    ], 
            datasets: [
                {
                    label: 'Pendientes',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [
                            this.dataBarDay[0].value[0].value, this.dataBarDay[0].value[1].value,
                            this.dataBarDay[0].value[2].value, this.dataBarDay[0].value[3].value,
                        ]
                },
                {
                    label: 'Finalizados',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: [
                            this.dataBarDay[1].value[0].value, this.dataBarDay[1].value[1].value,
                            this.dataBarDay[1].value[2].value, this.dataBarDay[1].value[3].value,
                        ]
                },
            
            ]
        };

        this.optionsBarChart = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    configurationBarChartNight(){

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.dataBarChartNight = {
            labels: [
                this.dataBarNight[0].value[0].name, this.dataBarNight[0].value[1].name,
                this.dataBarNight[0].value[2].name, this.dataBarNight[0].value[3].name
            ],
            datasets: [
                {
                    label: 'Pendientes',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [
                        this.dataBarNight[0].value[0].value, this.dataBarNight[0].value[1].value,
                        this.dataBarNight[0].value[2].value, this.dataBarNight[0].value[3].value,
                    ]
                },
                {
                    label: 'Finalizados',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: [
                        this.dataBarNight[1].value[0].value, this.dataBarNight[1].value[1].value,
                        this.dataBarNight[1].value[2].value, this.dataBarNight[1].value[3].value,
                    ]
                },
            
            ]
        };

        this.optionsBarChart = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    exportChartAsImage(chartId: string, format: string) {
        const chartElement = document.getElementById(chartId) as HTMLCanvasElement;
        const image = chartElement.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.href = image;
        link.download = `chart.${format}`;
        link.click();
    }

    exportChartAsPDF(chartId: string) {
        const chartElement = document.getElementById(chartId) as HTMLCanvasElement;
        html2canvas(chartElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('chart.pdf');
        });
    }

    exportChartDataAsExcel(data: any, filename: string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    }

    exportChartDataAsCSV(data: any, filename: string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
    }


}
