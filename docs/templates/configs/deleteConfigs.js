/*
 * Other Params Fields
 *
 */

const deleteGetStarted = {
  fields: ['get_started']
};

const deleteGreeting = {
  fields: ['greeting']
};

const deletePersistentMenu = {
  fields: ['persistent_menu']
};

const deleteAll = {
  fields: ['persistent_menu,get_started,greeting']
};

const deleteAllFields = {
  fields: ['get_started,persistent_menu,target_audience,whitelisted_domains,greeting,account_linking_url,payment_settings,home_url,ice_breakers']
};

module.exports = {
  deleteGetStarted,
  deleteGreeting,
  deletePersistentMenu,
  deleteAll,
  deleteAllFields
};
