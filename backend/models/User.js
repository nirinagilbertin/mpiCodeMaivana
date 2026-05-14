import { Model, DataTypes } from "sequelize";

const createClassUser = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Un utilisateur peut avoir plusieurs signalements
      User.hasMany(models.Report, { foreignKey: "userId", onDelete: "CASCADE" });
      // Un utilisateur peut avoir plusieurs publications
      User.hasMany(models.Post, { foreignKey: "userId", onDelete: "CASCADE" });
      // Un utilisateur peut avoir plusieurs commentaires
      User.hasMany(models.Comment, { foreignKey: "userId", onDelete: "CASCADE" });
      // Un utilisateur peut avoir plusieurs likes
      User.hasMany(models.Like, { foreignKey: "userId", onDelete: "CASCADE" });
      // Un utilisateur peut avoir plusieurs notifications
      User.hasMany(models.Notification, { foreignKey: "userId", onDelete: "CASCADE" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("citizen", "admin"),
        defaultValue: "citizen",
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING,
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
      modelName: "User",
      freezeTableName: true,
    }
  );

  return User;
};

export default createClassUser;