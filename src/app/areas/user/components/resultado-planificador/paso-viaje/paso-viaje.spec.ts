import { ComponentFixture, TestBed } from "@angular/core/testing"
import {PasoViaje} from './paso-viaje'


describe('PasoViaje', () => {
    let fixture: ComponentFixture<PasoViaje>;
    let el: HTMLElement;


beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [PasoViaje],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoViaje);
    el = fixture.nativeElement

    fixture.componentRef.setInput('step', {
        title: 'Caminar',
        description: 'Caminar 150 metros',
    });
    fixture.componentRef.setInput('number', 1);
    fixture.detectChanges();
    });

it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
});

it('Presenta el titulo y description del paso del viaje', () => {
    expect(el.textContent).toContain('Caminar');
    expect(el.textContent).toContain('Caminar 150 metros');
});

it('Presenta el numero de paso', () =>{
    expect(el.textContent).toContain('1');
});

it('actualiza los datos cuando cambia la entrada', () => {
    fixture.componentRef.setInput('number', 2);
    fixture.detectChanges();
    expect(el.textContent).toContain('2');
});

});