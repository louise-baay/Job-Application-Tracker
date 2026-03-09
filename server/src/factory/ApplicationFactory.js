import { normalizeUrl } from "../util/normalize";
import { requireNonEmpty, validateSalary } from "../util/validate";

/**
 * Design Pattern: Factory
 * - Default Values
 * - Normalizing User input
 * - Validating required fields
 * - salary validation
 */

export class ApplicationFactory{
    create(dto){
        requireNonEmpty("companyName", dto.companyName);
        requireNonEmpty("roleTitle", dto.roleTitle);
        validateSalary(dto.salaryMin ?? null, dto.salaryMax ?? null);

        const defaultStatus = dto.dateApplied ? "Applied" : "Interested";

        return{
            companyName: String(dto.companyName).trim(),
            roleTitle: Strin(dto.roleTitle).trim(),
            jobUrl: normalizeUrl(dto.jobUrl),
            notes: dto.notes ? String(dto.notes) : null,
            salaryMin: dto.salaryMin != null ? Number(dto.salaryMin) : null,
            salaryMax: dto.salaryMax != null ? Number(dto.salaryMax) : null,
            currentStatus: dto.currentStatus ?? defaultStatus,
            dateApplied: dto.dateApplied ?? null,
            interviewStart: dto.interviewStart ?? null,
            interviewEnd: dto.interviewEnd ?? null,
            calendarEventId: dto.calendarEventId ?? null
        };
    }
}