import ColorPicker from 'simple-color-picker';
import synaptic from 'synaptic';
import trainingSet from './trainingset';

// Setup needed DOM elements
const inputField = document.querySelector('#hexColor');
const identifyButton = document.querySelector('#identify');
const trainWithDataButton = document.querySelector('#trainWithData');
const trainingAnswer = document.querySelector('#trainingAnswer');
const output = document.querySelector('#output');
const networkOutput = document.querySelector('#networkOutput');
const identifiedOutput = document.querySelector('#identifiedOutput');

// Setup Synaptic Classes
const Architect = synaptic.Architect;
const Trainer = synaptic.Trainer;

const network = new Architect.Perceptron(6, 3, 1);

// Convert hex color to array
// 'ffffff' -> [0.9375, 0.9375,0.9375, 0.9375, 0.9375, 0.9375]
function transformColor(hexColor) {
  let digits = hexColor.replace('#','').toString().split('');

  return digits.map(digit => {
    return parseInt(digit, 16) / 16;
  });
}

// train netowrk with trainingSet data
function trainFromData(data) {
  const trainer = new Trainer(network);

  trainer.train(data, {
    rate: 0.2,
    iterations: 1000,
    error: 0.005,
    shuffle: true,
    log: 10,
    cost: Trainer.cost.CROSS_ENTROPY
  });
}

// Identify the selected color
function identify() {
  const hexColor = inputField.value;

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


// identify Button Handler
identifyButton.addEventListener('click', identify);


// TrainWithData Button Handler
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
  inputField.value = color;
});
