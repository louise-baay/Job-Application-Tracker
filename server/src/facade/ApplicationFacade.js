import { ApplicationRepository } from "../repositories/ApplicationRepository";
import { StatusHistoryRepository } from "../repositories/StatusHistoryRepository";
import { AuditLogRepositry } from "../repositories/AuditLogRepository";
import { ApplicationRepository } from "../repositories/ApplicationRepository";
import { stateFromStatus } from "../state/state";


/**
 * FACADE pattern
 * Controllers calls this class and coordinates
 * - Application repo
 * - Status history
 * - audit logs
 */