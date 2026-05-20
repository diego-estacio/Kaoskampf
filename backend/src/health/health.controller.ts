import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get()
  healthCheck() {
    return {
      status: "ok",
      service: "Hubee Backend API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get("health")
  detailedHealth() {
    return {
      status: "ok",
      service: "Hubee Backend API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    };
  }
}
