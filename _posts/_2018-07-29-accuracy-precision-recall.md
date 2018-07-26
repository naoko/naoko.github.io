---
layout: post
title: Accuracy, Precision, Recall and F1 Score
description: Platform to manage the ML experiments and development
tags: [ml, machine learning, precision, recall, f1 score]
modified: 2018-07-22
---

### The problem

So now you built your first model and need to evaluate which model is better for
the business purpose you need to understand Precision, Recall, F-measure etc.
It is not intuitive to me and I frequently re-visit what it mean again.
So I decided to write them down for myself to re-visit again.

### Let's break down

So yes, Accuracy, Precision, Recall & F1 Score is 
Interpretation of Performance Measures.

Let's take a look at the Confusion Matrix below:

<table style="white-space:nowrap;">
  <tr>
    <th></th>
    <th></th>
    <th>Predicted</th>
    <th></th>
  </tr>
  <tr>
    <th></th>
    <td></td>
    <td>Positive</td>
    <td>Negative</td>
  </tr>
  <tr>
    <th>Actual</th>
    <td>Positive</td>
    <td>90 [True Positive]</td>
    <td>4 [False Negative]</td>
  </tr>
  <tr>
    <td></td>
    <td>Negative</td>
    <td>5 [False Positive]</td>
    <td>1 [True Negative]</td>
  </tr>
</table>



total data point: 100

what's the accuracy? 90%

Accuracy 	= 

precision 	= true positive / (true positive + false positive)
			= true positive / (total predicted positive)
			= how many of them are actual positive

recall 		= true positive / (true positive + false negative)
			= true positive / total actual positive
			= how many of the actual positive predicted as positive
			-> use this metric to select best model when there is a high cost associated with False Negative
			- e.g. Fraud detection, sick patient detection
			- predicting fraudulent transaction (actual positive) is predicted as non-fradulent (predicted negative) the consequence can be very bad for the bank.

f1 Score	= 2 * ((precision * recall) / precision + recall))
			= F1 Score is needed when you want to seek a balance between Precision and Recall.

