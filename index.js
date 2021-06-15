#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

const cwd = process.cwd();
const params = process.argv.slice(2);

const isRecursion = params.includes("-r");
const isOverwrite = params.includes("-c");

const root = cwd;

const exts = [".jpg", ".png"];
const max = 5200000; // 5MB == 5242848.754299136

const defaultOptions = {
  method: "POST",
  hostname: "tinypng.com",
  path: "/web/shrink",
  headers: {
    rejectUnauthorized: false,
    "Postman-Token": Date.now(),
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
  },
};

// 生成随机IP， 赋值给 X-Forwarded-For
const getRandomIP = () => {
  return Array.from(Array(4))
    .map(() => parseInt(Math.random() * 255))
    .join(".");
};

const getFileList = (folder) => {
  fs.readdir(folder, (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      filterFile(path.join(folder, file));
    });
  });
};

const filterFile = (filePath) => {
  fs.stat(filePath, (err, stats) => {
    if (err) return console.error(err);
    if (
      stats.isFile() &&
      // 必须是文件，小于5MB，后缀 jpg||png
      stats.size <= max &&
      exts.includes(path.extname(filePath))
    ) {
      // 通过 X-Forwarded-For 头部伪造客户端IP
      const options = { ...defaultOptions };
      options.headers["X-Forwarded-For"] = getRandomIP();

      fileUpload(filePath, options); // console.log('可以压缩：' + filePath);
    }

    if (stats.isDirectory() && isRecursion) {
      getFileList(filePath + "/");
    }
  });
};

// 异步API,压缩图片
// {"error":"Bad request","message":"Request is invalid"}
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
const fileUpload = (imgPath, options) => {
  const req = https.request(options, function (res) {
    res.on("data", (buf) => {
      let obj = JSON.parse(buf.toString());
      if (obj.error) {
        console.log(`[${imgPath}]：压缩失败！报错：${obj.message}`);
      } else {
        fileUpdate(imgPath, obj);
      }
    });
  });

  req.write(fs.readFileSync(imgPath), "binary");
  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
};

// 该方法被循环调用,请求图片数据
const fileUpdate = (imgPath, obj) => {
  let newImgPath;
  if (isOverwrite) {
    newImgPath = imgPath;
  } else {
    const outputDir = path.join(cwd, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // TODO 当前 imgPath 存在时，如何处理
    newImgPath = path.join(cwd, "output", path.basename(imgPath));
  }

  let options = new URL(obj.output.url);

  const req = https.request(options, (res) => {
    let body = "";
    res.setEncoding("binary");
    res.on("data", function (data) {
      body += data;
    });

    res.on("end", function () {
      fs.writeFile(newImgPath, body, "binary", (err) => {
        if (err) return console.error(err);
        console.log(
          `[${newImgPath}] \n 压缩成功，原始大小-${obj.input.size}，压缩大小-${obj.output.size}，优化比例-${obj.output.ratio}`,
        );
      });
    });
  });
  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
};

getFileList(root);
