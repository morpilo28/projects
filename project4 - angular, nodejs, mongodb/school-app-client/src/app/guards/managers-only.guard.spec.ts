import { TestBed, async, inject } from '@angular/core/testing';

import { ManagersOnlyGuard } from './managers-only.guard';

describe('ManagersOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagersOnlyGuard]
    });
  });

  it('should ...', inject([ManagersOnlyGuard], (guard: ManagersOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
