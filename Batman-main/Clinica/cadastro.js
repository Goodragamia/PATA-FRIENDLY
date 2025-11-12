

var usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

document.getElementById('form-cadastro').addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    
    var Lista_nome = document.getElementById('nome').value;
    var Lista_email = document.getElementById('emailC').value;  
    var Lista_senha = document.getElementById('senhaC').value;
    var Lista_cargo = document.getElementById('cargo').value; 
  

    const usuarioExistente = usuarios.find(usuario => usuario.email === Lista_email);
    if (usuarioExistente) {
        alert('Usuário já cadastrado!');
    } else {
        usuarios.push({ email: Lista_email, senha: Lista_senha, cargo: Lista_cargo, nome: Lista_nome });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Usuário cadastrado com sucesso!');
        document.getElementById('form-cadastro').reset();
    }
});


