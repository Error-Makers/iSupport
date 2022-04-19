'use strict';


const PostsCommunitiesUsers = (db, DataTypes) => db.define('posts_communities_users', {

    post_user_community_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
    user_community_id :{
        type :DataTypes.INTEGER,

    },
    post_id :{
        type :DataTypes.INTEGER,

    },

});


module.exports =PostsCommunitiesUsers;
