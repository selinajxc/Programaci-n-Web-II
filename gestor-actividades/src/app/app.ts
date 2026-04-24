import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Definición del modelo de una actividad
// Aquí especifico que datos tendrá cada actividad
interface Actividad {
  nombre: string;
  materia: string;
  fecha: string;
  prioridad: string;
  completada: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true, // Uso de standalone components
  imports: [CommonModule, FormsModule], //Importar módulos necesarios para *ngFor y ngModel
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  // Signal principal donde guardo todas las actividades
  actividades = signal<Actividad[]>([]);

  // Variables del formulario que se conectan con ngModel
  nombre = '';
  materia = '';
  fecha = '';
  prioridad = '';

  // Signal para el filtro actual
  filtro = signal<'todas' | 'pendientes' | 'completadas'>('todas');

  // calcula automáticamente el total de actividades
  total = computed(() => this.actividades().length);

  // cuenta las actividades que no están completadas
  pendientes = computed(() =>
    this.actividades().filter(a => !a.completada).length
  );

  // cuenta las actividades completadas
  completadas = computed(() =>
    this.actividades().filter(a => a.completada).length
  );

  // devuelve la lista dependiendo del filtro seleccionado
  actividadesFiltradas = computed(() => {
    // Si el filtro es pendientes
    if (this.filtro() === 'pendientes') {
      return this.actividades().filter(a => !a.completada);
    }
     // Si el filtro es completadas
    if (this.filtro() === 'completadas') {
      return this.actividades().filter(a => a.completada);
    }
     // Si es Todas
    return this.actividades();
  });

  // Función para agregar actividad nurva
  agregarActividad() {

    // Validación de no permitir campos vacíos
    if (!this.nombre || !this.materia || !this.fecha || !this.prioridad) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Creo el objeto de la nueva actividad
    const nueva: Actividad = {
      nombre: this.nombre,
      materia: this.materia,
      fecha: this.fecha,
      prioridad: this.prioridad,
      completada: false // la act inicia como pendiente
    };

    // Inserto la actividad al inicio de la lista
    this.actividades.update(lista => [nueva, ...lista]);

    // Limpio el formulario después de agregar
    this.nombre = '';
    this.materia = '';
    this.fecha = '';
    this.prioridad = '';
  }

  // Cambiar estado de completado
  toggleEstado(index: number) {
    this.actividades.update(lista => {
      lista[index].completada = !lista[index].completada;
      return [...lista];
    });
  }

  // Eliminar actividad según su índice
  eliminarActividad(index: number) {
    this.actividades.update(lista =>
      lista.filter((_, i) => i !== index)
    );
  }
}