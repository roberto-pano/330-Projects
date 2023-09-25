<!DOCTYPE html>
<head><title>Calculator</title></head>
<?php
$first =  $_GET['firstnumber'];
$second = $_GET['secondnumber'];

$operation = $_GET['operation'];
    switch ($operation){
        case "+":
            $sum = $first + $second;
            printf("%.2f\n",$sum);
            break;
        case "-":
            $difference = $first - $second;
            printf("%.2f\n", $difference);
            break;
        case "*":
            $product = $first * $second;
            printf("%.2f\n",$product);
            break;
        case "/":
            if($second == 0){
                echo "Divide by 0 error!";
            }
           else{
            $quotient = $first / $second;
            printf("%.2f\n",$quotient);
           } 
            break;
        default:
            break;
    }
?>    