const createForm = document.getElementById("createForm");
const createMsg = document.getElementById("createMsg");
const tbody = document.getElementById("appsTbody");

const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");
const sortBySelect = document.getElementById("sortBy");
const refreshBtn = document.getElementById("refreshBtn");

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
        createMsg.textContent = "Job Application Created Successfully.";

        createForm.reset();
        await loadApplications();
        return;
    }

    //createMsg.textContent = data.error || "Create failed.";
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

        const url = `api/applications?${params.toString()}`;
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
            <td><button data-id="${app.id}">View</button></td>
            `;

            tbody.appendChild(tr);
        }
    } catch (err) {
        console.error("Failed to load applications: ", err);
    }
}

loadApplications();