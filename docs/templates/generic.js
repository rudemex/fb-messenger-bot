const TemplateGeneric = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: 'Cool T-shirt',
          image_url: 'https://i.imgur.com/KyyexVl.png',
          subtitle: 'this is a t-shirt very awesome',
          buttons: [
            {
              type: 'postback',
              title: 'Buy',
              payload: 'BUY_TSHIRT_PAYLOAD'
            },
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'CALL_SUPPORT_PAYLOAD'
            }
          ]
        },
        {
          title: 'Cool T-shirt',
          image_url: 'https://i.imgur.com/KyyexVl.png',
          subtitle: 'this is a t-shirt very awesome',
          buttons: [
            {
              type: 'postback',
              title: 'Buy',
              payload: 'BUY_TSHIRT_PAYLOAD'
            },
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'CALL_SUPPORT_PAYLOAD'
            }
          ]
        },
        {
          title: 'Cool T-shirt',
          image_url: 'https://i.imgur.com/KyyexVl.png',
          subtitle: 'this is a t-shirt very awesome',
          buttons: [
            {
              type: 'postback',
              title: 'Buy',
              payload: 'BUY_TSHIRT_PAYLOAD'
            },
            {
              type: 'postback',
              title: 'Start Chatting',
              payload: 'CALL_SUPPORT_PAYLOAD'
            }
          ]
        }
      ]
    }
  }
};

module.exports = {
  TemplateGeneric
};
