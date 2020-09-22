const TemplateQuickReply = {
  text: 'Seleccione una opción',
  quick_replies: [
    {
      content_type: 'text',
      title: 'Title 1',
      payload: 'QUICK_REPLY_1_PAYLOAD'
    },
    {
      content_type: 'text',
      title: 'Title 2 🍀',
      payload: 'QUICK_REPLY_2_PAYLOAD'
    },
    {
      content_type: 'text',
      title: 'Title 3',
      payload: 'QUICK_REPLY_3_PAYLOAD',
      image_url: 'https://i.imgur.com/dWoQLZR.jpg'
    }
  ]
};

module.exports = {
  TemplateQuickReply
};
