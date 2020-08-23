/*Module Pattern - Independent of each other - Separation of Concerns
* Create an anonymous functions 
* IIFE functions to protect data privacy
*/

//BUDGET CONTROLLER - Model
let budgetController = (function(){

    //Data Model for Income and Expenses
    //Function Constructors for Custome Data Types
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //not defined yet
    };

    //Uses expense prototype to calculate percentage of expense
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };
    
    //returns the percentage of the expense
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calcTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        
        });

        // Public Method
        // Stores the calculation in the object array totals
        data.totals[type] = sum;
    };

    // Data structure to recieve information from the user 
    let allExpenses = [];
    let allIncomes = [];
    let totalexpenses = 0;

    //Data object for all data
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1 // initialized to -1 to symbolize it doesn't exist
    };
    //Public function to return the info from the data structure
    return {
        addItem: function(type, desc, val) {

            let newItem, ID;

            //When the array is empty, it should = 0
            if(data.allItems[type].length > 0){

                /* Create New ID
                *  ID is equal to the (type - 'inc' or 'exp') pulled from the data object
                *  data.allItems[type]
                *  The last id in the array of the [type] is selected.
                *  [data.allItems[type].length-1].id
                *  The next id will be the last id plus 1.
                *  **EXAMPLE**
                *  [1 2 3 4 5], next ID = 6
                *  [1 2 4 6 8], next ID = 9
                *  ID = last ID + 1 
                *  since the array is zero index and
                *  there are 5 elements in the array
                *  we want the last element of the array.
                *  element would then be 5-1 which is index[4]
                *  OR, (5-1 = [4]) + 1 => NEW ID 
                */ 
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;

            }else {
                ID = 0;
            }

            //Create New Item based on 'inc' or 'exp' type
            if(type === 'exp') {
               newItem = new Expense(ID, desc, val);
            } else  if (type === 'inc'){
                newItem = new Income(ID, desc, val);
            }

            // Push the new Item into the data structure
            data.allItems[type].push(newItem);

            //Return the new item/element
            return newItem;
        },

        // This function creates an array of all current element ids and determines
        // the index of each element id.
        // data.allItems[type][id]; does not work because not all elements are
        // present Example: ids = [2, 4, 6, 8] - 3,5,7 are missing and will not correspond to 
        // index in a 1 to 1 fashion -> [0]!=0, [3]!=3, [5]!=5 and so on.
        // in this case when deleting [3]===8
        deleteItem: function(type, id) {
            let ids, index;
            
            //Creates an array of all ids
            ids = data.allItems[type].map(function(current){
                return current.id;

            });

            //determines index number of the id which is passed into the method
            index = ids.indexOf(id);

            //If the index exists remove the index
            if(index !== -1){
                //Use splice to remove elements of array
                //Arguments in splice method (where to start, how many to remove)
                //Removes the element at the index number and only remove one element
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            // 1, Calculate total Income and total expenses
            calcTotal('exp');
            calcTotal('inc');

            // 2. Calc the budget (income - expenses)
            //Use Global Data Structure
            data.budget = data.totals.inc - data.totals.exp;

            // 3. Clac percentage of income spent only if greater than zero
            // Rounds to closest integer
            // Verify Parens
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                // Expense = 100 and income 200, spent 50% of the income 100/200 = 0.5 * 100
                
                //Test percentage //REMOVE @ Deployment
                console.log(data.percentage);

            } else { //will not calculate percentage
                data.percentage = -1;
            }
        },

        //Calculate each percentage for expense array
        calculatePercentage: function() {
            /*
            Expenses
            a = 20
            b = 10
            c= 40
            income = 100
            aP = 20/100 -> 20%
            bP = 10/100 -> 10%
            cP = 40/100 -> 40%

            */
           //Loops over array and calculates the percentage uing calcPercentage()
           data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.totals.inc);
           });
        },

        // Creates and returns array of all percentages
        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage(); //returns percentages  
            });
            return allPerc; //returns the array of all percentages

        },

        getBudget: function() {
            return { // return object with four values
                budget: data.budget, //calculation is stored here
                totalInc: data.totals.inc, //total income
                totalExp: data.totals.exp,//total expenses
                percentage: data.percentage//percentage of the income(budget)
            };
        },

        testing: function(){ //Method for testing data structure
            console.log(data);
        }
    };

})();



