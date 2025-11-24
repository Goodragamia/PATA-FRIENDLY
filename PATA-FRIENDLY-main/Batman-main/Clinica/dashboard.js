// Dashboard inteiramente produzido por IA afim de incrementar as funcionalidades do perfil do presidente






// Dashboard simples: lista de funcionários + estatísticas de agendamentos
(function(){
  function readJSON(key){
    try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; }
  }

  const usuarios = readJSON('usuarios');
  const pacientesAtivos = readJSON('paciente');
  const pacientesFinalizados = readJSON('paciente_finalizados');

  // combinar todas as consultas em um array para análise
  const allConsultas = [];
  pacientesAtivos.forEach(p => allConsultas.push(Object.assign({}, p)));
  pacientesFinalizados.forEach(p => allConsultas.push(Object.assign({}, p)));

  const responsaveis = usuarios.filter(u => u.cargo === 'funcionario' || u.cargo === 'administrador');

  const selectFiltro = document.getElementById('filtroResponsavel');
  const tabelaBody = document.querySelector('#tabela-funcionarios tbody');
  const resumoEl = document.getElementById('resumo');
  const btnAtualizar = document.getElementById('btnAtualizar');

  function resumoGeral(){
    const totalConsultas = allConsultas.length;
    const finalizados = allConsultas.filter(c => c.finalizado).length;
    const pendentes = totalConsultas - finalizados;
    const porTipo = {};
    allConsultas.forEach(c => { porTipo[c.consulta] = (porTipo[c.consulta]||0) + 1; });

    resumoEl.innerHTML = `
      <strong>Total de agendamentos:</strong> ${totalConsultas} &nbsp; 
      <strong>Finalizados:</strong> ${finalizados} &nbsp; 
      <strong>Pendentes:</strong> ${pendentes}
      <div style="margin-top:8px"><strong>Por tipo:</strong> ${Object.keys(porTipo).length? Object.entries(porTipo).map(([k,v])=>`${k}: ${v}`).join(' | '): '—'}</div>
    `;
  }

  function popularFiltro(){
    // limpar e inserir "Todos"
    selectFiltro.innerHTML = '<option value="">Todos</option>';
    responsaveis.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.nome;
      opt.textContent = `${r.nome} — ${r.cargo}`;
      selectFiltro.appendChild(opt);
    });
  }

  function montarTabela(filtro){
    tabelaBody.innerHTML = '';
    const lista = filtro ? responsaveis.filter(r => r.nome === filtro) : responsaveis;

    lista.forEach(r => {
      const row = document.createElement('tr');
      const assigned = allConsultas.filter(c => c.responsavel && c.responsavel.nome === r.nome);
      const total = assigned.length;
      const finalizados = assigned.filter(c => c.finalizado).length;
      const pendentes = total - finalizados;
      const porTipo = {};
      assigned.forEach(c => porTipo[c.consulta] = (porTipo[c.consulta]||0)+1);

      const tdNome = document.createElement('td'); tdNome.textContent = r.nome;
      const tdCargo = document.createElement('td'); tdCargo.textContent = r.cargo;
      const tdTotal = document.createElement('td'); tdTotal.textContent = total;
      const tdFin = document.createElement('td'); tdFin.textContent = finalizados;
      const tdPend = document.createElement('td'); tdPend.textContent = pendentes;
      const tdTipo = document.createElement('td'); tdTipo.textContent = Object.keys(porTipo).length ? Object.entries(porTipo).map(([k,v])=>`${k}: ${v}`).join(', ') : '-';

      const tdAcoes = document.createElement('td');
      const btnVer = document.createElement('button'); btnVer.type='button'; btnVer.textContent='Ver agend.'; btnVer.addEventListener('click', ()=>{ mostrarAgendamentosDoResponsavel(r.nome); });
      tdAcoes.appendChild(btnVer);

      row.appendChild(tdNome); row.appendChild(tdCargo); row.appendChild(tdTotal);
      row.appendChild(tdFin); row.appendChild(tdPend); row.appendChild(tdTipo); row.appendChild(tdAcoes);
      tabelaBody.appendChild(row);
    });
  }

  function mostrarAgendamentosDoResponsavel(nome){
    const modalId = 'painel-agendamentos';
    let painel = document.getElementById(modalId);
    if (!painel){
      painel = document.createElement('div');
      painel.id = modalId;
      painel.style.position='fixed'; painel.style.right='20px'; painel.style.top='20px'; painel.style.background='white'; painel.style.border='1px solid #ccc'; painel.style.padding='12px'; painel.style.maxHeight='70vh'; painel.style.overflow='auto'; painel.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';
      const btnClose = document.createElement('button'); btnClose.textContent='Fechar'; btnClose.style.float='right'; btnClose.addEventListener('click', ()=> painel.remove());
      painel.appendChild(btnClose);
      const titulo = document.createElement('h3'); titulo.style.marginTop='0'; painel.appendChild(titulo);
      const list = document.createElement('div'); list.id = modalId+'-list'; painel.appendChild(list);
      document.body.appendChild(painel);
    }
    painel.querySelector('h3').textContent = `Agendamentos de ${nome}`;
    const list = painel.querySelector('#'+modalId+'-list');
    list.innerHTML = '';
    const assigned = allConsultas.filter(c => c.responsavel && c.responsavel.nome === nome);
    if (assigned.length === 0) { list.textContent = 'Nenhum agendamento.'; return; }
    const ul = document.createElement('ul');
    assigned.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `${a.nome} — ${a.consulta} ${a.finalizado ? '(Finalizado)' : ''}`;
      ul.appendChild(li);
    });
    list.appendChild(ul);
  }

  // inicialização
  popularFiltro();
  resumoGeral();
  montarTabela();

  selectFiltro.addEventListener('change', ()=> montarTabela(selectFiltro.value));
  btnAtualizar.addEventListener('click', ()=> location.reload());
  
  // exportar CSV de todas consultas
  const btnExport = document.getElementById('btnExportCSV');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const rows = [['nome','consulta','responsavel_nome','responsavel_cargo','finalizado','id']];
      allConsultas.forEach(c => {
        rows.push([
          `"${(c.nome||'').replace(/"/g,'""')}"`,
          c.consulta || '',
          c.responsavel ? `"${(c.responsavel.nome||'').replace(/"/g,'""')}"` : '',
          c.responsavel ? c.responsavel.cargo || '' : '',
          c.finalizado ? '1' : '0',
          c.id || ''
        ]);
      });
      const csv = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agendamentos.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
})();