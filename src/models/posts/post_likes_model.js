const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/posts.db",
  logging: false
});

class Likes extends Model {}
Likes.init(
  {
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    liker_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    sequelize,
    modelName: "likes"
  }
);

const createLikesTable = async () => {
  await Likes.sync({ force: false });
}

const createNewLikedPost = async (post_id, liker_id) => {
  const newLike = await Likes.create(
    {
      post_id,
      liker_id
    }
  )

  newLike.save();
}

const findLikesByPostId = async(post_id) => {
  const likes = await Likes.findAll(
    {
      where: {
        post_id
      }
    }
  )

  return likes
}

const findLikesByUserId = async (liker_id) => {
  const likes = await Likes.findAll(
    {
      where: {
        liker_id
      }
    }
  )

  return likes
}

module.exports = {
  createLikesTable,
  createNewLikedPost,
  findLikesByPostId,
  findLikesByUserId
}
