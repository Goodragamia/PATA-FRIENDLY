
const listaPaciente = JSON.parse(localStorage.getItem('paciente')) || [];

function atualizarLista() {
  const listaElement = document.getElementById('lista-paciente');
  if (!listaElement) return;
  listaElement.innerHTML = '';

  listaPaciente.forEach((item, idx) => {
    const li = document.createElement('li');
    const texto = `${item.nome} - Tipo de consulta: ${item.consulta}` + (item.finalizado ? ' (Finalizado)' : '');
    li.textContent = texto;

    const btnFinalizar = document.createElement('button');
    btnFinalizar.type = 'button';
    btnFinalizar.textContent = item.finalizado ? 'Reabrir' : 'Finalizar';
    btnFinalizar.style.marginLeft = '8px';
    btnFinalizar.addEventListener('click', function() {
      listaPaciente[idx].finalizado = !listaPaciente[idx].finalizado;
      localStorage.setItem('paciente', JSON.stringify(listaPaciente));
      atualizarLista();
    });

    li.appendChild(btnFinalizar);
    listaElement.appendChild(li);
  });
}

function adicionarPaciente() {
  const nomePaciente = document.getElementById('paciente').value.trim();
  const tipoConsulta = document.getElementById('consulta').value;

  if (nomePaciente === '' || !tipoConsulta) {
  alert('Por favor, insira o nome do paciente e selecione o tipo de consulta.');
  return;
  }

  listaPaciente.push({ nome: nomePaciente, consulta: tipoConsulta, finalizado: false });
  localStorage.setItem('paciente', JSON.stringify(listaPaciente));
  atualizarLista();
  document.getElementById('form-estoque').reset();
}

document.getElementById('adicionar').addEventListener('click', adicionarPaciente);
document.addEventListener('DOMContentLoaded', atualizarLista);





// --- Busca client-side (adicionada) ---
const buscaForm = document.querySelector('form');
const searchInput = document.querySelector('#searchInput');
const searchResults = document.querySelector('#searchResults');

if (buscaForm && searchInput && searchResults) {
  buscaForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query === '') {
      searchResults.textContent = 'Digite um nome para buscar.';
      return;
    }

    const resultados = listaPaciente.filter(p => p.nome.toLowerCase().includes(query));

    if (resultados.length === 0) {
      searchResults.textContent = 'Nenhum agendamento encontrado.';
      return;
    }

    const ul = document.createElement('ul');
    resultados.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nome} — ${item.consulta}`;
      ul.appendChild(li);
    });
    searchResults.appendChild(ul);
  });
}