// Script para gerar hash bcrypt para uso em migrations
// Uso: node scripts/gerar-hash-senha.js MinhaSenhaAqui

const bcrypt = require("bcryptjs");

async function main() {
  const senha = "admin123";

  if (!senha) {
    console.error(
      "Uso: node scripts/gerar-hash-senha.js <senha-em-texto-claro>",
    );
    process.exit(1);
  }

  const saltRounds = 10; // mesmo valor usado em AuthService

  try {
    const hash = await bcrypt.hash(senha, saltRounds);
    console.log("Senha:", senha);
    console.log("Hash bcrypt:", hash);
    console.log("\nCopie o hash acima para usar na migration.");
  } catch (err) {
    console.error("Erro ao gerar hash:", err);
    process.exit(1);
  }
}

main();
