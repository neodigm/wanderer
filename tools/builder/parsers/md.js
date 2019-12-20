const fs = require('fs')
const path = require('path')
const harpe = require('../../harpe/harpe')
const template = require('../../template/index')

const parseFrontmatter = require('../utils/parse-frontmatter')
const findStatics = require('../utils/find-statics')
const createPrettyUrlPage = require('../utils/create-pretty-url-page')

const buildMarkdownFile = (sourceFilePath, targetDirPath, processedFilename, baseFrameDir, config) => {
    const sourceText = fs.readFileSync(sourceFilePath, 'utf-8');

    // check for frontmatter
    const parsedText = parseFrontmatter(sourceText);

    const parsedConfig = {...config, ...parsedText.config};

    // find the layout
    const layout = parsedConfig.layout || 'default';

    const layoutPath = path.resolve(baseFrameDir, 'layouts', layout + '.html');
    let layoutText = '${o.content}'
    if (fs.existsSync(layoutPath)) {
        layoutText = fs.readFileSync(path.resolve(baseFrameDir, 'layouts', layout + '.html')).toString();
    }

    // figure out if we should add css / js files
    const pageStatics = findStatics(sourceFilePath)

    // parse and generate the template
    const parser = harpe();
    const html = parser.parse(parsedText.text);
    const templatedHTML = template(layoutText,
    {
        // adds page-specific css and js
        ...pageStatics,

        // adds anything from the frontmatter + folder config
        ...parsedConfig,

        content: html,
        _baseDir: baseFrameDir
    })

    const targetPath = path.resolve(targetDirPath, processedFilename.name + '.html')

    createPrettyUrlPage(targetPath, templatedHTML);

    // write the file
    fs.writeFileSync(targetPath, templatedHTML);
}

module.exports = buildMarkdownFile;