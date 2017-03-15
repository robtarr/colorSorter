import ColorPicker from 'simple-color-picker';
import synaptic from 'synaptic';
import trainingSet from './trainingset';

// Setup needed DOM elements
const input = document.querySelector('#hexColor');
const identifyButton = document.querySelector('#identify');
const trainButton = document.querySelector('#train');
const trainWithDataButton = document.querySelector('#trainWithData');
const trainingAnswer = document.querySelector('#trainingAnswer');
const output = document.querySelector('#output');
const networkOutput = document.querySelector('#networkOutput');
const identifiedOutput = document.querySelector('#identifiedOutput');
const counterSpan = document.querySelector('#counter');

// training counter
let counter = 0;
let training = false;
let currentTrainingColor = 0;

// Setup Synaptic Classes
const Network = synaptic.Network;
const Architect = synaptic.Architect;
const Trainer = synaptic.Trainer;

const network = new Architect.Perceptron(6, 12, 1);

// Convert hex color to array
// 'ffffff' -> [0.9375, 0.9375,0.9375, 0.9375, 0.9375, 0.9375]
function transformColor(hexColor) {
  let digits = hexColor.replace('#','').toString().split('');

  return digits.map(digit => {
    return parseInt(digit, 16) / 16;
  });
}


// identify Button Handler
identifyButton.addEventListener('click', identify);


function identify() {
  const hexColor = input.value;

  const data = transformColor(hexColor);
  const result = network.activate(data);
  identifiedOutput.innerText = result;
  if (result > 0.66) {
    output.innerText = 'RED!';
  } else if (result > 0.33) {
    output.innerText = 'GREEN!';
  } else {
    output.innerText = 'BLUE!';
  }
}


// Train Button Handler
trainButton.addEventListener('click', () => {
  const trainingData = [];
  const colors = [
    {
      name: 'red',
      value: 1
    },
    {
      name: 'green',
      value: 0.5
    },
    {
      name: 'blue',
      value: 0
    }
  ];

  if (!training) {
    trainingAnswer.value = colors[currentTrainingColor].name;
    training = true;
  } else {
    debugger;
    const hexColor = input.value;

    const input = transformColor(hexColor);

    trainingData.push({
      input,
      output: colors[currentTrainingColor].value
    });

    counterSpan.innerText = ++counter;
    if (counter % 5 === 0) {
      currentTrainingColor++;
      trainingAnswer.value = colors[currentTrainingColor].name;
    }

    if (currentTrainingColor >= 5 * colors.length) {
      trainFromData(data);
      trainingAnswer.value = 'Trained!';
    }
  }
});


function trainFromData(data) {
  const trainer = new Trainer(network);

  trainer.train(data, {
    rate: 0.2,
    iterations: 80,
    error: 0.005,
    shuffle: true,
    log: 10,
    cost: Trainer.cost.CROSS_ENTROPY
  });
}

// Train with Data Handler
trainWithDataButton.addEventListener('click', () => {
  trainFromData(trainingSet);
});


// Color Picker
const colorPicker = new ColorPicker({
  color: '#FF0000',
  background: '#454545',
  el: document.querySelector('#colorPicker'),
  width: 200,
  height: 200,
});

colorPicker.onChange((color) => {
  input.value = color;
});
