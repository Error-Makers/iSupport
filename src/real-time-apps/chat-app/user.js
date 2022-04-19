const users = [];

// join user to community chat
function userJoin(id, username, community_id) {
  const user = { id, username, community_id };
  // push user to users array
  users.push(user);
  return user;
}

// get current user using user id
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// user leve community chat using his id
function leveCommunity(id) {
  const data = users.findIndex((user) => user.id === id);

  if (data !== -1) {
    return users.splice(data, 1)[0];
  }
}

// get user community
function getUserCommunity(community) {
  return users.filter((user) => user.community === community);
}

module.exports = {
  userJoin,
  getCurrentUser,
  leveCommunity,
  getUserCommunity,
};
