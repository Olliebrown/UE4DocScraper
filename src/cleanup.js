import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import replaceInFile from 'replace-in-file'
import wget from 'wget-improved'

import mergedirs from 'merge-dirs'
import { getPaths } from './docPaths'

// List of known missing resources
const missingFiles = [
    'https://docs.unrealengine.com:443/Include/CSS/fonts/open-sans-v15-latin-regular.woff',
    'https://docs.unrealengine.com:443/Include/CSS/fonts/open-sans-v15-latin-regular.woff2',
    'https://docs.unrealengine.com:443/Include/CSS/fonts/brutal/BrutalType-Regular/BrutalType-Regular.woff',
    'https://docs.unrealengine.com:443/Include/CSS/fonts/brutal/BrutalType-Bold/BrutalType-Bold.woff',
    'https://docs.unrealengine.com:443/Include/CSS/fonts/fontawesome/fa-regular-400.woff2',
    'https://docs.unrealengine.com:443/Include/CSS/fonts/fontawesome/fa-solid-900.woff2',
    'https://docs.unrealengine.com:443/Include/Images/windows_logo.png',
    'https://docs.unrealengine.com:443/Include/Images/epic_logo.png',
    'https://docs.unrealengine.com:443/Include/Images/button.png',
    'https://docs.unrealengine.com:443/Include/Images/button-open.png',
    'https://docs.unrealengine.com:443/Include/Images/button-closed.png',
    'https://docs.unrealengine.com:443/Include/Images/arrow_down.png'
]

// Different doc paths
const paths = getPaths()
const otherBase = paths[paths.length - 1]
const otherENUS = path.join(otherBase, 'en-US')
const otherImages = path.join(otherBase, 'images')
const otherInclude = path.join(otherBase, 'include')

// Make sure the other dirs exist
if (!fs.existsSync(otherBase)) {
    fs.mkdirSync(otherBase, { recursive: true })
}

if (!fs.existsSync(otherENUS)) {
    fs.mkdirSync(otherENUS, { recursive: true })
}

if (!fs.existsSync(otherImages)) {
    fs.mkdirSync(otherImages, { recursive: true })
}

if (!fs.existsSync(otherInclude)) {
    fs.mkdirSync(otherInclude, { recursive: true })
}

// Merge common files from other doc folders
for (const docPath of paths) {
    if (docPath !== otherBase && fs.existsSync(docPath)) {
        // Merge then delete 'images'
        if (fs.existsSync(path.join(docPath, 'images'))) {
            mergedirs(path.join(docPath, 'images'), otherImages, 'skip')
            child_process.execSync(`rm -rf "${path.join(docPath, 'images')}"`)
        }

        // Merge then delete 'include'
        if (fs.existsSync(path.join(docPath, 'include'))) {
            mergedirs(path.join(docPath, 'include'), otherInclude, 'skip')
            child_process.execSync(`rm -rf "${path.join(docPath, 'include')}"`)
        }
    }
}

// Grab missing resources
downloadMissingFiles(missingFiles, otherBase);

// Clean up bad base URLs
const urlRegexHTML = /(http(s)?:\/\/)(docs\.unrealengine\.com)(:443)?/g
const urlRegexJSCSS = /(http(s)?:\/\/)?(docs\.unrealengine\.com)(:443)?/g
const navBarRegex = /baseURL\+lang/g

replace(path.join(otherENUS, 'index.html'), urlRegexHTML)
replace(path.join(otherENUS, 'navTree.html'), urlRegexHTML)

let navbarJS = path.join(otherBase, 'include', 'Javascript', 'navigationBar.js')
replace(navbarJS, navBarRegex, '"http://localhost:3000/" + lang')

replace(getListOfFiles(path.join(otherBase, 'include', 'CSS')), urlRegexJSCSS)
replace(getListOfFiles(path.join(otherBase, 'include', 'Javascript')), urlRegexJSCSS)

function replace(file, regex, replaceWith) {
    replaceWith = replaceWith || ''
    try {
        const results = replaceInFile.sync({ files: file, from: regex, to: replaceWith })
        console.log('Replacement results:', results);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}

function getListOfFiles (dir) {
    return fs.readdirSync(dir).map((file) => {
        return path.join(dir, file)
    })    
}

function downloadMissingFiles(files, destRoot) {
    files.forEach((fileURL) => {
        const destDir = fileURL.match(/https:\/\/docs\.unrealengine\.com:443\/(.*\/)/)[1]
        const filename = path.basename(fileURL)
        const fullDestDir = path.join(destRoot, destDir)
        if (!fs.existsSync(fullDestDir)) { fs.mkdirSync(fullDestDir, { recursive: true }) }
        downloadFile(fileURL, path.join(fullDestDir, filename))
    })
}

function downloadFile(file, destination) {
    const filename = path.basename(file)
    return new Promise((resolve, reject) => {
        let download = wget.download(file, destination);
        download.on('error', (err) => {
            reject(`Error downloading ${filename}: ${err}`)
        });
        download.on('start', function(fileSize) {
            console.log(`Starting download of ${filename}`)
        });
        download.on('end', function(output) {
            console.log(`Finished download of ${filename}`)
            resolve()
        })
    })
}
