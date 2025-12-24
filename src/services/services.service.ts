import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  // private services: ServiceEntity[] = [];

  findAll() {
    return this.prisma.service.findMany();
  }

  create(data: Omit<ServiceEntity, 'id' | 'status'>) {
    return this.prisma.service.create({
      data,
    });
    // const service: ServiceEntity = {
    //   id: randomUUID(),
    //   status: 'ACTIVE',
    //   ...data,
    // };

    // this.services.push(service);

    // return service;
  }

  update(id: string, data: Partial<ServiceEntity>) {
    return this.prisma.service.update({
      where: { id },
      data,
    });

    // if (!service) return null;

    // Object.assign(service, data);

    // return service;
  }

  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
    // this.services.find((service) => service.id !== id);
  }
}
