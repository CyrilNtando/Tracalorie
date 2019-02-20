//Storage Controller

/******************************************************************************************* */
//Item Controller
const ItemController = (function() {
  //Declare Private variables and Functions
  //item contructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //Data Structure /State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  };

  return {
    //Declare Public variables and Functions
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      //Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories);

      //create  new item
      newItem = new Item(ID, name, calories);
      //add to item Array
      data.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      //set total cal in data structure
      data.totalCalories = total;
      //return total
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

/******************************************************************************************* */
//UI Controller
const UIController = (function() {
  //declare private variables and functions
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemName: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  function showList() {
    document.querySelector(UISelectors.itemList).style.display = "block";
  }
  return {
    //declare public variables and functions
    populateItemList(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fas fa-pencil-alt"></i>
            </a>
          </li>`;
      });
      //insert List item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    //get item input
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      //show the list
      showList();
      //create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      //Add ID
      li.id = `item-${item.id}`;
      //Adfd HTML
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
        `;
      //insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    //clear input
    clearInput: function() {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    //hide List
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    //get UI selectors
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

/******************************************************************************************* */
//App Controller
const App = (function(ItemCtr, UICtrl) {
  //Declare private variables and functions
  //Load event Listeners
  const loadEventListeners = () => {
    //Get UI selectors
    var UISelectors = UICtrl.getSelectors();
    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSumit);
  };

  //Add Item Submit
  const itemAddSumit = function(e) {
    //Get from input from UI controller
    const input = UICtrl.getItemInput();
    //input validation
    if (input.name !== "" && input.calories !== "") {
      //add item
      const newItem = ItemCtr.addItem(input.name, input.calories);
      //Add item to UI LIst
      UICtrl.addListItem(newItem);
      //show calories
      displayTotalcalories();
      //clear field
      UIController.clearInput();
    }
    e.preventDefault();
  };
  const items = ItemCtr.getItems();
  //Get and Display Total Calories
  function displayTotalcalories() {
    //Get total calories
    const totalCalories = ItemCtr.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
  }
  return {
    //declare public variables and functions
    init: () => {
      //check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //load items to UI
        UICtrl.populateItemList(items);
      }
      displayTotalcalories();
      //load event Listeners
      loadEventListeners();
    }
  };
})(ItemController, UIController);

App.init();
