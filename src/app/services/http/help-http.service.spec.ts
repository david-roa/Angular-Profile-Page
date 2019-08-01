import { TestBed } from '@angular/core/testing';

import { HelpHttpService } from './help-http.service';

describe('HelpHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelpHttpService = TestBed.get(HelpHttpService);
    expect(service).toBeTruthy();
  });
});
