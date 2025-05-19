import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://cynshbqlpgghjgwltukp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8')

console.log('Supabase Instance: ', supabase)

// Funzione per recuperare tutti gli utenti da Supabase e aggiornare la tabella
async function aggiornaTabella() {
  const { data: utenti, error } = await supabase
    .from('utenti')
    .select('*');

  if (error) {
    console.error('Errore nel recupero dati:', error);
    return;
  }

  const tbody = document.getElementById('risultatiTable').querySelector('tbody');
  tbody.innerHTML = '';

  utenti.forEach(user => {
    // Calcolo vape gratis e vendite mancanti
    const vapeGratis = Math.floor(user.vendite / 10);
    const venditeMancanti = (10 - (user.vendite % 10)) % 10;

    const riga = document.createElement('tr');

    const cellNome = document.createElement('td');
    cellNome.textContent = user.nomeOriginale;
    riga.appendChild(cellNome);

    const cellVendite = document.createElement('td');
    cellVendite.textContent = user.vendite;
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
}

// Gestione del submit del form
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

  // Verifica se l'utente esiste già
  const { data: existingUsers, error: errorFetch } = await supabase
    .from('utenti')
    .select('*')
    .eq('nome', nome);

  if (errorFetch) {
    console.error('Errore nel fetch:', errorFetch);
    return;
  }

  if (existingUsers.length > 0) {
    // Aggiorna le vendite e il pagamento
    const userId = existingUsers[0].id;
    const nuoveVendite = existingUsers[0].vendite + vendite;
    const nuovoPagamento = nuoveVendite * 2;

    const { error: errorUpdate } = await supabase
      .from('utenti')
      .update({
        vendite: nuoveVendite,
        pagamento: nuovoPagamento
      })
      .eq('id', userId);

    if (errorUpdate) {
      console.error('Errore nell\'update:', errorUpdate);
      return;
    }
  } else {
    // Inserisci nuovo utente
    const { data: insertData, error: insertError } = await supabase
    .from('utenti')
    .insert([{
      nome: nome,
      nomeOriginale: nomeOriginale,
      vendite: vendite,
      pagamento: vendite * 2
    }]);
  
  if (insertError) {
    console.error('Errore durante insert:', insertError);
  } else {
    console.log('Dati inseriti:', insertData);
  }

  // Aggiorna la tabella visualizzata
  await aggiornaTabella();

  // Reset del form
  document.getElementById('venditeForm').reset();
});

// Inizializza la tabella al caricamento
window.onload = aggiornaTabella;
