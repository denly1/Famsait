const fs = require('fs');
let c = fs.readFileSync('src/app/page.tsx', 'utf8');

// Remove 15+ Площадок и 100+ Артистов
c = c.replace(
  '              { value: "15+", label: "Площадок" },\n              { value: "100+", label: "Артистов" },\n',
  ''
);

if (c.includes('Площадок')) {
  console.log('STILL HAS - trying other line ending');
  c = fs.readFileSync('src/app/page.tsx', 'utf8');
  c = c.replace(
    '              { value: "15+", label: "\u041f\u043b\u043e\u0449\u0430\u0434\u043e\u043a" },\r\n              { value: "100+", label: "\u0410\u0440\u0442\u0438\u0441\u0442\u043e\u0432" },\r\n',
    ''
  );
}

fs.writeFileSync('src/app/page.tsx', c, 'utf8');
console.log('Done, has Площадок:', c.includes('Площадок'));
