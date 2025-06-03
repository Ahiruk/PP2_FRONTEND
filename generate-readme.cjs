// generate-readme.js
const fs = require("fs");

const content = `
# PP2_FRONTEND

_Empower Your Projects, Connect with Your Community_

![last commit](https://img.shields.io/github/last-commit/tuusuario/PP2_FRONTEND?style=flat-square)
![javascript](https://img.shields.io/badge/javascript-57.4%25-blue?style=flat-square)
![languages](https://img.shields.io/github/languages/count/tuusuario/PP2_FRONTEND?style=flat-square)

---

_Built with the tools and technologies:_

![JSON](https://img.shields.io/badge/JSON-black?style=for-the-badge&logo=json)
![Markdown](https://img.shields.io/badge/Markdown-black?style=for-the-badge&logo=markdown)
![npm](https://img.shields.io/badge/npm-red?style=for-the-badge&logo=npm)
![Firebase](https://img.shields.io/badge/Firebase-orange?style=for-the-badge&logo=firebase)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript)
![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-purple?style=for-the-badge&logo=vite)
![ESLint](https://img.shields.io/badge/ESLint-indigo?style=for-the-badge&logo=eslint)

`;

fs.writeFileSync("README.md", content.trim());
console.log("✅ README.md generado con éxito.");
