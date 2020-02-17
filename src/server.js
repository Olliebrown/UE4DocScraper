import fs from 'fs'
import path from 'path'
import Express from 'express'

import { getPaths } from './docPaths'

// Different doc paths
const paths = getPaths()

// Initialize the express app
const app = new Express()

// Log all requests for debugging purposes
app.use((req, res, next) => {
    console.log(req.method + ' request for ' + req.url)
    next()
})

// Setup a re-direction from the root
app.get('/', (req, res) => {
    res.redirect('/en-US/index.html')
})

// Setup each doc path to serve statically
for (const docPath of paths) {
    console.log('Looking for ' + docPath)
    if (fs.existsSync(docPath)) {
        console.log('\tfound ' + docPath)
        app.use(Express.static(docPath))
    }
}

// Start the server listening
const server = app.listen(3000, () => {
    const address = server.address()
    console.log('Server listening on port ' + address.port)
})
