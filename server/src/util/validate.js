export function requireNonEmpty(fieldName, value){
    if(!value || !String(value).trim()){
        throw new Error(`${fieldName} is required!`);
    }
}

export function validateSalary(min, max){
    if(min != null && Number.isNaN(Number(min))){
        throw new Error("salaryMin must be a number!");
    }

    if(max != null && Number.isNaN(Number(max))){
        throw new Error("salaryMax must be a number!");
    }

    if(min != null && max != null && Number(min) > Number(max)){
        throw new Error("salaryMin must be less than or equal to salaryMax");
    }
}