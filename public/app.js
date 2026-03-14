
const createForm = document.getElementById("createForm");
const createMsg = document.getElementById("createMsg");
const tbody = document.getElementById("appsTbody");

const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");
const sortBySelect = document.getElementById("sortBy");
const refreshBtn = document.getElementById("refreshBtn");

const selectedDiv = document.getElementById("selected");
const interviewPanel = document.getElementById("interviewPanel");
const interviewMsg = document.getElementById("interviewMsg");
const scheduleInterviewBtn = document.getElementById("scheduleInterviewBtn");
const clearInterviewBtn = document.getElementById("clearInterviewBtn");

console.log("scheduleInterviewBtn =", scheduleInterviewBtn);
console.log("clearInterviewBtn =", clearInterviewBtn);
console.log("interviewPanel =", interviewPanel);
console.log("selectedDiv =", selectedDiv);

let selectedApplicationId = null;

console.log("Frontend JS loaded");//making sure that it's running

refreshBtn.addEventListener("click", loadApplications);


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

    console.log("Sending the body: ", body);

    try{
        const res = await fetch("/api/applications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
    });

    const data = await res.json();

    if(!res.ok) {
        createMsg.textContent = data.error || "Create failed.";
        return;
    }

    createMsg.textContent = "Job Application Created Successfully.";
    createForm.reset();
    await loadApplications();
    console.log("Created: ", data);

    } catch (err) {
        console.error(err);
        createMsg.textContent = err.message;
    }
});

async function loadApplications(){
    try{
        const params = new URLSearchParams();
        const search = searchInput.value.trim();
        const status = statusSelect.value;
        const sortBy = sortBySelect.value;

        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (sortBy) params.set("sortBy", sortBy);

        const url = `/api/applications?${params.toString()}`;
        console.log("URL that we are getting is: ", url);

        const res = await fetch(url);
        const apps = await res.json();

        tbody.innerHTML = "";

        for (const app of apps){
            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>${app.company_name}</td>
            <td>${app.role_title}</td>
            <td>${app.current_status}</td>
            <td>${app.date_applied}</td>
            <td>${app.updated_at}</td>
            <td><button class="viewBtn" data-id="${app.id}">View</button></td>
            `;

            tbody.appendChild(tr);
        }

        document.querySelectorAll(".viewBtn").forEach(btn => {
            btn.addEventListener("click", async () => {
                await loadSelectedApplication(btn.dataset.id);
            });
        });
    } catch (err) {
        console.error("Failed to load applications: ", err);
    }
}

async function loadSelectedApplication(id){
    try{
        const res = await fetch(`/api/applications/${id}`);
        const data = await res.json();

        if(!res.ok){
            throw new Error(data.error || "Failed to load application");
        }

        selectedApplicationId = Number(id);
        
        const app = data.app;

        selectedDiv.innerHTML = `
        <strong>Company:</strong>${app.company_name}<br>
        <strong>Role:</strong> ${app.role_title} <br>
        <strong>Status:</strong> ${app.current_status} <br>
        <strong>Applied:</strong> ${app.date_applied ?? ""} <br>
        <strong>Notes:</strong> ${app.notes ?? ""}`;

        interviewPanel.style.display = "block";//reveal interview panel

        document.getElementById("interviewStart").value = app.interview_start;
        document.getElementById("interviewEnd").value = app.interview_end;
        document.getElementById("interviewNote").value = "";
    } catch (err) {
        console.error(err);
        selectedDiv.textContent = err.message;
    }
}

scheduleInterviewBtn.addEventListener("click", async () => {
    if(!selectedApplicationId){
        interviewMsg.textContent = "Select an application first";
        return;
    }
    
    await scheduleInterview(selectedApplicationId);
});

clearInterviewBtn.addEventListener("click", async () => {
    
    console.log("clear interview is clicked");
    const res = await fetch(`/api/applications/${selectedApplicationId}/interview`,{
        method: "DELETE"
    });

    const data = await res.json();

    if(!res.ok){
        interviewMsg.textContent = data.error || "Failed to clear interview";
        return;
    }

    interviewMsg.textContent = "Interview cleared.";

    await loadApplications();
    await loadSelectedApplication(selectedApplicationId);
})

async function scheduleInterview(id){
    const start = document.getElementById("interviewStart").value;
    const end = document.getElementById("interviewEnd").value;
    const note = document.getElementById("interviewNote").value;

    if(!start || !end) {
        interviewMsg.textContent = "Start and end times required";
        return;
    }

    const res = await fetch(`/api/applications/${id}/interview`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
            note
        })
    });

    const data = await res.json();

    if(!res.ok){
        interviewMsg.textContent = data.error || "Failed to schedule interview";
        return;
    }

    interviewMsg.textContent = "Interview Scheduled";

    await loadApplications();
    await loadSelectedApplication(id);
}

function toDateTimeLocal(isoString){
    const date = new Date(isoString);
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offsetMs);
    return localDate.toISOString.slice(0, 16);
}

loadApplications();