var expression = "";

const OPERATION_TEXT = document.getElementById("operation-text");
const RESULT_TEXT = document.getElementById("result-text");

const OPERATORS = ["+", "-", "x", "/"];

function thereIsOperator() {
    for (let char of expression) {
        if (OPERATORS.includes(char)) {
            return true;
        }
    }
    return false;
}

function digitClick(event) {
    const digit = event.target.textContent;

    if (digit === ".") {
        // doesn't let the user clicks multiple decimal points beside each other
        if (expression[expression.length - 1] === ".") return;

        expression += ".";
        updateExpression();
        return;
    }

    // to avoid error in formatting
    expression = expression.replaceAll(",", "");

    expression += digit;
    expression = format(expression);
    updateExpression();

    if (thereIsOperator()) {
        evaluate();
    }
}

function format(numToFormat) {
    // holds the complete, formatted number
    let formattedNum = "";

    // holds the current number (numbers are separated by operators)
    let currentNum = "";

    let i = 0;
    while (i < numToFormat.length) {
        if (isOperator(numToFormat[i])) {
            // if the current character being traversed is an operator,
            // do nothing and just add it to the formatted number
            formattedNum += numToFormat[i];
            i++;
        } else {
            // this while loop collects all of the digits of a number
            // until the last character or an operator has been met
            while (i < numToFormat.length && !isOperator(numToFormat[i])) {
                currentNum += numToFormat[i];
                i++;
            }

            if (currentNum.includes(".")) {
                // this works by separating the whole number with the decimal digits
                // e.g: 1234.141312 is separated into (1234) and (141312)
                // then only the whole number (1234) is formatted into (1,234),
                // and the decimal digits are simply appended to the formatted whole number

                let dotIndex = currentNum.indexOf(".");
                let wholeNum = currentNum.slice(0, dotIndex);

                wholeNum = new Intl.NumberFormat("en-US").format(wholeNum);
                currentNum = wholeNum + currentNum.slice(dotIndex);
            } else {
                currentNum = new Intl.NumberFormat("en-US").format(currentNum);
            }

            formattedNum += currentNum;
            currentNum = "";
        }
    }

    return formattedNum;
}

function isOperator(char) {
    for (let operator of OPERATORS) {
        if (operator === char) {
            return true;
        }
    }
    return false;
}

function operatorClick(event) {
    // if the last character is an operator
    if (OPERATORS.includes(expression[expression.length - 1])) {
        expression = expression.slice(0, expression.length - 1);
    }

    const operator = event.target.textContent;
    expression += operator;
    updateExpression();
}

function updateExpression() {
    OPERATION_TEXT.value = expression;
}

const EQUAL_BUTTON = document.getElementById("equalBtn");

EQUAL_BUTTON.onclick = () => {
    if (
        !thereIsOperator() ||
        OPERATORS.includes(expression[expression.length - 1])
    ) {
        return;
    }

    // can only evaluate if there is an operator
    // and any operator isn't at the end of the expression
    evaluate();

    // removing the current classes that are obtained from
    // clearEntryBtn to avoid class conflicts
    RESULT_TEXT.classList.remove("shrink");
    OPERATION_TEXT.classList.remove("grow");

    RESULT_TEXT.classList.add("grow");
    OPERATION_TEXT.classList.add("shrink");    
};

document.getElementById("clearAllBtn").onclick = () => {
    expression = "";
    OPERATION_TEXT.value = "";
    RESULT_TEXT.value = "";

    manageAnimations();
};

function manageAnimations() {
    OPERATION_TEXT.classList.remove("shrink");
    RESULT_TEXT.classList.remove("grow");
}

document.getElementById("clearEntryBtn").onclick = () => {

    // will not clear any entry if the current expression 
    // is equaled (result is shown), instead it 
    // will only restore the previous properties
    if(OPERATION_TEXT.classList.contains("shrink")){
        OPERATION_TEXT.classList.replace("shrink", "grow");
        RESULT_TEXT.classList.replace("grow", "shrink");
        return;
    }

    if (RESULT_TEXT.value === "Syntax Error") RESULT_TEXT.value = "";

    expression = expression.slice(0, expression.length - 1);
    expression = expression.replaceAll(",", "");
    expression = format(expression);
    updateExpression();

    // flag to check if there is an operator NOT
    // at the end of the current expression
    let canEval = true;
    OPERATORS.forEach((o) => {
        if (expression[expression.length - 1] === o) {
            canEval = false;
            RESULT_TEXT.value = "";
        }
    });

    //as long as there is an operator not at the end of the expression,
    // evaluate expression
    if (canEval && thereIsOperator()) {
        evaluate();
    }

    if (!thereIsOperator()) {
        RESULT_TEXT.value = "";
    }
};

function evaluate() {
    let ans;
    try {
        ans = String(eval(expression.replaceAll("x", "*").replaceAll(",", "")));

        if (!ans.includes("e")) {
            // format answer before outputting if it's not a scientific notation
            ans = new Intl.NumberFormat("en-US").format(ans);
        }
        RESULT_TEXT.value = ans;
    } catch (exception) {
        RESULT_TEXT.value = "Syntax Error";
    }
}
