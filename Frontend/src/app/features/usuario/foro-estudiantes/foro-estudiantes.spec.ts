import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForoEstudiantes } from './foro-estudiantes';

describe('ForoEstudiantes', () => {
  let component: ForoEstudiantes;
  let fixture: ComponentFixture<ForoEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForoEstudiantes],
    }).compileComponents();

    fixture = TestBed.createComponent(ForoEstudiantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
