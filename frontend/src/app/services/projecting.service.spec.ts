import { TestBed } from '@angular/core/testing';

import { ProjectingService } from './projecting.service';

describe('ProjectingService', () => {
  let service: ProjectingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
