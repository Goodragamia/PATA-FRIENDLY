
const listaPaciente = JSON.parse(localStorage.getItem('paciente')) || [];

function atualizarLista() {
  const listaElement = document.getElementById('lista-paciente');
  if (!listaElement) return;
  listaElement.innerHTML = '';

  listaPaciente.forEach((item, idx) => {
    const li = document.createElement('li');
    const texto = `${item.nome} - Tipo de consulta: ${item.consulta}`
      + (item.responsavel ? ` - Responsável: ${item.responsavel.nome}` : '')
      + (item.finalizado ? ' (Finalizado)' : '');
    li.textContent = texto;

    const btnFinalizar = document.createElement('button');
    btnFinalizar.type = 'button';
    btnFinalizar.textContent = item.finalizado ? 'Reabrir' : 'Finalizar';
    btnFinalizar.style.marginLeft = '8px';
    btnFinalizar.addEventListener('click', function() {
      const i = listaPaciente.findIndex(p => p.id && item.id ? p.id === item.id : p === item);
      if (i === -1) return;
      listaPaciente[i].finalizado = !listaPaciente[i].finalizado;
      localStorage.setItem('paciente', JSON.stringify(listaPaciente));
      atualizarLista();
    });

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.marginLeft = '8px';
    btnExcluir.addEventListener('click', function() {
      if (!confirm(`Excluir agendamento de ${item.nome}?`)) return;
      const i = listaPaciente.findIndex(p => p.id && item.id ? p.id === item.id : p === item);
      if (i === -1) return;
      listaPaciente.splice(i, 1);
      localStorage.setItem('paciente', JSON.stringify(listaPaciente));
      atualizarLista();
    });

    li.appendChild(btnFinalizar);
    li.appendChild(btnExcluir);
    listaElement.appendChild(li);
  });
}

// popula select de responsáveis com usuários (funcionários e administradores)
function carregarResponsaveis() {
  const listaFuncionarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const select = document.getElementById('responsavel');
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>Selecione o responsável</option>';

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const filtrados = usuarios.filter(u => u.cargo === 'funcionario' || u.cargo === 'administrador');

  if (filtrados.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Nenhum funcionário/administrador cadastrado';
    opt.disabled = true;
    select.appendChild(opt);
    return;
  }

  filtrados.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.nome;
    opt.textContent = `${u.nome} — ${u.cargo}`;
    opt.dataset.cargo = u.cargo;
    select.appendChild(opt);
  });
}

function adicionarPaciente() {
  const nomePaciente = document.getElementById('paciente').value.trim();
  const tipoConsulta = document.getElementById('consulta').value;
  const selectResp = document.getElementById('responsavel');
  const responsavelSelecionado = selectResp && selectResp.value ? selectResp.options[selectResp.selectedIndex] : null;

  if (nomePaciente === '' || !tipoConsulta) {
  alert('Por favor, insira o nome do paciente e selecione o tipo de consulta.');
  return;
  }

  if (!responsavelSelecionado) {
    alert('Por favor, selecione o funcionário ou administrador responsável.');
    return;
  }

  listaPaciente.push({ 
    id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
    nome: nomePaciente, 
    consulta: tipoConsulta, 
    finalizado: false,
    responsavel: {
      nome: responsavelSelecionado.value,
      cargo: responsavelSelecionado.dataset.cargo || ''
    }
  });
  localStorage.setItem('paciente', JSON.stringify(listaPaciente));
  atualizarLista();
  document.getElementById('form-estoque').reset();
}

document.getElementById('adicionar').addEventListener('click', adicionarPaciente);
document.getElementById('adicionar').addEventListener('click', adicionarPaciente);
document.addEventListener('DOMContentLoaded', atualizarLista);
document.addEventListener('DOMContentLoaded', carregarResponsaveis);

// também executar imediatamente (caso o script seja carregado no final da página)
try { atualizarLista(); } catch (e) {}
try { carregarResponsaveis(); } catch (e) {}





// --- Busca client-side (adicionada) ---
const buscaForm = document.getElementById('form-busca');
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