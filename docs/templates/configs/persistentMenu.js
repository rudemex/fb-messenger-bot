/*
* Docs:
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu
*/

const persistentMenu = {
  persistent_menu: [
    {
      locale: 'default',
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: 'Get ID',
          type: 'postback',
          payload: 'GET_ID_MESSENGER_PAYLOAD'
        },
        {
          title: 'About us',
          type: 'postback',
          payload: 'ABOUT_US_PAYLOAD'
        },
        {
          title: 'Contact',
          type: 'postback',
          payload: 'CONTACT_PAYLOAD'
        },
        {
          type: 'web_url',
          title: '💻 Visit my Website',
          url: 'https://github.com/rudemex/fb-messenger-bot#readme',
          webview_height_ratio: 'full'
        }
      ]
    }
  ]
};

module.exports = {
  persistentMenu
};
