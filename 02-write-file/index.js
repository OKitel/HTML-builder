const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filename = 'text.txt';
const filePath = path.join(__dirname, filename);

const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askForInput = () => {
  rl.question('Enter some text here...\n', (input) => {
    if (input === 'exit') {
      process.stdout.write('Goodbye!');
      rl.close();
      return;
    }

    writeStream.write(input + '\n', (error) => {
      if (error) throw error;
      askForInput();
    });
  });
};

rl.on('SIGINT', () => {
  process.stdout.write('Goodbye!');
  rl.close();
});

askForInput();
