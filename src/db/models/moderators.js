'use strict';


const Moderators = (db, DataTypes) => db.define('moderators', {
    mod_name: {
        type: DataTypes.STRING,
        allowNull: false,

    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    community_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    }

});

module.exports = Moderators;