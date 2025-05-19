// Rimuovi la logica di gestione locale degli utenti
// e fai richieste al backend

document.getElementById('venditeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nomeInput = document.getElementById('nome');
    const venditeInput = document.getElementById('vendite');

    const nomeOriginale = nomeInput.value.trim();
    const nome = nomeOriginale.toLowerCase();
    const vendite = parseInt(venditeInput.value, 10);

    if (nomeOriginale === '' || isNaN(vendite) || vendite < 0) {
        alert('Per favore, inserisci dati validi.');
        return;
    }

    // Invia i dati al backend
    await fetch('http://localhost:3000/utente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, vendite })
    });

    // Recupera tutti gli utenti
    const response = await fetch('http://localhost:3000/utenti');
    const utenti = await response.json();

    // Ricostruisci la tabella
    const tbody = document.getElementById('risultatiTable').querySelector('tbody');
    tbody.innerHTML = '';

    utenti.forEach(user => {
        const vendite = user.vendite;
        const vapeGratis = Math.floor(vendite / 10);
        const venditeMancanti = (10 - (vendite % 10)) % 10;

        const riga = document.createElement('tr');

        const cellNome = document.createElement('td');
        cellNome.textContent = user.nome;
        riga.appendChild(cellNome);

        const cellVendite = document.createElement('td');
        cellVendite.textContent = vendite;
        riga.appendChild(cellVendite);

        const cellPagamento = document.createElement('td');
        cellPagamento.textContent = user.pagamento.toFixed(2);
        riga.appendChild(cellPagamento);

        const cellVape = document.createElement('td');
        cellVape.textContent = vapeGratis;
        riga.appendChild(cellVape);

        const cellMancanti = document.createElement('td');
        cellMancanti.textContent = venditeMancanti;
        riga.appendChild(cellMancanti);

        tbody.appendChild(riga);
    });

    document.getElementById('venditeForm').reset();
});