import { Model, DataTypes } from "sequelize";

const createClassReport = (sequelize) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: "userId" });
      Report.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }

  Report.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urgency: {
        type: DataTypes.ENUM("low", "medium", "high", "critical"),
        defaultValue: "medium",
      },
      status: {
        type: DataTypes.ENUM("pending", "validated", "in_progress", "resolved", "rejected"),
        defaultValue: "pending",
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      adminComment: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "Report",
      freezeTableName: true,
    }
  );

  return Report;
};

export default createClassReport;