import { Module, Global } from "@nestjs/common";
import { PlannerController } from "./planner.controller";
import { PlannerWebhookService } from "./planner-webhook.service";

@Global()
@Module({
  controllers: [PlannerController],
  providers: [PlannerWebhookService],
  exports: [PlannerWebhookService],
})
export class PlannerModule {}
