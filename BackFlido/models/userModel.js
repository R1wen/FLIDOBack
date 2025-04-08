const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    validate: {
      validator: function (value) {
        return validator.matches(
          value,
          /^[a-zA-Zàáâäãåąčćęèéêëìíîïłńòóôöõøùúûüýÿ\s'-]+$/
        );
      },
      message:
        "Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
    },
  },
  firstname: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true,
    minlength: [2, "Le prénom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    validate: {
      validator: function (value) {
        return validator.matches(
          value,
          /^[a-zA-Zàáâäãåąčćęèéêëìíîïłńòóôöõøùúûüýÿ\s'-]+$/
        );
      },
      message:
        "Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets",
    },
  },
  email: {
    type: String,
    require: [true, "Email obligatoire"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Veuillez entrer une adresse email valide",
    },
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 8 caractères"],
    validate: {
      validator: function (value) {
        return validator.matches(
          value,
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        );
      },
      message:
        "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
