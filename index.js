const express = require('express')
const app = express()
const fs = require('fs')

const path = require('path')
app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        // get data from file
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return;
            }
            // tasks list data from file
            const tasks = data.split('\n')
            resolve(tasks)
        })
        
    })
}

app.get('/', (req, res) => {
    readFile('./tasks')
    .then(tasks => {
        res.render('index.ejs', {tasks: tasks})
    })
})

app.post('/', (req, res) => {
    readFile('./tasks')
        .then(tasks => {
            tasks.push(req.body.task)
            const data = tasks.join('\n')
            fs.writeFile('./tasks', data, err => {
                if (err) {
                    console.error(err)
                    return;
                }
                res.redirect('/')
            })
        })
})

app.listen(3000, () => {
    console.log('app listening on port 3000')
})