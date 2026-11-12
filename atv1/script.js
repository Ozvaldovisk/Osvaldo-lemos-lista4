const inputCep = document.getElementById('cepInput');
const btnBuscar = document.getElementById('btnBuscar');
const divResultado = document.getElementById('resultado');


btnBuscar.addEventListener('click', buscarCep);

async function buscarCep() {
    
    divResultado.style.display = 'block';
    divResultado.innerHTML = '';
    
    const cep = inputCep.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        divResultado.innerHTML = '<p class="erro">Erro: CEP inválido. Digite 8 números.</p>';
        return;
    }

    try {
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        
        const data = await response.json();

        if (data.erro) {
            divResultado.innerHTML = '<p class="erro">Erro: CEP não encontrado.</p>';
            return;
        }

        divResultado.innerHTML = `
            <h3>Endereço encontrado:</h3>
            <p><strong>Rua:</strong> ${data.logradouro}</p>
            <p><strong>Bairro:</strong> ${data.bairro}</p>
            <p><strong>Cidade:</strong> ${data.localidade}</p>
            <p><strong>Estado:</strong> ${data.uf}</p>
        `;

    } catch (error) {
        
        console.error(error);
        divResultado.innerHTML = '<p class="erro">Erro ao buscar o endereço. Verifique sua conexão.</p>';
    }
}