//UI CONTROLLER - View
let UIController = (function(){

    //Object for DOM values // Centralized
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        
    }

    
    let formatNumber = function(num, type) {
        /*
        + or - before number based on exp or inc
        exactly two decimal places
        comma separator thousands
        2310.4567 -> +2310.47
        1234.76 -> -1234.76
        2000 -> +2000.00 
         */

        let numSplit, int, dec;
        //calculate the absolute 
        num = Math.abs(num); //overrides num arguement

        //converts the primitive number to an object and makes num fixed with two decimals
        // and rounds the number. Returns a string.
        num = num.toFixed(2); 
                     
        numSplit = num.split('.'); //divides the string at the decimal point

        int = numSplit[0]; //Array stores integer portion of the number

        if(int.length > 3){
            //substr first param is where to start second param is how many to read
            int = int.substr(0, int.length - 3) + ','+ int.substr(int.length - 3, 3); //input 2310, output 2,310
        }


        dec = numSplit[1]; //Array stores the decimal portion of the number
         
        //Add sign and decimal to the number (num)
        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
    };

    let nodeListForEach = function(list, callback) {
        for(let i =0; i < list.length; i++){
            //calls the nodeList and its index to be used in the method call below.
            callback(list[i], i); 

        }
    };

    //Create an object with three properties
    //Private Function
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value, //User input description
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) // Value for item converting a string to a number using parseFloat
            };
        },

        addListItem: function(obj, type){
            //1. Create HTML string with placeholder text
            let html, newHtml, element;

            //Use placeholders to represent variable to insert (%id%, %description%, %value%)
            if(type === 'inc'){

                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%">' + 
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix"><div class="item__value">%value%</div>' +
                '<div class="item__delete"><button class="item__delete--btn">' + 
                '<i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp'){

                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%">' + 
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix"><div class="item__value">%value%</div>' + 
                '<div class="item__percentage">21%</div><div class="item__delete">' +
                '<button class="item__delete--btn"><i class="ion-ios-close-outline">' +
                '</i></button></div></div></div>';

            }

            //2. Replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)); //calls formatNumberfunction

            //3. Insert the HTML into the DOM
            //Inserted as a child in the specified container as the last item in the list.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        //Removes child element
        deleteListItem: function(selectorID){
            //Save id to a variable
            let el = document.getElementById(selectorID);
            //Remove the child of the element
            el.parentNode.removeChild(el);

        },

        //Clear fields after enter of input
        clearFields: function(){
            let fields, fieldsArr;
            
            //clears user input data to allow for another value to be created.
            //querySelectorAll returns a list and not an array. Must convert list to an array
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            //Use Array prototype to call slice method. This trick then returns a copy of the list as an array
            //Pass list into the array 
            //Functtion constructor for ALL Arrays
            fieldsArr = Array.prototype.slice.call(fields);

            //Callback function can access up to 3 items
            //the foreach loop moves over all elements and sets the value to empty set.
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";                 
            });

            //set focus back on the description by using the array created from the list
            fieldsArr[0].focus();
        },  

        // Displays budget data to UI through DOM manipulation
        displayBudget: function(obj){ //contains the data which needs displayed in the UI
            
            let type;

            //ternary statement instead of if-else to determine if number is income or expense
            obj.budget > 0 ? type = 'inc' : type = 'exp';


            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {//show percentage sign when expenses percentage is greater than zero
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';      
            }else{ //show dashes if >= 0
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage =  '---';
            }
        },

        displayPercentages: function(percentages){
            //Returns a nodeList
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel); 

            // Loop over nodes and display percentages
            nodeListForEach(fields, function(current, index){ //node and callback function as params
                
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'; // adds percentage 
                }else{
                    current.textContent = '---';
                }
            });
        },

        //save current date into a new variable
        displayMonth: function() {

            let dateNow, month, monthName, year;

            dateNow = new Date(); //returns todays date

            //Create an array with month names
            monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                        'August', 'September', 'October', 'November', 'December'];
            month = dateNow.getMonth(); //returns current month

            //inherits date methods from date prototype
            year = dateNow.getFullYear(); //returns year

            //Since the array is zero based, the index corresponds to the month
            document.querySelector(DOMStrings.dateLabel).textContent = monthName[month] + ' ' + year;

        },
        changedType: function(){

            //Change style  - manipulate CSS class
            //Creates a nodeList
            let fields = document.querySelectorAll(
                DOMStrings.inputType  + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');//Toggles the color when a type change is made

            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        //Make DOMStrings Public
        getDomStrings: function(){
            return DOMStrings;
        }
    };

})();



