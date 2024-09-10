const inquirer = require('inquirer');
const fs = require('fs');
const jest = require('jest');

// questions for the user to answer, populates within the terminal
const questions = [
    `What is the text you want to include in the SVG?`, //0
    `What shape do you want to include in the SVG?`, //1
    `What color do you want the SVG? to be?` //2
]
// uses fs to write the file to the logo.svg
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('SVG Created!');
        }
    });
}
// one input and two lists, the first list is for the shape, the second list is for the color 
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
    // if the user chooses named color, it will prompt them to enter a color, if the color is not valid, it will prompt them to enter a valid color
    // if the user chooses hex, it will prompt them to enter a hex value
    // based on the color  chosen by the user, it will create the svg with the color, text, and shape and write it to the file
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

//  had a switch statement here, but it was not working properly.  I replaced it with an if else statement
function svglogocreator(color, text, shape) {
    let svgShape;
    if (shape === 'square') {
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="50%" height="50%" fill="${color}" />
            <text x="25%" y="35%" font-size="25" dy="-.5em" fill="white" text-anchor="middle">${text}</text>
            </svg>
            `;
        } else if (shape === 'circle') {
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <circle cx="50%" cy="50%" r="40%" fill="${color}" />
            <text x="50%" y="60%" font-size="25" dy="-.5em" fill="white" text-anchor="middle">${text}</text>
            </svg>
            `;
        // triangle created a lot of issues, so I had to change the points to make it work, i could not get the percentages to work
        } else if (shape === 'triangle') {
            svgShape = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <polygon points="50,0 100,100 0,100" fill="aqua" />
            <text x="25%" y="50%" font-size="25" dy="-.9em" fill="white" text-anchor="middle">cool</text>
            </svg>   
            `;
        } else {
            console.log('Invalid shape');
            return;
    }
    return (svgShape);
}
    
init();