function convertToCSV(rawText) {
    // rozbij dane na linie i usuń puste
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
    const records = [];

    // teraz grupujemy po 8 linijek
    for (let i = 0; i < lines.length; i += 8) {
        const chunk = lines.slice(i, i + 8);

        // jeśli niekompletny, pomiń
        if (chunk.length < 8) {
            console.warn(`⚠️ Pominięto niekompletny blok od ${i + 1} do ${i + chunk.length}`);
            continue;
        }

        const [lp, id, nazwa, imie, ilosc, kwotaRaw, dataRaw, gra] = chunk;

        // czyszczenie i formatowanie kwoty
        const kwota = (kwotaRaw || '')
            .replace('€', '')
            .replace(',', '.')
            .replace(/\s+/g, '')
            .trim();

        // format daty: 10.11.202511:43 → 2025-11-10 11:43
        let dataGodzina = '';
        if (dataRaw) {
            const match = dataRaw.match(/(\d{2})\.(\d{2})\.(\d{4})(\d{2}):(\d{2})/);
            if (match) {
                const [_, dd, mm, yyyy, HH, MM] = match;
                dataGodzina = `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
            }
        }

        records.push({
            Lp: lp || '',
            ID: id || '',
            Nazwa: nazwa || '',
            Imię: imie || '',
            Ilość: ilosc || '',
            Kwota: kwota,
            'Data i godzina': dataGodzina,
            Gra: gra || ''
        });
    }

    // generowanie CSV
    const headers = ['Lp', 'ID', 'Nazwa', 'Imię', 'Ilość', 'Kwota', 'Data i godzina', 'Gra'];
    const csvLines = [headers.join(';')];

    for (const rec of records) {
        csvLines.push(headers.map(h => rec[h]).join(';'));
    }

    return csvLines.join('\n');
}

// Przykład użycia (Node.js)
const fs = require('fs');

const inputData = fs.readFileSync('orders.txt', 'utf8'); // plik z danymi wejściowymi
const csv = convertToCSV(inputData);

fs.writeFileSync('orders_converted.csv', csv, 'utf8');
console.log('✅ Zapisano do orders_converted.csv');
