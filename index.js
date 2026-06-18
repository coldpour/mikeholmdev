const fs = require('fs')
const path = require('path')

const contents = require('./src/index.js')

const outputDir = path.resolve(__dirname, 'dist')
const outputFile = path.resolve(outputDir, 'index.html')
const imagesDir = path.resolve(__dirname, 'src/images')
const outputImagesDir = path.resolve(outputDir, 'images')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

if (fs.existsSync(imagesDir)) {
  fs.cpSync(imagesDir, outputImagesDir, { recursive: true })
}

fs.writeFileSync(outputFile, contents())
