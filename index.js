#!/usr/bin/env node

import inquirer from 'inquirer';
import { startCompress } from './compress.js';
import { mb2b } from './utils.js';

// 获取命令执行路径
const cwd = process.cwd();

const DEFAULT_SIZE = 5;

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select image format",
      name: "ext",
      default: [".jpg", ".jpeg", ".png"],
      choices: [
        {
          name: ".jpg",
        },
        {
          name: ".jpeg",
        },
        {
          name: ".png",
        },
        {
          name: ".bmp",
        },
        {
          name: ".webp",
        },
      ],
      validate(answer) {
        if (answer.length < 1) {
          return "You must choose at least one image format.";
        }

        return true;
      },
    },
    {
      type: "input",
      name: "maxSize",
      message: "Input image max size (MB).",
      default() {
        return DEFAULT_SIZE;
      },
      validate(value = DEFAULT_SIZE) {
        const pass =
          value.toString().match(/^[1-9]{1,}\d*$/) && value <= DEFAULT_SIZE;
        if (pass) {
          return true;
        }

        return "Please enter a valid max size";
      },
    },

    {
      type: "confirm",
      name: "isOverwrite",
      message: "Whether to overwrite the source file?",
      default: false,
    },
    {
      type: "confirm",
      name: "isRecursion",
      message: "Whether recursion?",
      default: false,
    },
  ])
  .then((answers) => {
    const { ext, maxSize, isOverwrite, isRecursion } = answers;

    // TODO 不想使用透传，所以将参数设置为全局变量
    global.ext = ext;
    global.maxSize = mb2b(maxSize);
    global.isOverwrite = isOverwrite;
    global.isRecursion = isRecursion;

    startCompress(cwd);
  });
