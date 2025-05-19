const _supabase = createClient('https://cynshbqlpgghjgwltukp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8')
const supabase = createClient('https://cynshbqlpgghjgwltukp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8')
const { createClient } = supabase

console.log('Supabase Instance: ', _supabase)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('venditeForm');
    const tbody = document.querySelector('#risultatiTable tbody');

    // Funzione per calcolare il pagamento e vape gratis
    function calcolaPagamento(eVendite) {
        const pagamentoPerVape = 100; // esempio, 100 vendite per ottenere un vape gratis
        const pagamenti = Math.floor(eVendite / pagamentoPerVape) * 5; // esempio: 5€ per vape gratis
        const vapeGratis = Math.floor(eVendite / pagamentoPerVape);
        const venditeMancanti = pagamentoPerVape - (eVendite % pagamentoPerVape);
        return { pagamenti, vapeGratis, venditeMancanti };
    }

    // Funzione per mostrare i dati nella tabella
    function mostraRisultati(utenti) {
        tbody.innerHTML = '';
        utenti.forEach(utente => {
            const { nome, vendite } = utente;
            const { pagamenti, vapeGratis, venditeMancanti } = calcolaPagamento(vendite);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nome}</td>
                <td>${vendite}</td>
                <td>${pagamenti}</td>
                <td>${vapeGratis}</td>
                <td>${venditeMancanti}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Funzione per ottenere tutti gli utenti dal database
    async function ottieniUtenti() {
        const { data, error } = await supabase
            .from('utenti')
            .select('*');
        if (error) {
            console.error('Errore nel recupero utenti:', error);
            return [];
        }
        return data;
    }

    // Funzione per salvare un utente nel database
    async function salvaUtente(nome, vendite) {
        const { data, error } = await supabase
            .from('utenti')
            .insert([{ nome, vendite }]);
        if (error) {
            console.error('Errore nel salvataggio:', error);
        } else {
            console.log('Utente salvato:', data);
        }
    }

    // Carica i dati all'avvio
    async function caricaDati() {
        const utenti = await ottieniUtenti();
        mostraRisultati(utenti);
    }

    // Gestione submit del form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const vendite = parseInt(document.getElementById('vendite').value, 10);

        if (nome && !isNaN(vendite)) {
            await salvaUtente(nome, vendite);
            await caricaDati();
            form.reset();
        }
    });

    // Carica i dati iniziali
    caricaDati();
});
