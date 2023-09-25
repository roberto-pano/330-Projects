var calculation = function(){
    var output_num = document.getElementById("output");
    var calc_check = "+";
    var calc = 0;
    var num1 = document.getElementById("num1").value;
    var num2 = document.getElementById("num2").value;
    var operations = document.getElementsByClassName('operation');
    if(num1 != null && num2 != null){
        for (var j = 0; j < operations.length; j++) {
            if(operations[j].checked){calc_check = operations[j].value;}
        }
        
        switch(calc_check){
        case "+":
            calc = (parseFloat(num1) + parseFloat(num2)) || "";
            break;
        case "minus":
            calc = num1 - num2;
            break;
        case "*":
            calc = (num1 * num2) || "";
            break;
        case "/":
            if(num2!=="0"){
                calc = (num1 / num2) || "";
                break;
            } else {
                calc = "calculation failure";
                break;
            }
        }
        output_num.innerHTML = calc;
    }
};

document.getElementById("num1").addEventListener("input", calculation, false);
document.getElementById("num2").addEventListener("input", calculation, false);
var operations = document.getElementsByClassName('operation');
for (var j = 0; j < operations.length; j++) {
    operations[j].addEventListener('input', calculation, false);
}