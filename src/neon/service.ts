export interface Service {
  readonly id: string;
}

export interface ServiceMeta {
  readonly id: string;
}

export interface ServiceType {
  new (...args: any): any;
  readonly id: string;
}

export interface ServiceProvider {
  readonly getService: <T extends Service>(id: string) => T | undefined;
}

export class NeonServiceProvider {
  private _services: Record<string, Service> = {};

  public register(service: Service) {
    this._services[service.id] = service;
  }

  public getService<T extends ServiceType>(type: T): InstanceType<T> {
    const service = this._services[type.id];
    if (service instanceof type) {
      return service as InstanceType<T>;
    }

    throw new Error(`Service registered with ID '${type.id}' does not match type '${type.name}'`);
  }
}
