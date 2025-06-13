import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEstudiante } from './categoria-estudiante';

describe('CategoriaEstudiante', () => {
  let component: CategoriaEstudiante;
  let fixture: ComponentFixture<CategoriaEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEstudiante],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaEstudiante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
