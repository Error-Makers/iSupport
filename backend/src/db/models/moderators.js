'use strict';


const Moderators = (db, DataTypes) => db.define('moderators', {
    mod_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false

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