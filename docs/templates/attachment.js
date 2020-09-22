const TemplateAttachmentImage = {
  attachment: {
    type: 'image',
    payload: {
      url: 'https://i.imgur.com/GtxeUQJ.jpg',
      is_reusable: true
    }
  }
};

const TemplateAttachmentVideo = {
  attachment: {
    type: 'video',
    payload: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
    }
  }
};

const TemplateAttachmentAudio = {
  attachment: {
    type: 'audio',
    payload: {
      url: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3'
    }
  }
};

const TemplateAttachmentFile = {
  attachment: {
    type: 'file',
    payload: {
      url: 'https://www.tresdoce.com.ar/Abstract-Space.pdf'
    }
  }
};

module.exports = {
  TemplateAttachmentImage,
  TemplateAttachmentVideo,
  TemplateAttachmentAudio,
  TemplateAttachmentFile
};
