const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Permette richieste da frontend
app.use(express.json()); // Per parsing del JSON

// Connessione al database SQLite
const db = new sqlite3.Database('./utenti.db');

// Creazione tabella se non esiste
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS utenti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        vendite INTEGER,
        pagamento REAL
    )`);
});

// Endpoint per aggiungere o aggiornare utente
app.post('/utente', (req, res) => {
    const { nome, vendite } = req.body;
    if (!nome || typeof vendite !== 'number') {
        return res.status(400).json({ error: 'Dati non validi' });
    }

    // Controlla se utente esiste
    db.get(`SELECT * FROM utenti WHERE nome = ?`, [nome], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            // Aggiorna vendite e pagamento
            const nuoveVendite = row.vendite + vendite;
            const pagamento = nuoveVendite * 2;
            db.run(`UPDATE utenti SET vendite = ?, pagamento = ? WHERE nome = ?`,
                [nuoveVendite, pagamento, nome],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Utente aggiornato' });
                });
        } else {
            // Inserisci nuovo utente
            const pagamento = vendite * 2;
            db.run(`INSERT INTO utenti (nome, vendite, pagamento) VALUES (?, ?, ?)`,
                [nome, vendite, pagamento],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Utente aggiunto' });
                });
        }
    });
});

// Endpoint per recuperare tutti gli utenti
app.get('/utenti', (req, res) => {
    db.all(`SELECT * FROM utenti`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Avvio del server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});