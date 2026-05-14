import { Sequelize } from "sequelize";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import createClassUser from "./User.js";
import createClassCategory from "./Category.js";
import createClassReport from "./Report.js";
import createClassPost from "./Post.js";
import createClassComment from "./Comment.js";
import createClassLike from "./Like.js";
import createClassNotification from "./Notification.js";

config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // ou "mysql" selon votre choix
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const model = {};

model.sequelize = sequelize;
model.User = createClassUser(sequelize);
model.Category = createClassCategory(sequelize);
model.Report = createClassReport(sequelize);
model.Post = createClassPost(sequelize);
model.Comment = createClassComment(sequelize);
model.Like = createClassLike(sequelize);
model.Notification = createClassNotification(sequelize);

// Appel des associations
Object.keys(model).forEach((modelName) => {
  if (model[modelName].associate) {
    model[modelName].associate(model);
  }
});

//#########___________SYNCHRONISATION_________________#################
export const Synchronisation = async () => {
  try {
    const data = await sequelize.sync(); // Retirer force: true pour éviter les conflits

    const adminEmail = "admin@admin.com";
    const adminPassword = "123456";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await model.User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        email: adminEmail,
        password: hashedPassword,
        fullName: "Administrateur",
        role: "admin",
        isActive: true,
      },
    });

    console.log("Synchronisation terminée avec succès", data);
    console.log(`Admin créé : ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.log("Une erreur est survenue", err);
  }
};
// await Synchronisation();

export default model;