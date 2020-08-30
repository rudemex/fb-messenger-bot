# fb-messenger-bot

[Facebook Developers - Messenger](https://developers.facebook.com/docs/messenger-platform)

### CURLS

#### Add btn get_started
```sh
curl -X POST -H "Content-Type: application/json" -d '{ 
    "get_started": {
        "payload": "GET_STARTED_PAYLOAD"
    }
}' "https://graph.facebook.com/v8.0/me/messenger_profile?access_token=<access_token>"
```

#### Add greeting
```sh
curl -X POST -H "Content-Type: application/json" -d '{
    "greeting": [{
      "locale": "default",
      "text": "Hola {{user_first_name}} soy un bot!"
    }]
}' "https://graph.facebook.com/v8.0/me/messenger_profile?access_token=<access_token>"
```

#### Add persistent menu
```sh
curl -X POST -H "Content-Type: application/json" -d '{
   "persistent_menu":[
      {
         "locale":"default",
         "composer_input_disabled":false,
         "call_to_actions":[
            {
               "title":"<TITLE_FOR_THE_CTA>",
               "type":"postback",
               "payload":"<USER_DEFINED_PAYLOAD>"
            },
            {
               "title":"TITLE_FOR_THE_CTA_2",
               "type":"postback",
               "payload":"USER_DEFINED_2_PAYLOAD"
            },
            {
               "type":"web_url",
               "title":"My Website",
               "url":"http://mysite.com/",
               "webview_height_ratio":"full"
            }
         ]
      }
   ]
}' "https://graph.facebook.com/v8.0/me/messenger_profile?access_token=<access_token>"
```

#### Remove persistent menu
```sh
curl -X DELETE -H "Content-Type: application/json" -d '{
    "fields":[
        "persistent_menu"
    ]
}' "https://graph.facebook.com/v8.0/me/messenger_profile?access_token=<access_token>"
```


#### Text message
```json5
{
  sender: {
    id: '<SENDER_ID>',
  },
  recipient: {
    id: '<PAGE_ID>',
  },
  timestamp: 1598801580458,
  message: {
    mid: '<HASH>',
    text: 'hola',
    nlp: {
      intents: [],
      entities: {},
      traits: {},
      detected_locales: [],
    },
  },
}
```

#### Quick reply
```json5
{
  sender: {
    id: '<SENDER_ID>',
  },
  recipient: {
    id: '<PAGE_ID>',
  },
  timestamp: 1598802076308,
  message: {
    mid: '<HASH>',
    text: '<TITLE_FOR_THE_CTA>',
    nlp: {
      intents: [],
      entities: {},
      traits: {},
      detected_locales: [],
    },
    quick_reply: {
      payload: '<USER_DEFINED_PAYLOAD>',
    },
  },
}
```

#### Attachment
```json5
{
  sender: {
    id: '<SENDER_ID>',
  },
  recipient: {
    id: '<PAGE_ID>',
  },
  timestamp: 1598802331198,
  message: {
    mid: '<HASH>',
    attachments: [
      {
        type: '<image | video | audio | files>',
        payload: {
          url: '<URL_ATTACHMENT>',
        },
      },
    ],
  },
}
```

#### Postback
```json5
{
  sender: {
    id: '<SENDER_ID>',
  },
  recipient: {
    id: '<PAGE_ID>',
  },
  timestamp: 1598801372318,
  postback: {
    title: '<TITLE_FOR_THE_CTA>',
    payload: '<USER_DEFINED_PAYLOAD>',
  },
}
```