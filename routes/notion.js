var express = require('express');
var router = express.Router();
const {Client} = require('@notionhq/client');
const { createPage } = require('@notionhq/client/build/src/api-endpoints');
const { json } = require('express');

const notion = new Client({auth: process.env.NOTION_API_KEY})

function todaysDate(){
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
return today;
}

function todaysDateISO(){
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy  + '-' + mm + '-' + dd;
return today;
}

function createBulletedList(){
// define the structure of the parent JSON object
var jsonObject = {
    "children": []
  };
  
  // define the structure of the child JSON objects
  var childObject = {
    "object": "block",
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": {
          "content": "",
          "link": null
        }
      }],
      "color": "default"
    }
  };
  
  var items = ["Lacinato kale", "Red leaf lettuce", "Spinach"];
  
  items.forEach(function(item) {
    var newChildObject = JSON.parse(JSON.stringify(childObject));
    newChildObject.bulleted_list_item.rich_text[0].text.content = item;
    jsonObject.children.push(newChildObject);
  }); 
  return jsonObject["children"];
}


async function createNewPage(){
    var today = new Date();
    var date = today.getDate(); 

    const response = await notion.pages.create({
      "icon": {
          "type": "emoji",
          "emoji": "🌶"
      },
      "parent": {
          "type": "database_id",
          "database_id": process.env.NOTION_DATABASE_ID
      },
      "properties": {
        [process.env.NOTION_NAME_ID]: {
            "title": [
                {
                    "text": {
                        "content": "Shopping List - " + todaysDate()
                    }
                }
            ]
        },
        
        [process.env.NOTION_DATE_ID]:{
            "date":{
                "start" : todaysDateISO()
            } 
        }
      },
      "children": createBulletedList()
  });
    console.log(response);
  };

  createNewPage();
// /* GET notion page. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
