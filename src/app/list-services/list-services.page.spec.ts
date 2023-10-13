import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListServicesPage } from './list-services.page';

describe('ListServicesPage', () => {
  let component: ListServicesPage;
  let fixture: ComponentFixture<ListServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
