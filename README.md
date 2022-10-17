# Tingpny-command-tool

通过 tingpng 压缩图片的命令行工具

![npm](https://img.shields.io/npm/v/tinypng-command-tool?style=flat-square)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/nmsn/tinypng-command-tool?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/nmsn/tinypng-command-tool?style=flat-square) ![npm](https://img.shields.io/npm/dw/tinypng-command-tool?style=flat-square)
![NPM](https://img.shields.io/npm/l/tinypng-command-tool?style=flat-square)

## 初衷

使用命令行调用网页版 [tinypng](https://tinypng.com/) 的接口，对本地图片文件进行压缩，避免频繁的浏览器端操作，提高效率


## 使用方法
安装：
```bash
npm i tinypng-command-tool -g
```

然后，在命令行进入到你想要压缩图片的目录，执行：
```bash
tpc
```

## 项目背景

Tinypng 网页版的不方便之处

1. 批量上传有文件数量限制
2. 批量下载后还需手动解压缩
3. 需要手动替换新老图片

## 目标

1. 一键压缩本地图片文件
2. 可以递归处理
3. 直接替换原始文件，减少手动操作

## 安装

```bash
npm i tinypng-command-tool -g
```

## 使用

```bash
tpc
```

## 项目负责人

nmsn

## 开源协议

MIT
