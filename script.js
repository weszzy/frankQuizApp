let currentQuestion = 1;
let totalQuestions = 5;
let frankOceanSongs = [];

// Carregar músicas do arquivo JSON
fetch('songs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        frankOceanSongs = data;
        console.log('Músicas carregadas:', data);
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));


function nextQuestion() {
    const currentCard = document.getElementById(`question${currentQuestion}`);
    const nextCard = document.getElementById(`question${currentQuestion + 1}`);

    if (nextCard) {
        currentCard.style.display = 'none';
        nextCard.style.display = 'block';
        currentQuestion++;
        updateProgressBar();
    }

    // Alterar o texto e a ação do botão "Próximo" para "Enviar" na última pergunta
    if (currentQuestion === totalQuestions) {
        document.getElementById('nextButton').innerText = 'Enviar';
        document.getElementById('nextButton').setAttribute('onclick', 'submitQuiz()');
    } else {
        document.getElementById('nextButton').innerText = 'Próximo';
        document.getElementById('nextButton').setAttribute('onclick', 'nextQuestion()');
    }

    document.getElementById('prevButton').disabled = false;
}

function prevQuestion() {
    const currentCard = document.getElementById(`question${currentQuestion}`);
    const prevCard = document.getElementById(`question${currentQuestion - 1}`);

    if (prevCard) {
        currentCard.style.display = 'none';
        prevCard.style.display = 'block';
        currentQuestion--;
        updateProgressBar();
    }

    if (currentQuestion === 1) {
        document.getElementById('prevButton').disabled = true;
    }

    // Restaurar o botão "Próximo" se não for a última pergunta
    if (currentQuestion < totalQuestions) {
        document.getElementById('nextButton').innerText = 'Próximo';
        document.getElementById('nextButton').setAttribute('onclick', 'nextQuestion()');
    }
}

function updateProgressBar() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

function submitQuiz() {
    if (frankOceanSongs.length === 0) {
        alert("As músicas ainda estão sendo carregadas. Por favor, aguarde.");
        return;
    }

    // Capturar os valores selecionados pelo usuário
    const memories = document.querySelector('input[name="memories"]:checked');
    const environment = document.querySelector('input[name="environment"]:checked');
    const change = document.querySelector('input[name="change"]:checked');
    const lovestyle = document.querySelector('input[name="lovestyle"]:checked');
    const emotionalProcessing = document.querySelector('input[name="emotionalProcessing"]:checked');

    // Verifique se todos os valores foram selecionados
    if (!memories || !environment || !change || !lovestyle|| !emotionalProcessing) {
        alert("Por favor, selecione todas as respostas antes de enviar.");
        return;
    }

    // Obter os valores dos inputs
    determineSong(memories.value, environment.value, change.value, lovestyle.value, emotionalProcessing.value);
}

function determineSong(memories, environment, change, lovestyle, emotionalProcessing) {
    let maxMatches = 0;
    let matchingSongs = [];

    frankOceanSongs.forEach(song => {
        let matches = 0;

        if (song.themes.memories === memories) matches++;
        if (song.themes.environment === environment) matches++;
        if (song.themes.change === change) matches++;
        if (song.themes.lovestyle === lovestyle) matches++;
        if (song.themes.lovestyle === emotionalProcessing) matches++;

        console.log(`Música: ${song.songTitle}, Matches: ${matches}`); // Log para verificar as correspondências

        if (matches > maxMatches) {
            maxMatches = matches;
            matchingSongs = [song];
        } else if (matches === maxMatches && matches > 0) {
            matchingSongs.push(song);
        }
    });

    console.log(`Músicas correspondentes: ${JSON.stringify(matchingSongs)}`); // Log para verificar as músicas correspondentes

    if (matchingSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingSongs.length);
        const selectedSong = matchingSongs[randomIndex];

        // Exibir o resultado
document.getElementById('quiz-container').style.display = 'none'; // Ocultar o quiz
document.getElementById('songTitle').innerText = selectedSong.songTitle;
document.getElementById('songDescription').innerText = selectedSong.songDescription;
document.getElementById('songQuote').innerText = selectedSong.songQuote;
document.getElementById('result').style.display = 'block'; // Mostrar a área de resultado
document.getElementById('retryButton').style.display = 'block'; // Mostrar o botão de "Refazer o Quiz"

    } else {
        console.error('Nenhuma música correspondente foi encontrada.');
        alert('Nenhuma música correspondente foi encontrada.'); // Alerta para o usuário
    }
}


function retryQuiz() {
    currentQuestion = 1;
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('retryButton').style.display = 'none';
    document.getElementById('question1').style.display = 'block';
    document.getElementById('question2').style.display = 'none';
    document.getElementById('question3').style.display = 'none';
    document.getElementById('question4').style.display = 'none';
    document.getElementById('question5').style.display = 'none';
    document.getElementById('prevButton').disabled = true;
    document.getElementById('nextButton').innerText = 'Próximo';
    document.getElementById('nextButton').setAttribute('onclick', 'nextQuestion()');
    updateProgressBar();
}
