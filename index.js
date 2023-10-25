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
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
        
    })
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf-8', (err) => {
            if (err) {
                console.error(err)
                return;
            }
            resolve(true)
        })
    })
}

app.get('/', (req, res) => {
    readFile('./tasks.json')
    .then(tasks => {
        res.render('index.ejs', {
            tasks: tasks,
            error: null
        })
    })
})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = req.params.taskId
    readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if (task.id == deletedTaskId) {
                    tasks.splice(index, 1)
                }
            })
            data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
})

app.post('/', (req, res) => {
    let error = null
    if (req.body.task.trim().length === 0) {
        error = 'Please insert correct task data'
        readFile('./tasks.json')
        .then(tasks => {
            res.render('index.ejs', {
                tasks: tasks,
                error: error
            })
        })
    } else {
    readFile('./tasks.json')
        .then(tasks => {
            let index
            if (tasks.length === 0) {
                index = 0
            } else {
                index = tasks[tasks.length - 1].id + 1
            }

            const newTask = {
                "id": index,
                "task": req.body.task
            }
            tasks.push(newTask)
            data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
    }
})

app.get('/delete-tasks', (req, res) => {
    // reads the file
    readFile('./tasks.json')
        .then(tasks => {
            // empties the list from all elements
            tasks.splice(0, tasks.length)
            // writes the empty list to the json file and redirects the client to the index page
            data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
})


app.listen(3000, () => {
    console.log('app listening on port 3000')
})