/*
* Docs:
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting
*/

const greeting = {
  greeting: [
    {
      locale: 'default',
      text: 'Hi {{user_first_name}}, i\'m a bot!'
    }
  ]
};

module.exports = {
  greeting
};
