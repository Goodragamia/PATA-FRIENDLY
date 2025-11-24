document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();


    var emailUsuario = document.getElementById('email').value;
    var senhaUsuario = document.getElementById('senha').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = usuarios.find(usuario => usuario.email === emailUsuario && usuario.senha === senhaUsuario);

    if (usuario) {
        alert('Login feito com sucesso');
        
        switch(usuario.cargo) {
            case 'funcionario':
                window.location.href = "perfilFuncionario.html";
                break;
            case 'administrador':
                window.location.href = "perfilAdministrador.html";
                break;
            case 'presidente':
                window.location.href = "perfilPresidente.html";
                break;
            default:
                alert('Cargo desconhecido!');
                break;
        }
    } else {
        alert('Email ou senha incorretos');
    }


    document.getElementById('form-login').reset();
});
 


