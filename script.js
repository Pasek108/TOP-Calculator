"use strict"

/* ----------------------- variables ----------------------- */
const previous_value = document.querySelector(".previous-value")
const current_value = document.querySelector(".current-value")
document.addEventListener("keydown", keyboardInput)

const backspace = document.querySelector(".backspace")
backspace.addEventListener("click", clearLast)

const clear = document.querySelector(".clear")
clear.addEventListener("click", clearInput)

const numbers = document.querySelectorAll(".number")
numbers.forEach((num) => num.addEventListener("click", inputNumber))

const dot = document.querySelector(".dot")
dot.addEventListener("click", inputDot)

const operations = document.querySelectorAll(".operation")
operations.forEach((op) => op.addEventListener("click", inputOperation))

const equals = document.querySelector(".equals")
equals.addEventListener("click", calcResult)

let operator = ""
let result = ""
let number = ""

/* ----------------------- functions ----------------------- */
function operate(op, a, b) {
  // prettier-ignore
  switch (op) {
        case "+": return roundNumber(+a + +b)
        case "-": return roundNumber(+a - +b)
        case "*": return roundNumber(+a * +b)
        case "/": return roundNumber(+a / +b)
    }
}

function clearInput(evt) {
  const target = evt.currentTarget
  flickKey(target)

  operator = ""
  result = ""
  number = ""

  current_value.textContent = ""
  previous_value.textContent = ""
}

function clearLast(evt) {
  const target = evt.currentTarget
  flickKey(target)

  number = number.slice(0, -1)

  current_value.textContent = number
}

function inputNumber(evt) {
  const target = evt.currentTarget
  flickKey(target)

  number += target.dataset.value
  current_value.textContent = number
}

function inputDot(evt) {
  const target = evt.currentTarget
  flickKey(target)

  if (number.length < 1 || number.includes(".")) return
  if (number.length == 1 && number[0] === "-") return

  number += "."
  current_value.textContent = number
}

function inputOperation(evt) {
  const target = evt.currentTarget
  flickKey(target)

  const operation = target.dataset.value

  if (number == "-") return

  if (number.length < 1) {
    if (operation != "-") return

    number += "-"
    current_value.textContent = number
    return
  }

  if (number.slice(-1) == ".") number = number.slice(0, -1)

  if (operator == "") {
    operator = operation
    result = number
    number = ""
    current_value.textContent = result
    previous_value.textContent = `${result}${operation}`
    return
  }

  result = `${operate(operator, result, number)}`
  operator = operation
  number = ""

  current_value.textContent = `${+result}`
  previous_value.textContent = `${+result}${operation}`
}

function calcResult(evt) {
  const target = evt.currentTarget
  flickKey(target)

  if (number == "-") number = "0"
  if (number.slice(-1) == ".") number = number.slice(0, -1)

  if (operator == "") previous_value.textContent = `${+number}=`
  else previous_value.textContent = `${+result}${operator}${+number}=`

  result = operator === "" ? number : `${operate(operator, result, number)}`

  if (Math.abs(result) === Infinity) {
    current_value.textContent = "Err. Division by 0"
    operator = ""
    result = ""
    number = ""
  } else {
    current_value.textContent = `${+result}`
    operator = ""
    number = result
  }
}

function keyboardInput(evt) {
  evt.preventDefault()

  // prettier-ignore
  switch (evt.key) {
        case "0": numbers[9].click(); break
        case "1": numbers[6].click(); break
        case "2": numbers[7].click(); break
        case "3": numbers[8].click(); break
        case "4": numbers[3].click(); break
        case "5": numbers[4].click(); break
        case "6": numbers[5].click(); break
        case "7": numbers[0].click(); break
        case "8": numbers[1].click(); break
        case "9": numbers[2].click(); break

        case "+": operations[3].click(); break
        case "-": operations[2].click(); break
        case "*": operations[1].click(); break
        case "/": operations[0].click(); break

        case "Enter":
        case "=": equals.click(); break
        case "c": clear.click(); break
        case ".": dot.click(); break
        case "Backspace": backspace.click(); break
    }
}

function flickKey(target) {
  target.style.backgroundColor = "#bcbcbc"
  setTimeout(() => (target.style.backgroundColor = null), 25)
}

function isOperator(char) {
  return "+-*/".includes(char)
}

function roundNumber(num) {
  return Math.round((num + Number.EPSILON) * 10 ** 12) / 10 ** 12
}
