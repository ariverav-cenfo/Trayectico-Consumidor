import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { Rol, RolService } from '../services/rol.service';
import { adminGuard, usuarioGuard } from './rol.guard';

describe('Guards de rol', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it.each<[Rol, true | string, true | string]>([
    ['publico', '/', '/'],
    ['usuario', true, '/acceso-denegado'],
    ['admin', true, true],
  ])('aplica los permisos del rol %s', (rol, resultadoUsuario, resultadoAdmin) => {
    TestBed.inject(RolService).simular(rol);
    const router = TestBed.inject(Router);
    const snapshot = router.routerState.snapshot;

    const resultados = TestBed.runInInjectionContext(() => [
      usuarioGuard(snapshot.root, snapshot),
      adminGuard(snapshot.root, snapshot),
    ]);

    expect(resultados.map((resultado) =>
      resultado instanceof UrlTree ? router.serializeUrl(resultado) : resultado,
    )).toEqual([resultadoUsuario, resultadoAdmin]);
  });
});
