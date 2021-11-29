import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as ora from 'ora';
import { URL } from 'url';
import { getRandomIP } from './utils';

// 异步API,压缩图片
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
interface ResFileProps {
  input: {
    size: number;
    type: string;
  };
  output: {
    size: number;
    type: string;
    width: string;
    height: number;
    ratio: number;
    url: string;
  };
}
// {"error":"Bad request","message":"Request is invalid"}
interface ResErrProps {
  error: string;
  message: string;
}

type ResProps = ResFileProps | ResErrProps;

const defaultOptions = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
  },
};

const getCompressedFile = (newImgPath: string, file: ResFileProps) => {
  const options = new URL(file.output.url);
  const spinner = ora('Downloading').start();
  const req = https.request(options, res => {
    let body = '';
    res.setEncoding('binary');
    res.on('data', data => {
      body += data;
    });

    res.on('end', () => {
      fs.writeFile(newImgPath, body, 'binary', err => {
        if (err) {
          spinner.fail(`Failed: ${err}`);
          return console.error(err);
        }
        spinner.succeed(
          `[${newImgPath}] \n 压缩成功，压缩大小: ${file.output.size}B，优化比例: ${
            file.output.ratio * 100
          }%`,
        );
      });
    });
  });
  req.on('error', e => {
    spinner.fail(`Failed: ${e}`);
  });
  req.end();
};

const isSuitableFile = (stats: fs.Stats, filePath: string) =>
  stats.isFile() && stats.size <= global.maxSize && global.ext.includes(path.extname(filePath));

const getSavePath = (imgPath: string) => {
  if (global.isOverwrite) {
    return imgPath;
  }
  const extname = path.extname(imgPath); // eg: '.jpg'
  const filename = path.basename(imgPath, extname);
  return imgPath.replace(filename, `${filename}-compressed`);
};

const fileUpdate = (imgPath: string, file: ResFileProps) => {
  const newImgPath = getSavePath(imgPath);
  getCompressedFile(newImgPath, file);
};

const uploadFile = (imgPath: string, options) => {
  const spinner = ora('Uploading').start();
  const req = https.request(options, res => {
    res.on('data', buf => {
      const obj: ResProps = JSON.parse(buf.toString());

      if ('error' in obj) {
        spinner.fail(`[${imgPath}]: 压缩失败！报错: ${obj.message}`);
      } else {
        spinner.succeed(`[${imgPath}] \n 上传成功，原始大小: ${obj.input.size}B`);
        fileUpdate(imgPath, obj);
      }
    });
  });

  req.write(fs.readFileSync(imgPath), 'binary');
  req.on('error', e => {
    spinner.fail(`Failed: ${e}`);
    console.error(e);
  });
  req.end();
};

const filterFile = (filePath: string) => {
  fs.stat(filePath, (err, stats) => {
    if (err) return console.error(err);
    if (isSuitableFile(stats, filePath)) {
      // 通过 X-Forwarded-For 头部伪造客户端IP
      const options = { ...defaultOptions };
      options.headers['X-Forwarded-For'] = getRandomIP();
      uploadFile(filePath, options);
    }
  });
};

export const startCompress = (folder: string) => {
  fs.readdir(folder, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      const pathName = path.join(folder, file);
      fs.stat(pathName, (_, stats) => {
        if (stats.isDirectory() && global.isRecursion) {
          startCompress(`pathName${'/'}`);
        } else {
          filterFile(pathName);
        }
      });
    });
  });
};
