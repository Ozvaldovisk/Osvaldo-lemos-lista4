const selectUsuario = document.getElementById('selectUsuario');
const listaPosts = document.getElementById('listaPosts');
const nomeAutor = document.getElementById('nomeAutor');
const containerPosts = document.getElementById('containerPosts');

const detalhesPost = document.getElementById('detalhesPost');
const tituloDetalhe = document.getElementById('tituloDetalhe');
const corpoPost = document.getElementById('corpoPost');
const containerComentarios = document.getElementById('containerComentarios');

const API_BASE = 'https://jsonplaceholder.typicode.com';

async function carregarUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const usuarios = await response.json();

        selectUsuario.innerHTML = '<option value="">Selecione um autor...</option>';

        usuarios.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            option.dataset.nome = user.name; 
            selectUsuario.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        selectUsuario.innerHTML = '<option value="">Erro ao carregar dados</option>';
    }
}

selectUsuario.addEventListener('change', async (e) => {
    const userId = e.target.value;
    const autorSelecionado = e.target.options[e.target.selectedIndex].dataset.nome;

    detalhesPost.style.display = 'none'; 

    if (!userId) {
        listaPosts.style.display = 'none';
        return;
    }

    nomeAutor.textContent = autorSelecionado;
    containerPosts.innerHTML = 'Carregando postagens...';
    listaPosts.style.display = 'block';

    try {
        const response = await fetch(`${API_BASE}/posts?userId=${userId}`);
        const posts = await response.json();

        containerPosts.innerHTML = ''; 

        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post-item';
            div.innerHTML = `<span class="post-title">${post.title}</span>`;

            div.addEventListener('click', () => carregarDetalhesPost(post.id));
            
            containerPosts.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        containerPosts.innerHTML = 'Erro ao carregar postagens.';
    }
});

async function carregarDetalhesPost(postId) {
    detalhesPost.style.display = 'block';
    tituloDetalhe.textContent = 'Carregando postagem...';
    corpoPost.textContent = '';
    containerComentarios.innerHTML = 'Carregando comentários...';

    try {
        const [postResponse, commentsResponse] = await Promise.all([
            fetch(`${API_BASE}/posts/${postId}`),
            fetch(`${API_BASE}/posts/${postId}/comments`)
        ]);

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();

        tituloDetalhe.textContent = postData.title;
        corpoPost.textContent = postData.body;

        containerComentarios.innerHTML = ''; 

        if (commentsData.length === 0) {
            containerComentarios.innerHTML = '<p>Nenhum comentário nesta postagem.</p>';
        } else {
            commentsData.forEach(comment => {
                const div = document.createElement('div');
                div.className = 'comentario';
                div.innerHTML = `
                    <strong>${comment.name} (${comment.email})</strong>
                    <p>${comment.body}</p>
                `;
                containerComentarios.appendChild(div);
            });
        }

        detalhesPost.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        tituloDetalhe.textContent = 'Erro';
        corpoPost.textContent = 'Não foi possível carregar os detalhes da postagem.';
        containerComentarios.innerHTML = '';
    }
}

carregarUsuarios();