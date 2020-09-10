const deleteGetStarted = {
  fields: ['get_started'],
};

const deleteGreeting = {
  fields: ['greeting'],
};

const deletePersistentMenu = {
  fields: ['persistent_menu'],
};

const deleteAll = {
  fields: ['get_started,greeting,persistent_menu'],
};

module.exports = {
  deleteGetStarted,
  deleteGreeting,
  deletePersistentMenu,
  deleteAll
};
