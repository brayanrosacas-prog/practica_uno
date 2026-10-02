import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonSelect,IonSelectOption, IonList, IonInput} from '@ionic/angular';

@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.page.html',
  standalone: true,
  styleUrls: ['./gestion-carreras.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonButton, IonSelectOption, IonList, IonSelect]
})
export class GestionCarrerasPage implements OnInit {

  carreras = {nombre:'', tipo:''}

  
  constructor(private alertController:AlertController, private http: HttpClient, private cdr: ChangeDetectorRef) { }
  
  ngOnInit() {
  }


  async mostrarAlerta(mensaje: string){
    const alert = await this.alertController.create({
      header: 'Atencion',
      message: mensaje,
      buttons : ['OK']


    });

    await alert.present();

  }

 validarGuardar() {
    // 1. Tu validación actual
    if (this.carreras.nombre.trim() === '') {
      this.mostrarAlerta('El nombre de la carrera no puede estar vacío');
      return;
    }


    console.log('Datos listos para enviar:', this.carreras);

    // 2. Definir la ruta de tu nuevo archivo PHP para la gestión de alumnos
    const urlAPI = 'http://laptop-vsul10aq.local/api_ionic/gestion_carreras.php';

    // 3. Enviar los datos por POST y escuchar la respuesta del servidor
    this.http.post(urlAPI, this.carreras).subscribe({
      next: (respuesta: any) => {
        // Si tu PHP responde con éxito
        if (respuesta.status === 'success') {
          this.mostrarAlerta('Registro Exitoso');
          
          // Opcional: Limpiar el formulario después de guardar
          this.carreras = {nombre:'', tipo:''};

          this.cdr.detectChanges();
        } 
        // Si tu PHP responde con un error programado (ej. número de control repetido)
        else if (respuesta.status === 'error') {
          this.mostrarAlerta(respuesta.mensaje);
        }
      },
      error: (error) => {
        // Si la petición falla a nivel de red (XAMPP apagado, error 404, etc.)
        console.error('Error de conexión:', error);
        this.mostrarAlerta('Error al conectar con el servidor PHP.');
      }
    });
  }

}
