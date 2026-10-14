import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonItem, IonInput, IonButtons} from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonItem, IonInput, FormsModule, IonButtons, RouterLink],
})
export class MenuPage {

  ipServidor: string = ''; // Variable para almacenar la IP del servidor
  usuario = {
      correo: '',
      contra: ''
    };

  constructor(private router: Router) {}

  login() {
    // Al ejecutar esta función, ya puedes usar los datos capturados
    console.log('Conectando a la IP:', this.ipServidor);
    console.log('Correo ingresado:', this.usuario.correo);
  }
}
