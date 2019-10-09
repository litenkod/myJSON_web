
'use strict';

let inputData;
const body = document.body;
const filenameInput = document.querySelector('#filenameInput');
const objectKeyInput = document.querySelector('#objectKey');
const objectValueInput = document.querySelector('#objectValue');
const nextNodeBtn = document.querySelector('#nextNodeBtn');
const nextAnswerBtn = document.querySelector('#nextAnswerBtn');
const createItemBtn = document.querySelector('#createItemBtn');
const saveFileBtn = document.querySelector('#saveFileBtn');
const copyJsonBtn = document.querySelector('#copyJsonBtn');


nextNodeBtn.addEventListener('click', ()=> {
	addNode();
});

createItemBtn.addEventListener('click', (event)=> {
	body.classList.remove('createView');
	body.classList.add('answerView');

	nextQuestion();
})

objectKeyInput.addEventListener("keyup", function(event) {
	if (event.code === 'Enter' && body.classList.contains('createView')) {
		event.preventDefault();
		addNode();
	}
});

objectValueInput.addEventListener("keyup", function(event) {
	if (event.code === 'Enter' && body.classList.contains('createView')) {
		event.preventDefault();
		addNode();
	}
	if (event.code === 'Enter' && body.classList.contains('answerView')){
		event.preventDefault();
		addItems();
	}
});

nextAnswerBtn.addEventListener('click', ()=> {
	addItems();
})

saveFileBtn.addEventListener('click', ()=> {
	downloadFile();
})

const addNode = () => {
	if(objectKeyInput.value !== undefined && objectKeyInput.value.length > 0) {
		saveNode(objectKeyInput.value, objectValueInput.value);
		objectKeyInput.value = '';
		objectValueInput.value = '';
		objectKeyInput.focus();
	}
}

let countItem = 0;
let itemsArray = [];
let allItemsArray = [];
const nextQuestion = () => {
	
	if(countItem < nodeArray.length){

		objectKeyInput.disabled = true;
		objectKeyInput.value = nodeArray[countItem][0];
		objectValueInput.value = nodeArray[countItem][1];
		setTimeout(() => {
			objectValueInput.focus();
		}, 100);

	} else {

		const dataToSave = itemsArray.reduce(function(p, c) {
			p[c[0]] = c[1];
			return p;
		  }, {})

		allItemsArray.push(dataToSave);
		countItem = 0;
		itemsArray = [];

		displayNodeData();

		copyJsonBtn.classList.remove('-hide');
		document.querySelector('.item-count').classList.remove('-hide');
		document.querySelector('.item-count .number').innerHTML = allItemsArray.length;

		nextQuestion();

	}
}

const addItems = () => {
	const answerValue = objectValueInput.value === '' ? nodeArray[countItem][1] : objectValueInput.value;
	itemsArray.push([nodeArray[countItem][0], answerValue]);
	countItem++;
	
	nextQuestion();
	
};

const nodeArray = [];
const saveNode = (key, value) => {
	nodeArray.push([key, value]);
	displayTemplateData();
}

const displayTemplateData = () => {
	const templateOutput = document.querySelector('#template');
	let templateHtml = '';
	nodeArray.map((item)=> {
		templateHtml += `${item[0]} : ${item[1]}<br>`;
	});
	templateOutput.innerHTML = templateHtml;
}

const displayNodeData = () => {
	const templateOutput = document.querySelector('#output');
	const addRow = JSON.stringify(allItemsArray).replace(/},/g, "},<br>");
	templateOutput.innerHTML = addRow;
}

const newDate = new Date(),
	d = newDate.toISOString().split('.')[0].replace('T','_'),
	defaultFilename = `MyJSON_${d}.json`

document.querySelector('#filenameLabel').setAttribute('title', `default filename: ${defaultFilename}`);

const downloadFile= () => {
	const filename = filenameInput.value !== '' ? `${filenameInput.value}.json` : `MyJSON_${d}.json`;
	const data = JSON.stringify(allItemsArray);
	const element = document.createElement('a');
	element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	body.appendChild(element);
	element.click();
	body.removeChild(element);
}
