import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './features/inicio/inicio';
import { Login } from './features/login/login';
import { Nosotros } from './features/nosotros/nosotros';
import { Registro } from './features/registro/registro';
import { Perfil } from './perfil/perfil';

import { BibliotecaProfesor } from './features/profesores/biblioteca/biblioteca';
import { CategoriaProfesor } from './features/profesores/categoria-profesor/categoria-profesor';
import { CursosProfesor } from './features/profesores/cursos-profesor/cursos';
import { DetalleContenidoProfesor } from './features/profesores/detalle-contenido-profesor/detalle-contenido';
import { DetalleCursoProfesor } from './features/profesores/detalle-curso-profesor/detalle-curso';
import { ForoProfesores } from './features/profesores/foro-profesores/foro-profesores';

import { Biblioteca } from './features/usuario/biblioteca/biblioteca';
import { CategoriaEstudiante } from './features/usuario/categoria-estudiante/categoria-estudiante';
import { Cursos } from './features/usuario/cursos/cursos';
import { DetalleContenido } from './features/usuario/detalle-contenido/detalle-contenido';
import { DetalleCurso } from './features/usuario/detalle-curso/detalle-curso';
import { ForoEstudiantes } from './features/usuario/foro-estudiantes/foro-estudiantes';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'nosotros', component: Nosotros },
  { path: 'perfil', component: Perfil },

  { path: 'usuario/biblioteca', component: Biblioteca },
  { path: 'usuario/categoria-estudiante', component: CategoriaEstudiante },
  { path: 'usuario/cursos', component: Cursos },
  { path: 'usuario/detalle-contenido', component: DetalleContenido },
  { path: 'usuario/detalle-curso', component: DetalleCurso },
  { path: 'usuario/foro-estudiantes', component: ForoEstudiantes },

  { path: 'profesores/biblioteca', component: BibliotecaProfesor },
  { path: 'profesores/categoria-profesor', component: CategoriaProfesor },
  { 
    path: 'profesores/cursos', 
    component: CursosProfesor,
    canActivate: [AuthGuard],
    data: { requiredRole: 2 } 
  },
  { path: 'profesores/detalle-contenido', component: DetalleContenidoProfesor },
  { path: 'profesores/detalle-curso', component: DetalleCursoProfesor },
  { path: 'profesores/foro-profesores', component: ForoProfesores },

  { path: '**', redirectTo: '/inicio' }, // Manejo de rutas incorrectas
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true, // Habilitar hash routing
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class app {}
