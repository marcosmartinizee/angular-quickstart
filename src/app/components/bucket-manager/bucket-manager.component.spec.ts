import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BucketManagerComponent } from './bucket-manager.component';
import { OciBucketService } from '../../services/oci-bucket.service';

describe('BucketManagerComponent', () => {
  let component: BucketManagerComponent;
  let fixture: ComponentFixture<BucketManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BucketManagerComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ OciBucketService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
