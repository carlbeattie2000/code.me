const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const crypto = require("crypto");
const passwordTools = require("../../helpers/hashing");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/accounts.db",
  logging: false
});

class Users extends Model {};
Users.init(
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicPath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    confirmedCorrectAge: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    passwordSalt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    sequelize,
    modelName: "users"
  }
);

const createUsersTable = async () => {
  await Users.sync({force: false});
}

const createNewUser = async (email, name, username, password, profilePicPath, dateOfBirth, confirmedCorrectAge) => {
  const customPasswordSalt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = passwordTools.hashStringWithCustomSalt(password, customPasswordSalt);
  const accountID = crypto.randomBytes(10).toString("hex");

  const newUser = await Users.create(
    {
      user_id: accountID,
      email,
      name,
      username,
      password: hashedPassword,
      profilePicPath,
      dateOfBirth,
      confirmedCorrectAge,
      passwordSalt: customPasswordSalt
    }
  )

  newUser.save();
}

const getUserById = async (user_id) => {
  const user = Users.findAll(
    {
      where: {
        user_id
      }
    }
  )

  return user
}

const getUserByIdOrUsername = async (userQuery) => {
  const user = Users.findAll(
    {
      attributes: ["user_id", "name", "username", "profilePicPath", "created_at"],
      where: {
        [Op.or]: [
          { user_id: userQuery },
          { username: userQuery }
        ]
      }
    }
  )

  return user
}

const validUserLogin = async (username_or_email, password) => {
  const user = await Users.findAll(
    {
      where: {
        [Op.or]: [
          { email: username_or_email },
          { username: username_or_email }
        ]
      }
    }
  )

  if (user.length > 0) {
    if (passwordTools.hashStringWithCustomSalt(password, user[0].dataValues.passwordSalt) == user.password) {
      return user
    }
  }

  return user
}

const userWithEmailAlreadyExists = async (email) => {
  const user = Users.findAll(
    {
      where: {
        email
      }
    }
  )

  return user
}

module.exports = {
  createUsersTable,
  createNewUser,
  getUserById,
  getUserByIdOrUsername,
  validUserLogin,
  userWithEmailAlreadyExists
}