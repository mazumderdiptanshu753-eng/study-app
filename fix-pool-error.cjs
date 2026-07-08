const fs = require('fs');
let db = fs.readFileSync('server/db.ts', 'utf8');

if (!db.includes("pool.on('error'")) {
  db = db.replace(
    '  });',
    '  });\n\n  pool.on("error", (err) => {\n    console.error("Unexpected error on idle client", err);\n  });'
  );
  fs.writeFileSync('server/db.ts', db);
  console.log("Added pool error handler");
}
