import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForoProfesores } from './foro-profesores';

describe('ForoProfesores', () => {
  let component: ForoProfesores;
  let fixture: ComponentFixture<ForoProfesores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForoProfesores],
    }).compileComponents();

    fixture = TestBed.createComponent(ForoProfesores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
