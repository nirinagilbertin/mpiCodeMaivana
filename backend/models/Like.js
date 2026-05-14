import { Model, DataTypes } from "sequelize";

const createClassLike = (sequelize) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: "userId" });
      Like.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }

  Like.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "like",
      },
    },
    {
      sequelize,
      modelName: "Like",
      freezeTableName: true,
    }
  );

  return Like;
};

export default createClassLike;