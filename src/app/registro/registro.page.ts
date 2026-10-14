import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonList, IonButton, IonText, IonInputPasswordToggle, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonList, IonButton, IonText, IonInputPasswordToggle]
})
export class RegistroPage implements OnInit {
  
  usuario = { nombre: '', matricula: '', correo: '', contrasenia: '', confirmarPassword: '' };
  mensajeServidor: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private location: Location,
    private alertController: AlertController // <-- Herramienta para la ventana emergente
  ) { }

  ngOnInit() { }

  // 1. Función inteligente para regresar de donde viniste
  regresar() {
    this.location.back();
  }

  // 2. Función que dibuja la pantalla emergente de éxito
  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'El usuario ha sido creado con éxito.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Al presionar OK, ejecuta la función regresar() automáticamente
            this.regresar();
          }
        }
      ]
    });
    await alert.present();
  }

  // 3. Función principal para guardar
  guardarDatos() {
    this.mensajeServidor = ''; 
    const urlAPI = 'http://laptop-vsul10aq.local/api_ionic/registro.php';

    this.http.post(urlAPI, this.usuario).subscribe({
      next: (respuesta: any) => {
        
        // Si el registro fue exitoso en la base de datos
        if(respuesta.status === 'success') {
          
          // Limpiamos los campos
          this.usuario = { nombre: '', matricula: '', correo: '', contrasenia: '', confirmarPassword: '' };
          
          // Llamamos a la ventana emergente
          this.mostrarAlertaExito();
          
          // Forzamos a la pantalla a redibujarse para mostrar la alerta
          this.cdr.detectChanges(); 
          
        } else if (respuesta.status === 'error') {
          this.mensajeServidor = respuesta.mensaje;
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        this.mensajeServidor = 'Error al procesar la solicitud en el servidor.';
        this.cdr.detectChanges(); 
      }
    });
  }
}