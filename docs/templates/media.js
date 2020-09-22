const TemplateMediaImage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'media',
      elements: [
        {
          media_type: 'image',
          url:
            'https://www.facebook.com/enespanol/photos/a.398784743469240/857414157606294',
          buttons: [
            {
              type: 'web_url',
              url: 'https://www.facebook.com/enespanol',
              title: 'View Website'
            }
          ]
        }
      ]
    }
  }
};

const TemplateMediaVideo = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'media',
      elements: [
        {
          media_type: 'video',
          url: 'https://www.facebook.com/185150934832623/videos/1131916223489418',
          buttons: [
            {
              type: 'web_url',
              url: 'https://www.facebook.com/enespanol',
              title: 'View Website'
            }
          ]
        }
      ]
    }
  }
};

module.exports = {
  TemplateMediaImage,
  TemplateMediaVideo
};
