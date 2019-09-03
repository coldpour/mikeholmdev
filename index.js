const fs = require('fs')
const path = require('path')

const contents = require('./src/index.js')

const outputDir = path.resolve(__dirname, 'dist')
const outputFile = path.resolve(outputDir, 'index.html')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

fs.writeFileSync(
  outputFile,
  contents()
)
