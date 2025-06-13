import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaProfesor } from './categoria-profesor';

describe('CategoriaProfesor', () => {
  let component: CategoriaProfesor;
  let fixture: ComponentFixture<CategoriaProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaProfesor],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaProfesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
