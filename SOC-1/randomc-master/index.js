let randomNumber = Math.floor(Math.random() * 11);
console.log(randomNumber)
function check() {
    let input = document.getElementById('guessedNumber').value;
    let message = document.getElementById('message');
    if (input == randomNumber) {
        message.innerHTML = `<p style = 'color: green;'>Hey You Have Guessed It Right.</p>`;
        randomNumber = Math.floor(Math.random() * 11);
        console.log(randomNumber)
    } else if (input > randomNumber) {
        message.innerHTML = `<p style = 'color: red;'>Number is too high.</p>`;
    } else if (input < randomNumber) {
        message.innerHTML = `<p style = 'color: red;'>Number is too low.</p>`;
    } else {
        message.innerHTML = `<p style = 'color: red;'>Please add something</p>`;
    }
}