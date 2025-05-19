const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configura la connessione al database PostgreSQL
const pool = new Pool({
    user: 'gestionetvuser',      // il tuo utente
    host: 'localhost',            // host del database
    database: 'gestionetv',       // nome del database
    password: 'tuapassword',     // password dell'utente
    port: 5432,                   // porta di default di PostgreSQL
});

// Creazione tabella se non esiste
pool.query(`
    CREATE TABLE IF NOT EXISTS utenti (
        id SERIAL PRIMARY KEY,
        nome TEXT UNIQUE,
        vendite INTEGER,
        pagamento REAL
    );
`, (err, res) => {
    if (err) {
        console.error('Errore creazione tabella:', err);
    } else {
        console.log('Tabella utenti pronta');
    }
});

// Endpoint per aggiungere o aggiornare utente
app.post('/utente', (req, res) => {
    const { nome, vendite } = req.body;
    if (!nome || typeof vendite !== 'number') {
        return res.status(400).json({ error: 'Dati non validi' });
    }

    // Verifica se utente esiste
    pool.query('SELECT * FROM utenti WHERE nome = $1', [nome], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.rows.length > 0) {
            // Aggiorna vendite e pagamento
            const user = result.rows[0];
            const nuoveVendite = user.vendite + vendite;
            const pagamento = nuoveVendite * 2;
            pool.query(
                'UPDATE utenti SET vendite = $1, pagamento = $2 WHERE nome = $3',
                [nuoveVendite, pagamento, nome],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Utente aggiornato' });
                }
            );
        } else {
            // Inserisci nuovo utente
            const pagamento = vendite * 2;
            pool.query(
                'INSERT INTO utenti (nome, vendite, pagamento) VALUES ($1, $2, $3)',
                [nome, vendite, pagamento],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Utente aggiunto' });
                }
            );
        }
    });
});

// Endpoint per recuperare tutti gli utenti
app.get('/utenti', (req, res) => {
    pool.query('SELECT * FROM utenti', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result.rows);
    });
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});