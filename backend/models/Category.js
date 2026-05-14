import { Model, DataTypes } from "sequelize";

const createClassCategory = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Report, { foreignKey: "categoryId" });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "#6c757d",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      freezeTableName: true,
    }
  );

  return Category;
};

export default createClassCategory;