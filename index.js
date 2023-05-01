const express = require('express');
const app = express();
const api = require('./data.json')
const cors = require('cors')


app.use(cors())
app.use(express.json())

// Catagory data Load---
app.get("/data/api", (req, res) => {
    res.send(api)
})

// load data by using catagory_id = http://localhost:3000/catagory/using_id/3
const allData = require('./JsonData/user.json')
app.get("/catagory/using_id/:id", (req, res) => {
    const id = req.params.id
    const finallData = allData.filter(f => f.category_id == id)
    res.send(finallData)
});






// 2.. load all api url = http://localhost:3000/post .

const post = require('./JsonData/poost.json')

app.get('/post', (req, res) => {
    res.send(post)
})

// 3.. loas api using ID = 

app.get('/post/:id', (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    const selectedData = post.find(p => p.id == id)
    res.send(selectedData)
})


// 4.. app.get('/new/api-collection', async (req, res) => {
//     res.send(api)
// })

// app.post('/new/api-collection', (req, res) => {
//     console.log(req.body);
//     console.log('done again ');
// })

app.listen(3000, () => {
    console.log(`it's done`);
})