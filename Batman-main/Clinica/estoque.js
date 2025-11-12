
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




const form = document.querySelector('form');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const searchResults = document.querySelector('#searchResults');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Obter o valor do campo de entrada
  const query = searchInput.value;
  
  // Enviar a solicitação para o servidor
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/search?q=${query}`, true);
  
  xhr.onload = function() {
    if (this.status === 200) {
      const results = JSON.parse(this.responseText);
      
      // Limpar os resultados anteriores
      searchResults.innerHTML = '';
      
      // Exibir os novos resultados
      results.forEach(function(result) {
        const div = document.createElement('div');
        div.innerHTML = `<h2>${result.title}</h2><p>${result.description}</p>`;
        searchResults.appendChild(div);
      });
    }
  }
  
  xhr.send();
});

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/search', function(req, res) {
  const query = req.query.q;
  
  // Gerar resultados aleatórios
  const results = [
    {
      title: 'Result 1',
      description: 'Description of result 1.'
    },
    {
      title: 'Result 2',
      description: 'Description of result 2.'
    },
    {
      title: 'Result 3',
      description: 'Description of result 3.'
    }
  ];

  // Filtrar resultados por consulta
  const filteredResults = results.filter(function(result) {
    return result.title.toLowerCase().includes(query.toLowerCase()) || result.description.toLowerCase().includes(query.toLowerCase());
  });

  res.json(filteredResults);
});

app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});