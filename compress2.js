// const fs = require("fs");
// const path = require("path");
// const https = require("https");
// const { URL } = require("url");

import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

import { getRandomIP } from './utils2';

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

export const startCompress = (folder) => {
  fs.readdir(folder, (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      const pathName = path.join(folder, file);
      fs.stat(pathName, (err, stats) => {
        if (stats.isDirectory() && global.isRecursion) {
          startCompress(pathName + "/");
        } else {
          filterFile(pathName);
        }
      });
    });
  });
};

const isSuitableFile = (stats, filePath) => {
  return (
    stats.isFile() &&
    stats.size <= global.maxSize &&
    global.ext.includes(path.extname(filePath))
  );
};

const filterFile = (filePath) => {
  fs.stat(filePath, (err, stats) => {
    if (err) return console.error(err);
    if (isSuitableFile(stats, filePath)) {
      // 通过 X-Forwarded-For 头部伪造客户端IP
      const options = { ...defaultOptions };
      options.headers["X-Forwarded-For"] = getRandomIP();
      uploadFile(filePath, options);
    }
  });
};

// 异步API,压缩图片
// {"error":"Bad request","message":"Request is invalid"}
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
const uploadFile = (imgPath, options) => {
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

const getCompressedFile = (newImgPath, obj) => {
  const options = new URL(obj.output.url);
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

const getSavePath = (imgPath) => {
  if (global.isOverwrite) {
    return imgPath;
  }
  const extname = path.extname(imgPath); // eg: '.jpg'
  const filename = path.basename(imgPath, extname);
  return imgPath.replace(filename, `${filename}-compressed`);
};

const fileUpdate = (imgPath, obj) => {
  const newImgPath = getSavePath(imgPath, global.isOverwrite);
  getCompressedFile(newImgPath, obj);
};

// module.exports = {
//   startCompress,
// };
