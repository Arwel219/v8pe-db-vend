// Inserisci le tue credenziali
const supabaseUrl = 'https://cynshbqlpgghjgwltukp.supabase.co'; // trova nella dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8'; // key pubblica
const supabaseClient  = supabase.createClient(supabaseUrl, supabaseKey);

async function salvaUtente(nome, vendite) {
  // Verifica se l'utente esiste
  const { data: existingUser, error } = await supabase
    .from('utenti')
    .select('*')
    .eq('nome', nome)
    .single();

  if (error && error.code !== 'PGRST116') {
    // errore diverso da "record non trovato"
    console.error(error);
    return;
  }

  const pagamento = vendite * 2;

  if (existingUser) {
    // Aggiorna
    const nuoveVendite = existingUser.vendite + vendite;
    await supabase
      .from('utenti')
      .update({ vendite: nuoveVendite, pagamento: nuoveVendite * 2 })
      .eq('nome', nome);
  } else {
    // Inserisci nuovo
    await supabase
      .from('utenti')
      .insert([{ nome, vendite, pagamento }]);
  }
}

async function ottieniUtenti() {
  const { data, error } = await supabase
    .from('utenti')
    .select('*');

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

document.getElementById('venditeForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nomeOriginale = document.getElementById('nome').value.trim();
  const nome = nomeOriginale.toLowerCase();
  const vendite = parseInt(document.getElementById('vendite').value, 10);

  if (nomeOriginale === '' || isNaN(vendite) || vendite < 0) {
    alert('Per favore, inserisci dati validi.');
    return;
  }

  await salvaUtente(nome, vendite);
  const utenti = await ottieniUtenti();

  // Ricostruisci la tabella come prima
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
