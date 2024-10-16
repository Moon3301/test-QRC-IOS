import { TestBed } from '@angular/core/testing';

import { OrganizationService } from './organization.service';
import { ApiService } from '../api/api.service';
import { SecurityService } from '../Security/security.service';
import { api_url } from '../utilities';
import { Store } from '@ngrx/store'; // Importa Store

describe('OrganizationService', () => {

  let service: OrganizationService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;

  beforeEach(() => {

    const apiSpy = jasmine.createSpyObj('ApiService', ['createRequest']);
    const securitySpy = jasmine.createSpyObj('SecurityService', ['loadToken'], { currentToken: 'fake-token' });
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']); // Mock Store
    TestBed.configureTestingModule({
      providers: [
        OrganizationService,
        { provide: ApiService, useValue: apiSpy },
        { provide: SecurityService, useValue: securitySpy },
        { provide: Store, useValue: storeSpy },
      ]
    });

    service = TestBed.inject(OrganizationService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    securityServiceSpy = TestBed.inject(SecurityService) as jasmine.SpyObj<SecurityService>;


  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load organizations', async () => {
    const mockOrganizations = [{ Descr: 'Test Organization', ManagerPhone: 'Test ManagerPhone', SupervisorPhone:'Test SupervisorPhone' }];
    apiServiceSpy.createRequest.and.returnValue(Promise.resolve({ data: mockOrganizations }));

    const result = await service.getOrganizations();

    expect(apiServiceSpy.createRequest).toHaveBeenCalledWith(`${api_url}/organizations`, 'GET', undefined, 'fake-token');
    expect(result).toEqual(mockOrganizations);
  });

  it('should add a new organization', async () => {
    const newOrganization = { Descr: 'Test Organization', ManagerPhone: 'Test ManagerPhone', SupervisorPhone:'Test SupervisorPhone'};
    const mockResponse = { success: true };
    apiServiceSpy.createRequest.and.returnValue(Promise.resolve(mockResponse));

    const result = await service.addOrganization(newOrganization);

    expect(apiServiceSpy.createRequest).toHaveBeenCalledWith(`${api_url}/organizations`, 'POST', newOrganization, 'fake-token');
    expect(result).toEqual(mockResponse);
  });

  it('should handle missing response data', async () => {
    securityServiceSpy.currentToken = 'fake-token';
    apiServiceSpy.createRequest.and.returnValue(Promise.resolve(undefined));

    const result = await service.getOrganizations();

    expect(result).toBeNull();
    expect(apiServiceSpy.createRequest).toHaveBeenCalled();
  });

});
