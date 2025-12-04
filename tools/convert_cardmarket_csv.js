/* eslint-disable */
//#!/usr/bin/env node
// Skrypt konwertuje pola 'Article Value', 'Total' (przecinek -> kropka) i 'Date of payment' (DD/MM/YYYY HH:mm -> YYYY-MM-DD HH:mm)
// Użycie: node tools\convert_cardmarket_csv.js <input.csv> [output.csv]

const fs = require('fs');
const path = require('path');

function splitSemicolonLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // If next char is also quote, it's an escaped quote
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1; // avoid standalone increment warning
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function joinSemicolonLine(fields) {
  return fields.map(f => {
    if (f == null) return '';
    if (f.includes(';') || f.includes('"') || f.includes('\n')) {
      return '"' + String(f).replaceAll('"', '""') + '"';
    }
    return f;
  }).join(';');
}

function parseDate(input) {
  // Expecting DD/MM/YYYY H:mm or DD/MM/YYYY HH:mm
  if (!input || input.trim() === '') return input;
  const trimmed = input.trim();
  // Some inputs might use '-' or '.' as separators; handle common variants
  const dateTimeParts = trimmed.split(' ');
  if (dateTimeParts.length < 2) return input;
  const datePart = dateTimeParts[0];
  const timePart = dateTimeParts.slice(1).join(' ');
  let dateSep = null;
  if (datePart.includes('/')) dateSep = '/';
  else if (datePart.includes('-')) dateSep = '-';
  else if (datePart.includes('.')) dateSep = '.';
  if (!dateSep) return input;
  const dp = datePart.split(dateSep);
  // Assume input is DD/MM/YYYY (based on sample). If month > 12, swap is not needed.
  if (dp.length !== 3) return input;
  let [dd, mm, yyyy] = dp;
  // zero-pad
  dd = dd.padStart(2, '0');
  mm = mm.padStart(2, '0');
  // parse time
  const timeMatch = timePart.match(/(\d{1,2}):(\d{1,2})/);
  if (!timeMatch) return `${yyyy}-${mm}-${dd} ${timePart}`;
  let hh = timeMatch[1].padStart(2, '0');
  let min = timeMatch[2].padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function convertMoney(input) {
  if (input == null) return input;
  let s = String(input).trim();
  if (s === '') return s;
  // Remove spaces (thousands separators sometimes are spaces)
  s = s.replaceAll(/^\s+|\s+$/g, '');
  s = s.replaceAll(/\s+/g, '');
  // Replace comma decimal separator with dot
  s = s.replaceAll(',', '.');
  // If value is like "7,2" -> "7.2"; keep as-is otherwise
  return s;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(String.raw`Usage: node tools\\convert_cardmarket_csv.js <input.csv> [output.csv]`);
    process.exit(2);
  }
  const inputPath = path.resolve(args[0]);
  const outputPath = args[1] ? path.resolve(args[1]) : inputPath + '.converted.csv';

  const content = fs.readFileSync(inputPath, { encoding: 'utf8' });
  const lines = content.split(/\r?\n/);
  if (lines.length === 0) {
    console.error('Empty file');
    process.exit(3);
  }

  const headerLine = lines[0];
  const headers = splitSemicolonLine(headerLine);
  const idxDate = headers.findIndex(h => h.trim().toLowerCase() === 'date of payment'.toLowerCase());
  const idxArticleValue = headers.findIndex(h => h.trim().toLowerCase() === 'article value'.toLowerCase());
  const idxTotal = headers.findIndex(h => h.trim().toLowerCase() === 'total'.toLowerCase());

  if (idxDate === -1 && idxArticleValue === -1 && idxTotal === -1) {
    console.error('Nie znaleziono kolumn: Date of payment, Article Value, ani Total w nagłówku. Nagłówek:', headers.join(', '));
    // nadal spróbuj zapisać kopię
  }

  const out = [ headerLine ];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { out.push(''); continue; }
    const fields = splitSemicolonLine(line);
    if (idxArticleValue !== -1 && idxArticleValue < fields.length) {
      fields[idxArticleValue] = convertMoney(fields[idxArticleValue]);
    }
    if (idxTotal !== -1 && idxTotal < fields.length) {
      fields[idxTotal] = convertMoney(fields[idxTotal]);
    }
    if (idxDate !== -1 && idxDate < fields.length) {
      fields[idxDate] = parseDate(fields[idxDate]);
    }
    out.push(joinSemicolonLine(fields));
  }

  fs.writeFileSync(outputPath, out.join('\n'), { encoding: 'utf8' });
  console.log('Wynik zapisano do', outputPath);
}

main();
