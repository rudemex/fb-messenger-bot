const TemplateButton = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'What do you want to do next?',
      buttons: [
        {
          type: 'web_url',
          url: 'https://www.messenger.com',
          title: 'Visit Messenger',
          webview_height_ratio: 'compact',
          messenger_extensions: false
        },
        {
          type: 'postback',
          title: 'Btn postback',
          payload: 'BTN_POSTBACK_PAYLOAD'
        },
        {
          type: 'phone_number',
          title: 'Call Representative',
          payload: '+12233445566'
        }
      ]
    }
  }
};

module.exports = {
  TemplateButton
};
