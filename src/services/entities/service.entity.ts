export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

export class ServiceEntity {
  id: string;
  title: string;
  description: string;
  price: number;
  status: ServiceStatus;
}
