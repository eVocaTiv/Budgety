// budget controller
var budgetController = (function () {
    // some code.
})();

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector('.add__type').value, // will be either inc or exp
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value,
            }
        },

        getDOMStrings: () => {
            return DOMstrings;
        }
    }
})();


// global app controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = () => {
        var DOM = UICtrl.getDOMStrings();
        console.log(DOM);
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = () => {


        // 1.  get the field input data.
        var input = UICtrl.getInput();
        console.log(input);
        // 2.  add the item to budget controller
        // 3.  add the item to ui aswell.
        // 4.  calculate the budget
        // 5.  display the budget
    }

    return {
        init: () => {
            console.log('Application start up!...');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();


