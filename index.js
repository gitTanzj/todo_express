const express = require('express')
const app = express()
const fs = require('fs')

const path = require('path')
app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if (err) {
            console.err(err)
            return;
        }
        const tasks = data.split('\n')
        res.render('index.ejs', {tasks:tasks})
    })
})

app.listen(3000, () => {
    console.log('app listening on port 3000')
})