//This module connects the budgetController and the UI Module
//Control Center of the Application.
//APP CONTROLLER - Controller
let controller = (function(budgetCtrl, UICtrl){

    //Private Function
    let setupEventListeners = function(){ //calls all event listeners in one centralized place.

        let DOM = UICtrl.getDomStrings(); //Call DOMStrings 

        //Calls DOM variable with the class for the event listener
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); //Uses ctrlAddItem function as a callback

        //Add key press 'ENTER' at the global level so it may be used for all buttons
        document.addEventListener('keypress', function(event){ //pass parameter to function
            
            //'Enter' Event listener  
            if(event.keyCode === 13){
                
                ctrlAddItem(); //locks in data to be selected//see function above
            }
        });
        
        // Creates an eventListener on the container using event delegation
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    let updatePercentages = function(){

        // 1. Calc percentages
        budgetCtrl.calculatePercentage();
        
        // 2. Read percentages from budget Controller
        let percentages = budgetController.getPercentages();

        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);

    };

    //Private Function
    let updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();
        console.log(budget); //***REMOVE @ deployment***

        // 3. Display the budget in the UI 
        UICtrl.displayBudget(budget);
    };

    //Private Function
    let ctrlAddItem = function() {

        //Declare the variables
        let  input, newItem;

        //Custom functions to complete tasks

        // 1. Get field input data
        // This is created by returning the getInput method in the UI controller
        input = UICtrl.getInput();
        console.log(input); //**Remove at deployment**

        //Verify that description is not empty and value is not NAN and value > 0
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add item to the budget controller
            // These items are gotten from the UIController getInput()
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add new item to the user UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear Fields
            UICtrl.clearFields();

            // 5. Calculate and update budget method call
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    // Accesses event param to traverse the dom
    let ctrlDeleteItem = function(event){
        
        //Declare variable for the delete function
        let itemID, splitID, type, ID;

        //Returns HTML node in the dom 
        // To move up from this node all that needs called is (.parentNode)
        //Using parentNode four times moves the node all the way to 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //
        if(itemID) {

            //Use split method to break the item away from its id
            //Split the item ID on the dash See HTML ids
            //When using a method on a primitive, JS converts the primitive to an object
            splitID = itemID.split('-');
            type = splitID[0]; //stores the first part of the split id (exp/inc)
            ID = parseInt(splitID[1]); //holds the second part of the split id (id number as a string) and the converst string to a number

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget totals
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();

        }

        //Log for testing
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
    };

    return{
        init: function(){ //Public initialization function to start the program.
            console.log('Application has started');

            //Display Month
            UICtrl.displayMonth();

            //Clear the staic values in budget
            UICtrl.displayBudget({ // return object with three values set to zero
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1, //set to -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);


//Public Initialization function call
controller.init();

