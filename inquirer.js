var inquirer = require('inquirer');

// TODO 格式 大小 是否遍历 是否覆盖

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Select image format',
      name: 'format',
      choices: [
        {
          name: 'jpg',
        },
        {
          name: 'png',
        },
      ],
      validate(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one image format.';
        }

        return true;
      },
    },
    {
      type: 'input',
      name: 'maxSize',
      message: "Input image max size.",
      default() {
        return 5200000;
      },
      validate(value) {
        const pass = value.match(
          /^\d{1,}$/
        );
        if (pass) {
          return true;
        }
  
        return 'Please enter a valid phone number';
      },
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
  });
