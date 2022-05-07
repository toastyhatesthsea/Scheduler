Name: Robert Zafaripour
Class: Comp Architecture
Final Project


This project follows the MVC diagram and styling pattern. It is a Scheduler app that is run through the browser. The user can enter tasks, edit them and delete them as they choose. The page is updated dynamically, which allows for live updates according to the data the user enters into the form and if the user deletes or edits the data.
    The model diagram is used to manage the data. It handles representing the data in 3 elements. The first element is the identifier, the second is the text describing the data and the last is an element which tells if the task is finished. The Model is able to add, edit, delete and change the finished element within the model class. The model uses a list to contain all the data and pushes the data onto a local json file in the user’s system.
    The view diagram is used to display the data to the user. A form, button, textbox and checkbox are displayed to the user. The view class has binders that add listeners to the various user interactive elements on the webpage. It also has a function that listens for new data and displays them.
    The last diagram used is the controller class. The controller class links the model and view classes together and runs the web app. It adds the event listeners to the binder classes in the view class and allows for the web app to run.


----------------------HOWTORUN---------------


Just open the index.html webpage with your favorite browser. The scheduler will open and you will be able to add, delete and edit tasks how you see fit.