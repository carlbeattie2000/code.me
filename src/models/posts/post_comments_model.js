const { Sequelize, Model, DataTypes } = require("sequelize");
const crypto = require("crypto");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/posts.db",
  logging: false
});

class Comments extends Model {}
Comments.init(
  {
    comment_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posters_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    linked_post_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment_content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: DataTypes.INTEGER,
    comments_count: DataTypes.INTEGER,
    date_posted: DataTypes.DATE
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    sequelize,
    modelName: "comments"
  }
);

const createCommentsTable = async () => {
  await Comments.sync({ force: false });
}

const createNewComment = async(posters_id, linked_post_id, comment_content) => {
  const newComment = await Comments.create(
    {
      comment_id: crypto.randomBytes(16).toString("hex"),
      posters_id,
      linked_post_id,
      comment_content,
      likes: 0,
      comments_count: 0,
      date_posted: Math.floor(Date.now()/1000)
    }
  )

  newComment.save();
}

const getCommentByPostId = async (linked_post_id) => {
  const comments = await Comments.findAll(
    {
      where: {
        linked_post_id
      }
    }
  )

  return comments
}

const getCommentByPostersId = async (posters_id) => {
  const comments = await Comments.findAll(
    {
      where: {
        posters_id
      }
    }
  )

  return comments
}

module.exports = {
  createCommentsTable,
  createNewComment,
  getCommentByPostId,
  getCommentByPostersId
}
