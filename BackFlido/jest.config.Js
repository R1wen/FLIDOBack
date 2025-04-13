/**
 * Configuration de base de JEST pour les tests unitaires
 * Lors du "npm test", il cherchera tout les fichier
 * finissant en ".test.js"
 */

const config = {
  verbose: true,

  testMatch: ["**/tests/**/*.test.js"],
};

module.exports = config;
