import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleContenido } from './detalle-contenido';

describe('DetalleContenido', () => {
  let component: DetalleContenido;
  let fixture: ComponentFixture<DetalleContenido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleContenido],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleContenido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
