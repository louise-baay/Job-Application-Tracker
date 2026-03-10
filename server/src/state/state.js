import { ApplicationState } from "./ApplicationState";

/**
 * Intereted
 * Applied
 * Waiting
 * Interview
 * Offer
 * Accepted
 * Rejected
 * Withdrawn
 */

export class InterestedState extends ApplicationState {
    constructor() { super("Interested"); }
    canTransitionTo(next){
        return ["Applied", "Withdrawn"].includes(next);
    }
}

export class AppliedState extends ApplicationState {
    constructor() { super("Applied"); }
    canTransitionTo(next){
        return["Waiting", "Interviewing", "Rejected", "Withdrawn"].includes(next);
    }
}

export class WaitingState extends ApplicationState {
    constructor() { super("Waiting"); }
    canTransitionTo(next){
        return ["Interviewing", "Rejected", "Withdrawn"].includes(next);
    }
}

export class InterviewingState extends ApplicationState {
    constructor() { super("Interviewing"); }
    canTransitionTo(next){
        return ["Interviewed", "Rejected", "Withdrawn"].includes(next);
    }
}

export class InterviewedState extends ApplicationState {
    constructor() { super("Interviewed"); }
    canTransitionTo(next){
        return ["Offer", "Rejected", "Withdrawn"].includes(next);
    }
}

export class OfferState extends ApplicationState {
    constructor() { super("Offer"); }
    canTransitionTo(next){
        return ["Accepted", "Rejected", "Withdrawn"].includes(next);
    }
}

export class AcceptedState extends ApplicationState {
    constructor() { super("Accepted"); }
    canTransitionTo(next){
        return [];
    }
}

export class RejectedState extends ApplicationState {
    constructor() { super("Rejected"); }
    canTransitionTo(next){
        return [];
    }
}

export class WithdrawnState extends ApplicationState {
    constructor() { super("Withdrawn"); }
    canTransitionTo(next){
        return [];
    }
}

export function stateFromStatus(status){
    switch (status){
        case "Interested": return new InterestedState();
        case "Applied": return new AppliedState();
        case "Waiting": return new WaitingState();
        case "Interviewing": return new InterviewingState();
        case "Interviewed": return new InterviewedState();
        case "Offer": return new OfferState();
        case "Accepted": return new AcceptedState();
        case "Rejected": return new RejectedState();
        case "Withdrawn": return new WithdrawnState();
        default:
            throw new Error(`Unkown status: ${statues}`);
    }
}

