
const listaEstoque = JSON.parse(localStorage.getItem('estoque')) || [];
function atualizarLista() {
    const listaElement = document.getElementById('lista-estoque');
    listaElement.innerHTML = ''; 

    listaEstoque.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - Quantidade: ${item.quantidade}`;
        listaElement.appendChild(li);
    });
}

function adicionarItem() {
    const nomeItem = document.getElementById('item').value.trim();
    const quantidadeItem = parseInt(document.getElementById('quantidade').value, 10);

    if (nomeItem === '' || isNaN(quantidadeItem) || quantidadeItem <= 0) {
        alert('Por favor, insira um nome e uma quantidade válida.');
        return;
    }

    const itemExistente = listaEstoque.find(item => item.nome === nomeItem);
    if (itemExistente) {
        itemExistente.quantidade += quantidadeItem;
    } else {
        listaEstoque.push({ nome: nomeItem, quantidade: quantidadeItem });
    }

    
    localStorage.setItem('estoque', JSON.stringify(listaEstoque));
    atualizarLista();

   
    document.getElementById('form-estoque').reset();
}

function removerItem() {
    const nomeItem = document.getElementById('item').value.trim();
    const quantidadeItem = parseInt(document.getElementById('quantidade').value, 10);

    if (nomeItem === '' || isNaN(quantidadeItem) || quantidadeItem <= 0) {
        alert('Digite uma quantidade valida.');
        return;
    }

    const itemIndex = listaEstoque.findIndex(item => item.nome === nomeItem);
    if (itemIndex !== -1) {
        
        listaEstoque[itemIndex].quantidade -= quantidadeItem;

       
        if (listaEstoque[itemIndex].quantidade <= 0) {
            listaEstoque.splice(itemIndex, 1);
        }

        
        localStorage.setItem('estoque', JSON.stringify(listaEstoque));
        atualizarLista();
    } else {
        alert('Item não encontrado no estoque.');
    }

    
    document.getElementById('form-estoque').reset();
}


document.getElementById('adicionar').addEventListener('click', adicionarItem);
document.getElementById('remover').addEventListener('click', removerItem);


document.addEventListener('DOMContentLoaded', atualizarLista);