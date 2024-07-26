const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const srcDir = "src";
const distDir = "dist";

const processHtmlCssContent = (content) => {
  return content.replace(/\{\{([^\}]+)\}\}/g, (match, variable) => {
    variable = variable.trim();
    return process.env[variable] || match;
  });
};

const processJavascriptCode = (code) => {
  return code.replace(/process\.env\.(\w+)/g, (match, variable) => {
    variable = variable.trim();
    process.env[variable] ? `"${process.env[variable]}"` : "undefined";
  });
};

const processFile = (srcFile, destFile) => {
  const ext = path.extname(srcFile);
  const content = fs.readFileSync(srcFile, "utf8");
  let processedContent = content;

  if (ext === ".html" || ext === ".css") {
    processedContent = processHtmlCssContent(content);
  } else if (ext === ".js") {
    processedContent = processJavascriptCode(content);
  }

  // process codes in <script> tag
  if (ext === ".html") {
    const $ = cheerio.load(processedContent);
    const scripts = $("script");
    for (let i = 0; i < scripts.length; i++) {
      for (let j = 0; j < scripts.children.length; j++) {
        const jsCode = scripts[i].children[j].data;
        scripts[i].children[j].data = processJavascriptCode(jsCode);
      }
    }
    processedContent = $.html();
  }

  fs.writeFileSync(destFile, processedContent);
};

const processDirectory = (srcPath, destPath) => {
  const files = fs.readdirSync(srcPath);

  files.forEach((file) => {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);

    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile);
      }
      processDirectory(srcFile, destFile);
    } else {
      processFile(srcFile, destFile);
    }
  });
};

const build = () => {
  require("dotenv").config({ override: true });
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  processDirectory(srcDir, distDir);
};

build();

module.exports = { build };
