const inquirer = require('inquirer');
const fs = require('fs');
const jest = require('jest');

const questions = [
    `What is the text you want to include in the SVG?`, //0
    `What shape do you want to include in the SVG?`, //1
    `What color do you want the SVG? to be?` //2
]

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('SVG Created!');
        }
    });
}

function init() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: questions[0]
        },
        {
            type: 'list',
            name: 'shape',
            message: questions[1],
            choices: [`square`, `circle`, `triangle`]
        },
        {
            type: 'list',
            name: 'color',
            message: questions[2],
            choices: [`named color`, `hex`]
        }
    ])
    .then((response) => {
      if (response.color === `named color`) {
        inquirer.prompt([{
                type: 'input',
                name: 'color',
                message: `What keyword color do you want the SVG to be?`,
                validate: function(input) {
                    const validColors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
                    if (validColors.includes(input.toLowerCase())) {
                        return true;
                    } else {
                        return 'Please enter a valid color';
                    }
                }
            }])
            .then((colorResponse) => {
                const svg = svglogocreator(colorResponse.color, response.text, response.shape);
                writeToFile('logo.svg', svg);
            });
        } else {
            inquirer.prompt([{
                type: 'input',
                name: 'color',
                message: `What hex color do you want the SVG to be?`,
                validate: function(input) {
                    const hexColor = /^#([0-9A-F]{6}|[0-9A-F]{3})$/i;
                    if (hexColor.test(`#` + input)) {
                        return true;
                    } else {
                        return 'Please enter a valid hex color';
                    }
                }
            }])
            .then((colorResponse) => {
                const svg = svglogocreator(`#`+ colorResponse.color, response.text, response.shape);
                writeToFile('logo.svg', svg);
            });
        }
 
})}

function svglogocreator(color, text, shape) {
    let svgShape;
    switch (shape) {
        case 'square':
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="50%" height="50%" fill="${color}" />
            <text x="25%" y="35%" font-size="25" dy="-.5em" fill="white" text-anchor="middle">${text}</text>
            </svg>
            `;
            break;
            case 'circle':
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <circle cx="50%" cy="50%" r="40%" fill="${color}" />
            <text x="50%" y="60%" font-size="25" dy="-.5em" fill="white" text-anchor="middle">${text}</text>
            </svg>
            `;
            break;
            case 'triangle':
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <polygon points="100%,10% 190%,190% 10%,190%" fill="${color}" />
            <text x="50%" y="50%" font-size="25" dy="-.5em" fill="white" text-anchor="middle">${text}</text>
            </svg>  
            `;
        break;
            default:
                console.log('Invalid shape');
                return;
    }
    return (svgShape);
}
    
init();