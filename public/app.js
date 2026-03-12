const createForm = document.getElementById("createForm");
const createMsg = document.getElementById("createMsg");

createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(createForm);

    const body = {
        companyName: form.get("companyName"),
        roleTitle: form.get("roleTitle"),
        jobUrl: form.get("jobUrl"),
        notes: form.get("notes"),
        dateApplied: form.get("dateApplied") || null,
        salaryMin: form.get("salaryMin") || null,
        salaryMax: form.get("salaryMax") || null
    };

    const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "appliactions/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if(res.ok) {
        createMsg.textContent = "Job Application Created Successfully.";
        console.log(data);
    } else {
        createMsg.textContent = data.error || "Create failed.";
    }
});