import express from "express";
import { ApplicationFacade } from "../facade/ApplicationFacade.js";

export const applicationsRouter = express.Router();
const facade = new ApplicationFacade();

applicationsRouter.get("/", async (req, res) => {
    try {
        const apps = await facade.listApplication({
            status: req.query.status || null,
            status: req.query.search || null,
            sortBy: req.query.sortBy || null
        });
        
        res.json(apps);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.get("/report/pipeline", async (_req, res) => {
    try {
        const report = await facade.pipelineReport();
        res.json(report);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.get("/:id", async (req, res) => {
    try {
        const details = await facade.getApplicationDetails(Number(req.params.id));

        if(!details) {
            return res.status(404).json({error: "Not Found"});
        }
        res.json(details);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.post("/", async (req, res) => {
    try {
        console.log("POST information req.body: ", req.body);
        const created = await facade.createApplication(req.body);

        console.log("created: ", created);
        res.status(201).json(created);//successfull post
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.put("/:id", async (req, res) => {
    try {
        const updated = await facade.updateApplication(Number(req.params.id), req.body);
        if(!updated){
            return res.status(404).json({ error: "Not found" });
        }
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.delete("/:id", async (req, res) => {
    try {
        const deleted = await facade.deleteApplication(Number(req.params.id));
        if(!deleted){
            return res.status(404).json({ error: "Not found" });
        }
        res.json(deleted)
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

applicationsRouter.post("/:id/status", async (req, res) => {
    try {
        const updated = await facade.changeStatus(Number(req.params.id), req.body);
        if(!updated){
            return res.status(404).json({ error: "Not found" });
        }
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

//for adding interview later
/*
applicationsRouter.post("/:id/interview", async (req, res) => {
    try {
        
    } catch (e) {
        
    }
});

applicationsRouter.delete("/:id/interview", async (req, res) => {
    try {
        
    } catch (e) {
        
    }
});*/