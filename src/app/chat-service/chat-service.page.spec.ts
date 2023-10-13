import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatServicePage } from './chat-service.page';

describe('ChatServicePage', () => {
  let component: ChatServicePage;
  let fixture: ComponentFixture<ChatServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
