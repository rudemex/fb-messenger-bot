const persistentMenu = {
  "persistent_menu":[
    {
      "locale":"default",
      "composer_input_disabled":false,
      "call_to_actions":[
        {
          "title":"About us",
          "type":"postback",
          "payload":"ABOUT_US_PAYLOAD"
        },
        {
          "title":"Contact",
          "type":"postback",
          "payload":"CONTACT_PAYLOAD"
        },
        {
          "type":"web_url",
          "title":"💻 Visit my Website",
          "url":"http://misite.com/",
          "webview_height_ratio":"full"
        }
      ]
    }
  ]
};

module.exports = {
  persistentMenu,
};
