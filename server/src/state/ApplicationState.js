/**
 * Design Pattern: State
 * Each application status can be represented by a state class that controls the transition from one state to te next
 */

export class ApplicationState{
    constructor(name){
        this.name = name;
    }

    canTransitionTo(_next){
        return false;
    }
}