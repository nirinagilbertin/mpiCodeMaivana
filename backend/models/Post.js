import { Model, DataTypes } from "sequelize";

const createClassPost = (sequelize) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: "userId" });
      Post.hasMany(models.Comment, { foreignKey: "postId", onDelete: "CASCADE" });
      Post.hasMany(models.Like, { foreignKey: "postId", onDelete: "CASCADE" });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postType: {
        type: DataTypes.ENUM("info", "alert", "event", "official"),
        defaultValue: "info",
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      isModerated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Post",
      freezeTableName: true,
    }
  );

  return Post;
};

export default createClassPost;