import test from 'node:test';
import assert from 'node:assert/strict';

function generateCSVContent(data, columns) {
  if (!data || data.length === 0) return '';
  const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(row => {
    return columns.map(c => {
      const val = row[c.key];
      if (val === null || val === undefined) return '""';
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    }).join(',');
  });

  return `\uFEFF${headers}\r\n${rows.join('\r\n')}`;
}

test('CSV Export Formatter Suite', async (t) => {
  const sampleColumns = [
    { key: 'id', label: 'Record ID' },
    { key: 'name', label: 'Patient Name' },
    { key: 'diagnosis', label: 'Diagnosis / Notes' },
    { key: 'age', label: 'Age' },
  ];

  await t.test('Generates BOM prefix and correct headers', () => {
    const data = [{ id: 1, name: 'John Doe', diagnosis: 'Flu', age: 30 }];
    const csv = generateCSVContent(data, sampleColumns);

    assert.ok(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');
    assert.ok(csv.includes('"Record ID","Patient Name","Diagnosis / Notes","Age"'));
    assert.ok(csv.includes('"1","John Doe","Flu","30"'));
  });

  await t.test('Handles quotes and commas inside text values safely', () => {
    const data = [
      { id: 2, name: 'Smith, Jane "Dr."', diagnosis: 'Severe, persistent "cough"\r\nfever', age: 45 },
    ];
    const csv = generateCSVContent(data, sampleColumns);

    assert.ok(csv.includes('"Smith, Jane ""Dr."""'));
    assert.ok(csv.includes('"Severe, persistent ""cough""\r\nfever"'));
  });

  await t.test('Handles null and undefined values safely', () => {
    const data = [
      { id: 3, name: 'Alice', diagnosis: null, age: undefined },
    ];
    const csv = generateCSVContent(data, sampleColumns);

    assert.ok(csv.includes('"3","Alice","",""'));
  });

  await t.test('Returns empty string when data is empty', () => {
    const csv = generateCSVContent([], sampleColumns);
    assert.strictEqual(csv, '');
  });
});
