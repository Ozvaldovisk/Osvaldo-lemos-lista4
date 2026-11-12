const selectEstado = document.getElementById('selectEstado');
const selectCidade = document.getElementById('selectCidade');
const pResultado = document.getElementById('resultado');

async function carregarEstados() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await response.json();

        selectEstado.innerHTML = '<option value="">Selecione um estado...</option>';

        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla; 
            option.textContent = estado.nome;
            selectEstado.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar estados:', error);
        selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>';
    }
}

selectEstado.addEventListener('change', async (event) => {
    const ufSelecionada = event.target.value;

    pResultado.textContent = '';

    if (!ufSelecionada) {
        selectCidade.innerHTML = '<option value="">Selecione um estado primeiro</option>';
        selectCidade.disabled = true;
        return;
    }

    selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';
    selectCidade.disabled = true;

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios`);
        const cidades = await response.json();

        selectCidade.innerHTML = '<option value="">Selecione uma cidade...</option>';

        cidades.forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade.nome; 
            option.textContent = cidade.nome;
            selectCidade.appendChild(option);
        });

        selectCidade.disabled = false;

    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
    }
});

selectCidade.addEventListener('change', () => {
    const cidadeSelecionada = selectCidade.value;
    const estadoSelecionado = selectEstado.options[selectEstado.selectedIndex].text;

    if (cidadeSelecionada) {
        pResultado.innerHTML = `<strong>Você selecionou:</strong> ${cidadeSelecionada} - ${estadoSelecionado}`;
    } else {
        pResultado.textContent = '';
    }
});

carregarEstados();