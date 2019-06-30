// budget controller
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0,
        },

        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length === 0) {
                ID = 0;
            } else {
                // create new id 
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            // create new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push new item to data structure
            data.allItems[type].push(newItem);
            // return new item
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids = data.allItems[type].map((current) => {
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function (type) {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget = income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income spent.
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {
            data.allItems.exp.forEach((cur) => {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            console.log(allPerc);
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        }
    }
})();

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var formatNumber = function (num, type) {
        var numSplit, sign;
        /**
         + or - before number
         exactly 2 decimal points
         comma separating thousands
         2310.4567 -> + 2,310.46
         2000 -> + 2,000.00
         */

        num = Math.abs(num).toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }



    return {
        getInput: () => {
            return {
                type: document.querySelector('.add__type').value, // will be either inc or exp
                description: document.querySelector('.add__description').value,
                value: parseFloat(document.querySelector('.add__value').value),
            }
        },

        getDOMStrings: () => {
            return DOMstrings;
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create html string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div> '
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\</div></div></div>'

            }
            // replace the placceholder text with actual data received from object.
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));
            newHtml = newHtml.replace('%description%', obj.description);

            // insert the html into the dom.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelectorAll(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID)

            // can only remove child in JS! so go a level up to the parent and then remove child.
            element.parentNode.removeChild(element);
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = "---";
                }
            });
        },

        displayMonth: function () {
            var now, month, year;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];
            year = now.getFullYear();
            console.log(year)
            month = months[now.getMonth()];
            document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;

        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);

                nodeListForEach(fields, function(cur) {
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(DOMstrings.inputButton).classList.toggle('red');


        }

    }
})();

// global app controller
var controller = (function (budgetCtrl, UICtrl) {

    var updateBudget = () => {
        // 1.  calculate budget
        budgetCtrl.calculateBudget();

        // 2.  return budget
        var budget = budgetCtrl.getBudget();

        // 3.  display the budget
        UICtrl.displayBudget(budget);


    }

    var updatePercentages = function () {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. update ui with new percentages
        UICtrl.displayPercentages(percentages);
    }

    var setupEventListeners = () => {
        var DOM = UICtrl.getDOMStrings();
        console.log(DOM);
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    var ctrlAddItem = () => {


        var input, newItem;
        // 1.  get the field input data.
        input = UICtrl.getInput();

        if (input.description.trim(' ') !== "" && !isNaN(input.value) && input.value > 0) {

            // 2.  add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3.  add the item to ui aswell.
            UICtrl.addListItem(newItem, input.type);

            // 3b. Clear fields
            UICtrl.clearFields();

            // 4. Calculate and update budget
            updateBudget();
            updatePercentages();
        }

    }

    var ctrlDeleteItem = (event) => {
        var itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from UI
            UICtrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget();
            updatePercentages();
        }
    }

    return {
        init: () => {
            console.log('Application start up!...');
            updateBudget({
                budget: 0,
                totalIncome: 0,
                totalExp: 0,
                percentage: -1,
            })
            setupEventListeners();
            UICtrl.displayMonth();
        }

    }
})(budgetController, UIController);

controller.init();


