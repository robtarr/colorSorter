import ColorPicker from 'simple-color-picker';
import synaptic from 'synaptic';
import trainingSet from './trainingset';

const input = document.querySelector('#hexColor');
const sortButton = document.querySelector('#sort');
const output = document.querySelector('#output');

const Network = synaptic.Network;
const Architect = synaptic.Architect;
const Trainer = synaptic.Trainer;

const network = new Architect.Perceptron(6, 3, 1);
const trainer = new Trainer(network);

trainer.train(trainingSet, {
  rate: 0.2,
  iterations: 80,
  error: 0.005,
  shuffle: true,
  log: 1,
  cost: Trainer.cost.CROSS_ENTROPY
});


function transformColor(hexColor) {
  let digits = hexColor.replace('#','').toString().split('');

  return digits.map(digit => {
    return parseInt(digit, 16) / 16;
  });
}

sortButton.addEventListener('click', () => {
  const hexColor = input.value;

  const data = transformColor(hexColor);
  const sorted = network.activate(data);

  if (sorted > .5) {
    output.innerText = 'RED!';
  } else {
    output.innerText = 'BLUE!';
  }
});



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
