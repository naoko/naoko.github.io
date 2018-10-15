---
layout: post
title: Performance Metrics of Classification: Accuracy, Precision, Recall and F-Score
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

Let's say I built a model and input is image.
It classifies whether the image is cucumber or not.

Say, you build a classifier that always return `False`.
Total number of sample is 100 and 90 of them are NOT cucumber picture.

```python
def is_cucumber(image):
    return False
```

# TODO: https://www.youtube.com/watch?v=j-EB6RqqjGI

The Confusion Matrix would look like this:

<table style="border:1px solid grey">
  <tr>
    <th></th>
    <th></th>
    <td><b>Predicted</b><br>
    the classifier always predict False thus never predict as cucumber
    </td>
    <th></th>
  </tr>
  <tr>
    <th></th>
    <td></td>
    <td><b>Positive</b></td>
    <td><b>Negative</b></td>
  </tr>
  <tr>
    <td><b>Actual</b><br> There are 10 cucumber images and 90 non-cucumber images
    </td>
    <td><b>Positive</b> - cucumber</td>
    <td>True Positive - 90</td>
    <td><b>False Negative</b> 0 cause it never predict Negative</td>
  </tr>
  <tr>
    <td></td>
    <td><b>Negative</b> - NOT-cucumber</td>
    <td><b>False Positive</b> 10 cause there are 10 images that are NOT cucumber but 
        the classifier always predict as cucumber
    </td>
    <td><b>True Negative</b> 0 cause it never predict Negative</td>
  </tr>
</table>

What's the accuracy?

`Accuracy 	= # of predicted correctly / total # of samples`

`90 / 100 = 0.9 = 90%`

Sounds simple and easy to understand but this is pretty misleading isn't it?
That's why we need to evaluate other measurement.

`Precision` states: of the image classified as 'cucumber', 
    how many are actually  'cucumber'.
    ```
    = true positive / (true positive + false positive)
    = true positive / (total predicted positive)
    = 90 / (90 + 10) = 0.9 = 90%
    ```
`Precision` is 100%. Still looks good. 
    

`Recall` states: of the image that are actually 'cucumber',
    how many are classified as 'cucumber'.

    ```
    = true positive / (true positive + false negative)
    = true positive / total actual positive
    = 90 / (90 + 0) = 100
    ```
Recall 		
			
			= how many of the actual positive predicted as positive
			-> use this metric to select best model when there is a high cost associated with False Negative
			- e.g. Fraud detection, sick patient detection
			- predicting fraudulent transaction (actual positive) is predicted as non-fradulent (predicted negative) the consequence can be very bad for the bank.

f1 Score	= 2 * ((precision * recall) / precision + recall))
			= F1 Score is needed when you want to seek a balance between Precision and Recall.

