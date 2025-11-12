
function atualizarLista() {
    const listaElement = document.getElementById('lista-funcionarios');
    listaElement.innerHTML = ''; 

    
    const listaFuncionarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (listaFuncionarios.length === 0) {
        listaElement.innerHTML = '<li>Nenhum funcionário cadastrado.</li>';
        return;
    }

    
    listaFuncionarios.forEach(funcionario => {
        const li = document.createElement('li');
        li.textContent = `${funcionario.nome} - Cargo: ${funcionario.cargo}`;
        listaElement.appendChild(li);
    });
}


function demitirFuncionario() {
    const nomeFuncionario = document.getElementById('nome').value.trim();

    if (nomeFuncionario === '') {
        alert('Por favor, insira o nome do funcionário a ser demitido.');
        return;
    }

    
    const listaFuncionarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    
    const funcionarioIndex = listaFuncionarios.findIndex(funcionario => funcionario.nome === nomeFuncionario);

    if (funcionarioIndex === -1) {
        alert('Funcionário não encontrado.');
        return;
    }

    
    const funcionarioCargo = listaFuncionarios[funcionarioIndex].cargo;
    if (funcionarioCargo === 'presidente') {
        alert('Não é possível demitir um presidente.');
        return;
    }

    
    listaFuncionarios.splice(funcionarioIndex, 1);

   
    localStorage.setItem('usuarios', JSON.stringify(listaFuncionarios));
    atualizarLista();

    
    document.getElementById('form-funcionarios').reset();
}


document.getElementById('demitir').addEventListener('click', demitirFuncionario);


document.addEventListener('DOMContentLoaded', atualizarLista);
