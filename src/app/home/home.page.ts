import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonItem, IonInput, AlertController, IonIcon} from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonItem, IonInput, FormsModule, IonIcon, RouterLink],
})
export class HomePage implements OnInit { 

  ipServidor: string = ''; 
  usuario = {
      correo: '',
      contra: ''
  };

  constructor(
    private alertController: AlertController, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() { }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    // 1. Validar que TODOS los campos estén llenados (IP, Correo y Contraseña)
    if (this.ipServidor.trim() === '' || this.usuario.correo.trim() === '' || this.usuario.contra.trim() === '') {
      this.mostrarAlerta('Todos los campos son obligatorios. Por favor, llena la IP, el correo y la contraseña.');
      return;
    }

    console.log('Conectando a la IP:', this.ipServidor);

    // 2. Armar la URL utilizando estrictamente la IP ingresada
    const urlAPI = `http://${this.ipServidor.trim()}/api_ionic/login.php`;

    // 3. Enviar los datos por POST a PHP
    this.http.post(urlAPI, this.usuario).pipe(
        timeout(16000) 

        ).subscribe({
      next: (respuesta: any) => {
        
        // Si PHP responde con éxito (Conectó a la BD y las credenciales existen)
        if (respuesta.status === 'success') {
          this.mostrarAlerta('Conexión a la base de datos exitosa. ¡Bienvenido!');
          this.router.navigate(['/menu']);
          
        } 
        // Si PHP responde con un error (Error de conexión desde conexion.php o credenciales inválidas)
        else if (respuesta.status === 'error') {
          this.mostrarAlerta(respuesta.mensaje);
        }
        
      },
      error: (error) => {
        // Si la aplicación no puede comunicarse con XAMPP por red o IP equivocada
        console.error('Error de red:', error);
        this.mostrarAlerta('No se pudo conectar al servidor. Verifica que tu IP sea correcta y XAMPP esté encendido.');
      }
    });
  }
}