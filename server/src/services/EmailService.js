import sgMail from "@sendgrid/mail";

export class EmailService {
    constructor(){
        sgMail.setApiKey("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");
    }

    async sendInterviewScheduledEmail(details){
        const msg = {
            to: "baaylouise@gmail.com",
            from: "baaylouise@gmail.com",
            subject: `Interview is scheduled - ${details.company_name}`,
            text:`Interview Scheduled for ${details.company_name}
                Role: ${details.role_title}
                Start: ${details.interview_start}
                End: ${details.interview_end}
                Notes: ${details.notes ?? ""}`,
            html: `
                <h2>Interview Scheduled</h2>
                <p><Company: ${details.company_name}</p>
                <p><Role: ${details.role_tile}</p>
                <p><Start: ${details.interview_start}</p>
                <p><End: ${details.interview_end}</p>
                <p><Notes: ${details.notes ?? ""}</p>`
        };

        await sgMail.send(msg);
        return { ok: true };
    }
}