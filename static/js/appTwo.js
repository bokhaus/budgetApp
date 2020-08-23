//Module Pattern - Independent of each other - Separation of Concerns
//Create an anonymous function set to a variable
//IIFE function to protect data privacy
let budgetController = (function(){
    let x =23;

    //Private add function
    let add = function(a){
        return x + a;
    }
    return {
        //Public Method
        publicTest: function(b){
            return add(b);
        }
    }

})();

//UI Module
let UIController = (function(){

    //Write Code Later

})();


//This module connects the budgetController and the UI Module
let controller = (function(budgetCtrl, UICtrl){

    let z = budgetCtrl.publicTest(23);

    return{
        anotherPublic: function(){
            console.log(z);
        }
    }

})(budgetController, UIController);





