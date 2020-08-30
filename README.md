# fb-messenger-bot

### Text message
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

### Quick reply
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

### Attachment
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

### Postback
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