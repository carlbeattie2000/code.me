const { Sequelize, Model, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/accounts.db",
  logging: false
});

class Followers extends Model {};
Followers.init(
  {
    account_following_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    follower_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    sequelize,
    modelName: "followers"
  }
);

const createFollowersTable = async () => {
  await Followers.sync({force: false});
}

const followUser = async (account_following_id, follower_id) => {
  const newFollow = await Followers.create(
    {
      account_following_id,
      follower_id
    }
  )

  newFollow.save();
}

const unFollowUser = async (account_following_id, follower_id) => {
  await Followers.destroy(
    {
      where: {
        [Op.and]: [
          { account_following_id },
          { follower_id }
        ]
      }
    }
  )
}

const getAccountFollowersAmount = async (account_id) => {
  const accountFollowersList = await Followers.findAll({
    where: {
      account_following_id: account_id,
    }
  })

  return accountFollowersList.length;
}

const getAccountFollowingAmount = async (user_id) => {
  const userFollowingList = await Followers.findAll({
    where: {
      follower_id: user_id,
    }
  })

  return userFollowingList.length;
}

module.exports = {
  createFollowersTable,
  followUser,
  unFollowUser,
  getAccountFollowersAmount,
  getAccountFollowingAmount
}