import { Component } from '@angular/core';
import { AiMessage } from '../../../../shared/ui/ai-message/ai-message';
import { ResumenPerfil } from '../../components/perfil/resumen-perfil/resumen-perfil';
import { DatosPerfil } from '../../components/perfil/datos-perfil/datos-perfil';
import { AccionesPerfil } from '../../components/perfil/acciones-perfil/acciones-perfil';
@Component({
  selector: 'app-perfil',
  imports: [AiMessage, ResumenPerfil, DatosPerfil, AccionesPerfil],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {}

