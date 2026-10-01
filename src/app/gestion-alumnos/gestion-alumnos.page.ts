import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonSelect,IonSelectOption, IonList, IonInput} from '@ionic/angular';

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  standalone: true,
  styleUrls: ['./gestion-alumnos.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonButton, IonSelectOption, IonList, IonSelect]
})
export class GestionAlumnosPage implements OnInit {

  alumnos = {n_control:'', nombre:'', apat:'', amat:'', fecha_nac:'', genero:'', fk_caralu:'' }
  lista_carreras : any[] = [];

  constructor(private alertController:AlertController, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // 2. Llamamos a la función de carga en cuanto se abre la pantalla
    this.cargarCarreras();
  }

  // 3. Función que descarga los datos desde PHP
  cargarCarreras() {
    const urlObtener = 'http://192.168.100.250/api_ionic/obtener_carreras.php';
    
    this.http.get(urlObtener).subscribe({
      next: (respuesta: any) => {
        // Llenamos la lista con lo que envíe la base de datos
        this.lista_carreras = respuesta;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al descargar las carreras', error);
      }
    });
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
    if (this.alumnos.nombre.trim() === '') {
      this.mostrarAlerta('El nombre no puede estar vacío');
      return;
    }
    // --- NUEVA VALIDACIÓN DE EDAD ---
    if (this.alumnos.fecha_nac.trim() === '') {
      this.mostrarAlerta('La fecha de nacimiento es obligatoria');
      return;
    }

    // Cálculo exacto de la edad tomando en cuenta meses y días
    const fechaNacimiento = new Date(this.alumnos.fecha_nac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();

    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 12 || edad > 100) {
      this.mostrarAlerta('La edad del alumno debe ser mínima de 12 y máxima de 100 años');
      return;
    }
    // ---------------------------------

    console.log('Datos listos para enviar:', this.alumnos);


    // 2. Definir la ruta de tu nuevo archivo PHP para la gestión de alumnos
    const urlAPI = 'http://192.168.100.250/api_ionic/gestion_alumnos.php';

    // 3. Enviar los datos por POST y escuchar la respuesta del servidor
    this.http.post(urlAPI, this.alumnos).subscribe({
      next: (respuesta: any) => {
        // Si tu PHP responde con éxito
        if (respuesta.status === 'success') {
          this.mostrarAlerta('Registro Exitoso');
          
          // Opcional: Limpiar el formulario después de guardar
          this.alumnos = {n_control:'', nombre:'', apat:'', amat:'', fecha_nac:'', genero:'', fk_caralu:''};
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
