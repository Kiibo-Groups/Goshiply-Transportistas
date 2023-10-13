import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsVehiclePage } from './details-vehicle.page';

describe('DetailsVehiclePage', () => {
  let component: DetailsVehiclePage;
  let fixture: ComponentFixture<DetailsVehiclePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsVehiclePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
