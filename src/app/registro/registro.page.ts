import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonList, IonButton, IonText } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  // Se agregó IonText a los imports
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonList, IonButton, IonText]
})
export class RegistroPage implements OnInit {
  usuario = { nombre: '', matricula: '', correo: '' };
  
  // 1. Variable para almacenar el mensaje del servidor
  mensajeServidor: string = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() { }
  

  guardarDatos() {
    this.mensajeServidor = ''; 

    const urlAPI = 'http://laptop-vsul10aq.local/api_ionic/registro.php';

    this.http.post(urlAPI, this.usuario).subscribe({
      next: (respuesta: any) => {
        
        if(respuesta.status === 'success') {
          this.router.navigate(['/home']);
        } else if (respuesta.status === 'error') {
          // Asignas el mensaje
          this.mensajeServidor = respuesta.mensaje;
          
          // ¡ESTA ES LA LÍNEA MÁGICA! Fuerza a la pantalla a mostrar el mensaje al instante
          this.cdr.detectChanges(); 
        }
      },
      error: (error) => {
        this.mensajeServidor = 'Error al procesar la solicitud en el servidor.';
        this.cdr.detectChanges(); // También lo ponemos aquí por si falla la conexión
      }
    });
  }
}