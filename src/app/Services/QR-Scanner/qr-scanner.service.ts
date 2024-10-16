import { Injectable } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  constructor() { }

  

  // Solicitar permisos de la cámara
  private async requestCameraPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    console.log('Permisos solicitados, estado de la cámara:', camera);
    return camera === 'granted';
  }

  // Verificar permisos de la cámara
  private async checkCameraPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.checkPermissions();
    console.log('Permisos de la cámara verificados:', camera);
    if (camera !== 'granted') {
      return this.requestCameraPermissions();
    }
    return true;
  }

  // Iniciar el escaneo con la cámara
  async startCameraScan(): Promise<any> {

    const isSupported = await BarcodeScanner.isSupported();
    if (!isSupported) {
      console.log('El escaneo desde imagen no está soportado.');
      return;
    }

    const hasPermission = await this.checkCameraPermissions();
    if (!hasPermission) {
      console.log('Permisos de la cámara denegados.');
      return;
    }

    try{

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode]
      });

      if (barcodes && barcodes.length > 0) {
        console.log('Código QR encontrado en la imagen:', barcodes[0].displayValue);
        return barcodes[0].displayValue

      } else {
        console.log('No se encontró ningún código QR en la imagen.');
      }

    }catch (error){
      console.error('Error al iniciar el escaneo de la cámara:', error);
    }
    
  }

  async scanFromImageV2(): Promise<any> {
    console.log('Iniciando scan de img v0.3')
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
  
      if (image && image.webPath) {
        // Convertir la URI a un blob y guardarlo en el Filesystem para que sea accesible
        const response = await fetch(image.webPath);
        const blob = await response.blob();
  
        const savedFile = await Filesystem.writeFile({
          path: `barcode-image.jpg`,
          directory: Directory.Cache,
          data: await this.blobToBase64(blob),
        });
  
        const filePath = savedFile.uri;
  
        // Leer el archivo guardado desde el sistema de archivos
        const result = await BarcodeScanner.readBarcodesFromImage({
          path: filePath,
        });
  
        if (result.barcodes.length > 0) {
          console.log('Código QR encontrado:', result.barcodes[0].displayValue);
          return result.barcodes[0].displayValue
        } else {
          console.log('No se encontraron códigos QR en la imagen.');
        }
      }
    } catch (error) {
      console.error('Error al escanear desde la imagen:', error);
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

}
