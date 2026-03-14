import sgMail from "@sendgrid/mail";

export class EmailService {
    constructor(){
        sgMail.setApiKey("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");
    }

    async sendInterviewScheduledEmail(details){
        console.log("Email Service called with: ", details);
        const msg = {
            to: "demonhiatus@gmail.com",
            from: "baaylouise@gmail.com",
            subject: `Interview is scheduled - ${details.companyName}`,
            text:`Interview Scheduled for ${details.companyName}
                Role: ${details.roleTitle}
                Start: ${details.interviewStart}
                End: ${details.interviewEnd}
                Notes: ${details.notes ?? ""}`,
            html: `
                <h2>Interview Scheduled</h2>
                <p><Company: ${details.companyName}</p>
                <p><Role: ${details.roleTile}</p>
                <p><Start: ${details.interviewStart}</p>
                <p><End: ${details.interviewEnd}</p>
                <p><Notes: ${details.notes ?? ""}</p>`
        };

        try{
            const response = await sgMail.send(msg);
            console.log("SendGrid response status: ", response[0].statusCode);
            return {ok: true};
        }catch (err){
            console.error("SendGrid Error:", err.response?.body || err.message);
            throw err;
        }
    }
}