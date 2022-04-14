const express = require("express");
const app = express();
const PORT = 3001;
const fs = require("fs");
const path = require("path");



const pathToFile = path.resolve("./data.json");

const getResources = () => JSON.parse(fs.readFileSync(pathToFile))

app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Hello World")
})

app.get("/api/resources/:id", (req, res)=>{
    const resources = getResources();
    const { id } = req.params;
    const resource = resources.find(resource => resource.id === id)
    res.send(resource)
})

app.patch("/api/resources/:id", (req, res)=>{
    const resources = getResources();
    const { id } = req.params;
    const index = resources.findIndex(resource => resource.id === id)
    const activeResource = resources.find(resource => resource.status === "active")

    if(resources[index].status === "completed"){
        return res.status(422).send("This resource is completed!")
    }

    resources[index] = req.body;

    //active resources related functionality
   
    
    if(req.body.status === "active"){
        if(activeResource){
            return res.status(422).send("There is an active resource already!")
        }
        resources[index].status = "active";
        resources[index].activationTime = new Date();
    }

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) =>{
        if(error){
            return res.status(422).send("Cannot store data in the file");
        };

        return res.send("Data updated successfully");
    })
   
})

app.get("/api/activeresource", (req, res)=>{
    const resources = getResources();
    const activeresource = resources.find(resource => resource.status === "active")
    res.send(activeresource)
})


app.get("/api/resources", (req, res)=>{
    const resources = getResources();
    res.send(resources)
})

app.post("/api/resources", (req, res)=>{
    //const stringfyData = fs.readFileSync(pathToFile)
    const resources = getResources();
   
    const resource = req.body;
    resource.createdAt = new Date();
    resource.status = "inactive";
    resource.id = Date.now().toString();
    resources.unshift(resource);

    fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) =>{
        if(error){
            return res.status(422).send("Cannot store data in the file");
        };

        return res.send("Data saved successfully");
    })  
    
        
})

app.listen(PORT, () =>{
    console.log("server is running on PORT:" + PORT)
})


