const { Sequelize, Model, DataTypes } = require("sequelize");
const crypto = require("crypto");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/posts.db",
  logging: false
});

class Posts extends Model {}
Posts.init(
  {
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posters_id: DataTypes.STRING,
    post_content: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    comments_count: DataTypes.INTEGER,
    date_posted: DataTypes.INTEGER
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    sequelize,
    modelName: "posts"
  }
);

const createPostsTable = async () => {
  await Posts.sync({ force: false });
}

const createNewPost = async (posters_id, post_content) => {
  const newPost = await Posts.create(
    {
      post_id: crypto.randomBytes(14).toString("hex"),
      posters_id: posters_id,
      post_content: post_content,
      likes: 0,
      comments_count: 0,
      date_posted: Math.floor(Date.now()/1000),
    }
  )

  newPost.save();
}

const getAllPosts = async () => {
  const posts = await Posts.findAll();

  return posts
}

const getPostById = async (post_id) => {
  const posts = await Posts.findAll(
    {
      where: {
        post_id
      }
    }
  )

  return posts
}

const getAllPostsByPostersId = async (posters_id) => {
  const posts = await Posts.findAll(
    {
      where: {
        posters_id
      }
    }
  )

  return posts
}

module.exports = {
  createPostsTable,
  createNewPost,
  getAllPosts,
  getPostById,
  getAllPostsByPostersId
}
