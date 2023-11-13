// ADICIONANDO NO SESSION O JSON JÁ NORMALIZADO
fetch('./json/dados-analise.json')
  .then(response => response.json())
  .then(data => {

    // console.log(data.map(objeto => objeto.RESPONSAVEL));
    // console.log(data.filter(objeto => objeto.RESPONSAVEL === 'OHLAVRAC RASEC'));
    
    const normalizandoNomesInverso = data;

    // console.log(new Set(data.map(objeto => objeto.SUPERVISOR)));

    const verificaDataLocale = sessionStorage.getItem('incode2099');
    if (!verificaDataLocale) {
      const stringData = JSON.stringify(normalizandoNomesInverso);
      sessionStorage.setItem('incode2099', stringData);

      const data = sessionStorage.getItem('incode2099');
      const jsonData = JSON.parse(data);
      aplicandoDadosSite(jsonData);
    }
});


// APLICANDO OS DADOS NA TELA ***********************************************************
function aplicandoDadosSite(data) {
  // DOM - BOX NUMEROS ABSOLUTOS
  const totalTarefas = [], totalAtividades = [], totalLideres = [], totalSistemas = [], totalSupervisores = [], totalRecurso = [], totalTitulo = [], totalModulo = [];

  for (let index in data) {
    if (!totalTarefas.includes(data[index].TAREFA)) {
      totalTarefas.push(data[index].TAREFA);
    }

    if (!totalAtividades.includes(data[index].ATIVIDADE)) {
      totalAtividades.push(data[index].ATIVIDADE);
    }

    if (!totalLideres.includes(data[index].RESPONSAVEL)) {
      totalLideres.push(data[index].RESPONSAVEL);
    }

    if (!totalSistemas.includes(data[index].SISTEMA)) {
      totalSistemas.push(data[index].SISTEMA);
    }

    if (!totalSupervisores.includes(data[index].SUPERVISOR)) {
      totalSupervisores.push(data[index].SUPERVISOR);
    }

    if (!totalRecurso.includes(data[index].RECURSO)) {
      totalRecurso.push(data[index].RECURSO);
    }

    if (!totalTitulo.includes(data[index].TITULO)) {
      totalTitulo.push(data[index].TITULO);
    }

    if (!totalModulo.includes(data[index].MODULO)) {
      totalModulo.push(data[index].MODULO);
    }
  }

  const totalBoxGeral = {
    'TAREFAS': totalTarefas.length,
    'ATIVIDADES': totalAtividades.length,
    'LIDERES': totalLideres.length,
    'SISTEMAS': totalSistemas.length,
    'SUPERVISORES': totalSupervisores.length,
  };

  const contadores = [0, 0, 0, 0, 0];
  const chavesBoxGeral = ['TAREFAS', 'ATIVIDADES', 'LIDERES', 'SISTEMAS', 'SUPERVISORES'];

  const arrayTotalBoxGeral = Object.entries(totalBoxGeral);

  arrayTotalBoxGeral.forEach(function(array, index) {
    const intervalo = setInterval(function() {
      document.querySelector(`.box-valores${index + 1} h3`).textContent = contadores[index];
      contadores[index] += 1;

      if (contadores[index] > totalBoxGeral[chavesBoxGeral[index]]) {
        clearInterval(intervalo);
      }
    }, 6);
  });


  // DOM - TEREFAS POR LÍDER DE EQUIPE
  const liderNaoDuplicado = [];

  for (let index in data) {
    if (!liderNaoDuplicado.includes(data[index].RESPONSAVEL)) {
      liderNaoDuplicado.push(data[index].RESPONSAVEL);
    }
  }

  const objetoQuantidadeTarefaLider = {};

  for (let lider of liderNaoDuplicado) {
    const terefasNaoDuplicado = [];

    for (let index in data) {
      if (data[index].RESPONSAVEL === lider) {
        if (!terefasNaoDuplicado.includes(data[index].TAREFA)) {
          terefasNaoDuplicado.push(data[index].TAREFA);
        }
      }
    }

    objetoQuantidadeTarefaLider[lider] = terefasNaoDuplicado.length;
  }

  const arrayQuantidadeTarefasPorLider = Object.entries(objetoQuantidadeTarefaLider);

  arrayQuantidadeTarefasPorLider.sort(function(a, b) {
    return b[1] - a[1];
  });

  // console.log(arrayQuantidadeTarefasPorLider);

  let porcentagemBarra = 1;

  for (const array of arrayQuantidadeTarefasPorLider) {
    const divBarra = document.createElement('div');
    divBarra.classList.add('barra');

    const divSubBarra = document.createElement('div');
    divSubBarra.classList.add('sub-barra', `barra${porcentagemBarra++}`);
    divSubBarra.setAttribute('name', array[0]);
    divSubBarra.setAttribute('tipo', 'TAREFA');
    divSubBarra.setAttribute('categoria', 'RESPONSAVEL');

    const divLegendaBalao = document.createElement('div');
    divLegendaBalao.classList.add('legenda-balao');
    divLegendaBalao.textContent = array[1];
    const divTagG = document.createElement('div');
    divTagG.classList.add('tag-g', 'teste-balao');
    divTagG.textContent = array[1];
    const divLegenda = document.createElement('div');
    divLegenda.classList.add('tag-legenda');
    divLegenda.textContent = array[0];

    divSubBarra.appendChild(divLegendaBalao);
    divSubBarra.appendChild(divTagG);
    divSubBarra.appendChild(divLegenda);

    divBarra.appendChild(divSubBarra);

    document.querySelector('.grafico-tarefa-lider').appendChild(divBarra);
  }

  for (let i = 1; i <= arrayQuantidadeTarefasPorLider.length; i++) {
    document.querySelector(`div.grafico-tarefa-lider .barra${i}`).style.height = `${(arrayQuantidadeTarefasPorLider[i - 1][1] / (arrayQuantidadeTarefasPorLider[0][1] / 100))}%`;
  }

  const allEscalaTarefaLider = document.querySelectorAll('.escala-tarefa-lider div');

  const porcentagemEscala = [100, 80, 60, 40, 20, 0];
  allEscalaTarefaLider.forEach(function(divEscala, index) {
    divEscala.textContent = Math.round((arrayQuantidadeTarefasPorLider[0][1] * (porcentagemEscala[index] / 100)));
  });


  // DOM - ATIVIDADES POR RESPONSAVEL
  const responsavelNaoDuplicado = [];

  for (let index in data) {
    if (!responsavelNaoDuplicado.includes(data[index].RESPONSAVEL)) {
      responsavelNaoDuplicado.push(data[index].RESPONSAVEL);
    }
  }

  const objetoQuantidadeAtividadeResponsavel = {};

  for (let responsavel of responsavelNaoDuplicado) {
    const atividadesNaoDuplicado = [];

    for (let index in data) {
      if (data[index].RESPONSAVEL === responsavel) {
        if (!atividadesNaoDuplicado.includes(data[index].ATIVIDADE)) {
          atividadesNaoDuplicado.push(data[index].ATIVIDADE);
        }
      }
    }

    objetoQuantidadeAtividadeResponsavel[responsavel] = atividadesNaoDuplicado.length;
  }

  const arrayQuantidadeAtividadesPorResponsavel = Object.entries(objetoQuantidadeAtividadeResponsavel);

  arrayQuantidadeAtividadesPorResponsavel.sort(function(a, b) {
    return b[1] - a[1];
  });

  // console.log(arrayQuantidadeAtividadesPorResponsavel);

  porcentagemBarra = 1;

  for (const array of arrayQuantidadeAtividadesPorResponsavel) {
    const divBarra = document.createElement('div');
    divBarra.classList.add('barra');

    const divSubBarra = document.createElement('div');
    divSubBarra.classList.add('sub-barra', `barra${porcentagemBarra++}`);
    divSubBarra.setAttribute('name', array[0]);
    divSubBarra.setAttribute('tipo', 'ATIVIDADE');
    divSubBarra.setAttribute('categoria', 'RESPONSAVEL');

    const divLegendaBalao = document.createElement('div');
    divLegendaBalao.classList.add('legenda-balao');
    divLegendaBalao.textContent = array[1];
    const divTagG = document.createElement('div');
    divTagG.classList.add('tag-g', 'teste-balao');
    divTagG.textContent = array[1];
    const divLegenda = document.createElement('div');
    divLegenda.classList.add('tag-legenda');
    divLegenda.textContent = array[0];

    divSubBarra.appendChild(divLegendaBalao);
    divSubBarra.appendChild(divTagG);
    divSubBarra.appendChild(divLegenda);

    divBarra.appendChild(divSubBarra);

    document.querySelector('.grafico-atividade-responsavel').appendChild(divBarra);
  }

  for (let i = 1; i <= arrayQuantidadeAtividadesPorResponsavel.length; i++) {
    document.querySelector(`div.grafico-atividade-responsavel .barra${i}`).style.height = `${(arrayQuantidadeAtividadesPorResponsavel[i - 1][1] / (arrayQuantidadeAtividadesPorResponsavel[0][1] / 100))}%`;
  }

  const allEscalaAtividadeResponsavel = document.querySelectorAll('.escala-atividade-responsavel div');

  // const porcentagemEscala = [100, 80, 60, 40, 20, 0];
  allEscalaAtividadeResponsavel.forEach(function(divEscala, index) {
    divEscala.textContent = Math.round((arrayQuantidadeAtividadesPorResponsavel[0][1] * (porcentagemEscala[index] / 100)));
  });


  // DOM - ATIVIDADES POR SISTEMA
  const sistemaNaoDuplicado = [];

  for (let index in data) {
    if (!sistemaNaoDuplicado.includes(data[index].SISTEMA)) {
      sistemaNaoDuplicado.push(data[index].SISTEMA);
    }
  }

  const objetoQuantidadeAtividadeSistema = {};

  for (let sistema of sistemaNaoDuplicado) {
    const atividadesNaoDuplicado = [];

    for (let index in data) {
      if (data[index].SISTEMA === sistema) {
        if (!atividadesNaoDuplicado.includes(data[index].ATIVIDADE)) {
          atividadesNaoDuplicado.push(data[index].ATIVIDADE);
        }
      }
    }

    objetoQuantidadeAtividadeSistema[sistema] = atividadesNaoDuplicado.length;
  }

  const arrayQuantidadeAtividadesPorSistema = Object.entries(objetoQuantidadeAtividadeSistema);

  arrayQuantidadeAtividadesPorSistema.sort(function(a, b) {
    return b[1] - a[1];
  });

  // console.log(arrayQuantidadeAtividadesPorSistema);

  porcentagemBarra = 1;

  for (const array of arrayQuantidadeAtividadesPorSistema) {
    const divBarra = document.createElement('div');
    divBarra.classList.add('barra');

    const divSubBarra = document.createElement('div');
    divSubBarra.classList.add('sub-barra', `barra${porcentagemBarra++}`);
    divSubBarra.setAttribute('name', array[0]);
    divSubBarra.setAttribute('tipo', 'ATIVIDADE');
    divSubBarra.setAttribute('categoria', 'SISTEMA');

    const divLegendaBalao = document.createElement('div');
    divLegendaBalao.classList.add('legenda-balao');
    divLegendaBalao.textContent = array[1];
    const divTagG = document.createElement('div');
    divTagG.classList.add('tag-g', 'teste-balao');
    divTagG.textContent = array[1];
    const divLegenda = document.createElement('div');
    divLegenda.classList.add('tag-legenda');
    divLegenda.textContent = array[0];

    divSubBarra.appendChild(divLegendaBalao);
    divSubBarra.appendChild(divTagG);
    divSubBarra.appendChild(divLegenda);

    divBarra.appendChild(divSubBarra);

    if (array[0] === arrayQuantidadeAtividadesPorSistema[arrayQuantidadeAtividadesPorSistema.length - 1][0]) {
      divSubBarra.classList.add('ultima-barra-sistema');
    }

    document.querySelector('.grafico-atividade-sistema').appendChild(divBarra);
  }

  for (let i = 1; i <= arrayQuantidadeAtividadesPorSistema.length; i++) {
    document.querySelector(`div.grafico-atividade-sistema .barra${i}`).style.height = `${(arrayQuantidadeAtividadesPorSistema[i - 1][1] / (arrayQuantidadeAtividadesPorSistema[0][1] / 100))}%`;
  }

  const allEscalaAtividadeSistema = document.querySelectorAll('.escala-atividade-sistema div');

  // const porcentagemEscala = [100, 80, 60, 40, 20, 0];
  allEscalaAtividadeSistema.forEach(function(divEscala, index) {
    divEscala.textContent = Math.round((arrayQuantidadeAtividadesPorSistema[0][1] * (porcentagemEscala[index] / 100)));
  });

  document.querySelector('#btn-grafico-completo-sistema').style.display = 'none';
  const todasBarrasGraficoSistema = document.querySelectorAll('.grafico-atividade-sistema .barra');
  if (todasBarrasGraficoSistema.length > 7) {
    document.querySelector('#btn-grafico-completo-sistema').style.display = 'block';
  }

  // DOM - ATIVIDADES POR SUPERVISOR
  const supervisorNaoDuplicado = [];

  for (let index in data) {
    if (!supervisorNaoDuplicado.includes(data[index].SUPERVISOR)) {
      supervisorNaoDuplicado.push(data[index].SUPERVISOR);
    }
  }

  const objetoQuantidadeAtividadeSupervisor = {};

  for (let supervisor of supervisorNaoDuplicado) {
    const atividadesNaoDuplicado = [];

    for (let index in data) {
      if (data[index].SUPERVISOR === supervisor) {
        if (!atividadesNaoDuplicado.includes(data[index].ATIVIDADE)) {
          atividadesNaoDuplicado.push(data[index].ATIVIDADE);
        }
      }
    }

    objetoQuantidadeAtividadeSupervisor[supervisor] = atividadesNaoDuplicado.length;
  }

  // console.log(objetoQuantidadeAtividadeSupervisor);

  const arrayQuantidadeAtividadesPorSupervisor = Object.entries(objetoQuantidadeAtividadeSupervisor);

  arrayQuantidadeAtividadesPorSupervisor.sort(function(a, b) {
    return b[1] - a[1];
  });

  // console.log(arrayQuantidadeAtividadesPorSupervisor);

  porcentagemBarra = 1;

  for (const array of arrayQuantidadeAtividadesPorSupervisor) {
    const divBarra = document.createElement('div');
    divBarra.classList.add('barra');

    const divSubBarra = document.createElement('div');
    divSubBarra.classList.add('sub-barra', `barra${porcentagemBarra++}`);
    divSubBarra.setAttribute('name', array[0]);
    divSubBarra.setAttribute('tipo', 'ATIVIDADE');
    divSubBarra.setAttribute('categoria', 'SUPERVISOR');

    const divLegendaBalao = document.createElement('div');
    divLegendaBalao.classList.add('legenda-balao');
    divLegendaBalao.textContent = array[1];
    const divTagG = document.createElement('div');
    divTagG.classList.add('tag-g', 'teste-balao');
    divTagG.textContent = array[1];
    const divLegenda = document.createElement('div');
    divLegenda.classList.add('tag-legenda');
    divLegenda.textContent = array[0];

    divSubBarra.appendChild(divLegendaBalao);
    divSubBarra.appendChild(divTagG);
    divSubBarra.appendChild(divLegenda);

    divBarra.appendChild(divSubBarra);

    if (array[0] === arrayQuantidadeAtividadesPorSupervisor[arrayQuantidadeAtividadesPorSupervisor.length - 1][0]) {
      divSubBarra.classList.add('ultima-barra-supervisor');
    }

    document.querySelector('.grafico-atividade-supervisor').appendChild(divBarra);
  }

  for (let i = 1; i <= arrayQuantidadeAtividadesPorSupervisor.length; i++) {
    document.querySelector(`div.grafico-atividade-supervisor .barra${i}`).style.height = `${(arrayQuantidadeAtividadesPorSupervisor[i - 1][1] / (arrayQuantidadeAtividadesPorSupervisor[0][1] / 100))}%`;
  }

  const allEscalaAtividadeSupervisor = document.querySelectorAll('.escala-atividade-supervisor div');

  // const porcentagemEscala = [100, 80, 60, 40, 20, 0];
  allEscalaAtividadeSupervisor.forEach(function(divEscala, index) {
    divEscala.textContent = Math.round((arrayQuantidadeAtividadesPorSupervisor[0][1] * (porcentagemEscala[index] / 100)));
  });

  document.querySelector('#btn-grafico-completo-supervisor').style.display = 'none';
  const todasBarrasGraficoSupervisor = document.querySelectorAll('.grafico-atividade-supervisor .barra');
  if (todasBarrasGraficoSupervisor.length > 7) {
    document.querySelector('#btn-grafico-completo-supervisor').style.display = 'block';
  }

  // É AQUI PORRA QUE GERA TODOS OS MINI BARRINHA DO GRAFICO COMPLETO
  // DOM - DIV DETALHES GRAFICO COMPLETO
  const divContainerDadosGraficos = document.querySelector('.container-dados-graficos');
  const divGeralGraficoCompleto = document.querySelector('.container-grafico-efeito-fundo');
  const btnFecharGrafico = document.querySelector('#icon-fechar-grafico');
  const allBtnGraficoCompleto = document.querySelectorAll('.btn-grafico-completo');

  btnFecharGrafico.addEventListener('click', function() {
    divGeralGraficoCompleto.style.display = 'none';
    document.body.style.overflow = "auto";
    
    while (divContainerDadosGraficos.firstChild) {
      divContainerDadosGraficos.removeChild(divContainerDadosGraficos.firstChild);
    }
  });

  allBtnGraficoCompleto.forEach(function(element) {
    element.addEventListener('click', function(event) {
      divGeralGraficoCompleto.style.display = 'flex';
      document.body.style.overflow = "hidden";
      divGeralGraficoCompleto.style.top = `${window.scrollY}px`;

      while (divContainerDadosGraficos.firstChild) {
        divContainerDadosGraficos.removeChild(divContainerDadosGraficos.firstChild);
      }

      let contBarra = 1;
      if (event.target.name === 'sistema') {
        const titleDiv = document.querySelector('.container-title-and-btn-close h2');
        titleDiv.textContent = 'Atividades por Sistema';

        for (const array of arrayQuantidadeAtividadesPorSistema) {
          const divMiniBarra = document.createElement('div');
          divMiniBarra.classList.add('mini-barra');
          divMiniBarra.setAttribute('name', array[0]);
          divMiniBarra.setAttribute('tipo', 'ATIVIDADE');
          divMiniBarra.setAttribute('categoria', 'SISTEMA');
          
          const divTitleMiniBarra = document.createElement('div');
          divTitleMiniBarra.classList.add('title-mini-barra');
          divTitleMiniBarra.textContent = array[0];
          const divBarraPorcentagem = document.createElement('div');
          divBarraPorcentagem.classList.add('barra-porcentagem', `barra${contBarra++}`);
          divBarraPorcentagem.style.width = `${((array[1] / 100) * 100)}%`;
          const divValorPorcentagem = document.createElement('div');
          divValorPorcentagem.classList.add('valor-porcentagem');
          divValorPorcentagem.textContent = array[1];

          divMiniBarra.appendChild(divTitleMiniBarra);
          divMiniBarra.appendChild(divBarraPorcentagem);
          divMiniBarra.appendChild(divValorPorcentagem);

          divContainerDadosGraficos.appendChild(divMiniBarra);
        }
      } else if (event.target.name === 'supervisor') {
        const titleDiv = document.querySelector('.container-title-and-btn-close h2');
        titleDiv.textContent = 'Atividades por Supervisor';

        for (const array of arrayQuantidadeAtividadesPorSupervisor) {
          const divMiniBarra = document.createElement('div');
          divMiniBarra.classList.add('mini-barra');
          divMiniBarra.setAttribute('name', array[0]);
          divMiniBarra.setAttribute('tipo', 'ATIVIDADE');
          divMiniBarra.setAttribute('categoria', 'SUPERVISOR');
          
          const divTitleMiniBarra = document.createElement('div');
          divTitleMiniBarra.classList.add('title-mini-barra');
          divTitleMiniBarra.textContent = array[0];
          const divBarraPorcentagem = document.createElement('div');
          divBarraPorcentagem.classList.add('barra-porcentagem', `barra${contBarra++}`);
          divBarraPorcentagem.style.width = `${((array[1] / 100) * 100)}%`;
          const divValorPorcentagem = document.createElement('div');
          divValorPorcentagem.classList.add('valor-porcentagem');
          divValorPorcentagem.textContent = array[1];

          divMiniBarra.appendChild(divTitleMiniBarra);
          divMiniBarra.appendChild(divBarraPorcentagem);
          divMiniBarra.appendChild(divValorPorcentagem);

          divContainerDadosGraficos.appendChild(divMiniBarra);
        }
      }
    });
  });


  // DOM - DIV BOX VALORES AS CINCO CAIXAS TAREFAS, ATIVIDADES, LIDERES, SISTEMA, SUPER
  const divContainerDadosTabela = document.querySelector('.container-dados-tabela');
  const divGeralTabelaCompleto = document.querySelector('.container-tabela-efeito-fundo');
  const btnFecharTabela = document.querySelector('#icon-fechar-tabela');
  const allBoxValores = document.querySelectorAll('div.box-valores');

  btnFecharTabela.addEventListener('click', function() {
    divGeralTabelaCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    const tagTHeader = document.querySelector('thead');
    const tagTBody = document.querySelector('tbody');

    while (tagTHeader.firstChild) {
      tagTHeader.removeChild(tagTHeader.firstChild);
    }

    while (tagTBody.firstChild) {
      tagTBody.removeChild(tagTBody.firstChild);
    }
  });
  
  allBoxValores.forEach(function(element) {
    element.addEventListener('click', function(event) {
      event.stopPropagation();
      divGeralTabelaCompleto.style.display = 'flex';
      document.body.style.overflow = "hidden";
      divGeralTabelaCompleto.style.top = `${window.scrollY}px`;

      while (tagTHeader.firstChild) {
        tagTHeader.removeChild(tagTHeader.firstChild);
      }
  
      while (tagTBody.firstChild) {
        tagTBody.removeChild(tagTBody.firstChild);
      }

      if (element.getAttribute('name') === 'box-tarefa') {
        document.querySelector('.title-tabela').textContent = 'Quantidades por terafa isolada';
        const objetoJsonApenasTarefa = [];

        for (let tarefa of totalTarefas) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].TAREFA) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].TAREFA) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'TAREFA': data[index].TAREFA,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,
                // 'DTA_CADASTRAMENTO': data[index].DTA_CADASTRAMENTO,
                // 'SITUCAO_TAREFA': data[index].SITUCAO_TAREFA,
                // 'DTA_INICIO': data[index].DTA_INICIO,
                // 'DTA_FIM': data[index].DTA_FIM,
              }

              objetoJsonApenasTarefa.push(meuObjeto);
              break;
            }
          }
        }

        const arrayObjetoJsonApenasTarefa = objetoJsonApenasTarefa.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasTarefa.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        // console.log(arrayObjetoJsonApenasTarefa);

        arrayObjetoJsonApenasTarefa.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          } 
          
          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (element.getAttribute('name') === 'box-atividade') {
        document.querySelector('.title-tabela').textContent = 'Quantidades por atividade isolada';
        const objetoJsonApenasAtividade = [];

        for (let tarefa of totalAtividades) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].ATIVIDADE) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'ATIVIDADE': data[index].ATIVIDADE,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,

                // 'DTA_CADASTRAMENTO': data[index].DTA_CADASTRAMENTO,
                // 'SITUCAO_TAREFA': data[index].SITUCAO_TAREFA,
                // 'DTA_INICIO': data[index].DTA_INICIO,
                // 'DTA_FIM': data[index].DTA_FIM,
              }

              objetoJsonApenasAtividade.push(meuObjeto);
              break;
            }
          }
        }

        // console.log(objetoJsonApenasAtividade);

        const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasAtividade.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        // console.log(arrayObjetoJsonApenasAtividade[0]);

        arrayObjetoJsonApenasAtividade.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (element.getAttribute('name') === 'box-lider') {
        document.querySelector('.title-tabela').textContent = 'Quantidades por líder isolado';

        const todosLideres = Array.from(new Set(data.map(objeto => objeto.RESPONSAVEL))).sort();

        const chavesLider = ['TAREFA', 'ATIVIDADE', 'SUPERVISOR', 'RECURSO', 'SISTEMA', 'MODULO',];
        const arrayValoresLideres = [];

        for (let lider of todosLideres) {
          let arrayLimpo = [];
          for (let chave of chavesLider) {
            let nomeChave = chave;
            let quantidadeChave = Array.from(new Set((data.filter(objeto => objeto.RESPONSAVEL === lider)).map(objeto => objeto[chave]))).length;

            let array = [nomeChave, quantidadeChave];
            arrayLimpo.push(array);
          }

          arrayLimpo.unshift(['LIDER', lider]);

          arrayValoresLideres.push(arrayLimpo);
        }

        /* Adicionando na tabela */
        arrayValoresLideres.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (element.getAttribute('name') === 'box-sistema') {
        document.querySelector('.title-tabela').textContent = 'Quantidades por sistema isolado';
         
        const todosSitemas = Array.from(new Set(data.map(objeto => objeto.SISTEMA))).sort();

        /* Pegando quantidade por cada chave */
        const chavesSistema = ['TAREFA', 'ATIVIDADE', 'SUPERVISOR', 'RECURSO', 'SISTEMA', 'MODULO',];
        const arrayValoresSistema = [];

        for (let sistema of todosSitemas) {
          let arrayLimpo = [];
          for (let chave of chavesSistema) {
            let nomeChave = chave;
            let quantidadeChave = Array.from(new Set((data.filter(objeto => objeto.SISTEMA === sistema)).map(objeto => objeto[chave]))).length;

            let array = [nomeChave, quantidadeChave];
            arrayLimpo.push(array);
          }

          arrayLimpo.unshift(['LIDER', sistema]);

          arrayValoresSistema.push(arrayLimpo);
        }

        /* Adicionando na tabela */
        arrayValoresSistema.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (element.getAttribute('name') === 'box-supervisor') {
        document.querySelector('.title-tabela').textContent = 'Quantidades por sistema isolado';

        const todosSupervisor = Array.from(new Set(data.map(objeto => objeto.SUPERVISOR))).sort();

        /* Pegando quantidade por cada chave */
        const chavesSupervisor = ['TAREFA', 'ATIVIDADE', 'SUPERVISOR', 'RECURSO', 'SISTEMA', 'MODULO',];
        const arrayValoresSupervisor = [];

        for (let supervisor of todosSupervisor) {
          let arrayLimpo = [];
          for (let chave of chavesSupervisor) {
            let nomeChave = chave;
            let quantidadeChave = Array.from(new Set((data.filter(objeto => objeto.SUPERVISOR === supervisor)).map(objeto => objeto[chave]))).length;

            let array = [nomeChave, quantidadeChave];
            arrayLimpo.push(array);
          }

          arrayLimpo.unshift(['SUPERVISOR', supervisor]);

          arrayValoresSupervisor.push(arrayLimpo);
        }

        // console.log(arrayValoresSupervisor);

        /* Adicionando na tabela */
        arrayValoresSupervisor.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      }
    });
  });


  // DOM - DIV BARRAS VALORES ABRE A TABELA PARA CADA BARRA AZUL
  const allBarrasValores = document.querySelectorAll('div.sub-barra');

  allBarrasValores.forEach(function(element) {
    element.addEventListener('click', function(event) {
      event.stopPropagation();
      divGeralTabelaCompleto.style.display = 'flex';
      document.body.style.overflow = "hidden";
      divGeralTabelaCompleto.style.top = `${window.scrollY}px`;

      const tagName = element.getAttribute('name');
      const tagTipo = element.getAttribute('tipo');
      const tagCategoria = element.getAttribute('categoria');

      if (tagTipo === 'TAREFA' && tagCategoria === 'RESPONSAVEL') {
        document.querySelector('.title-tabela').textContent = `Quantidade de tarefa por ${tagName}`;

        const objetoJsonApenasTarefa = [];

        for (let tarefa of totalTarefas) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].TAREFA) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].TAREFA) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'TAREFA': data[index].TAREFA,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,
              }

              objetoJsonApenasTarefa.push(meuObjeto);
              break;
            }
          }
        }

        const arrayObjetoJsonApenasTarefa = objetoJsonApenasTarefa.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasTarefa.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        const filtagem = arrayObjetoJsonApenasTarefa.filter(function(array) {
          return array[3][1] === tagName;
        });

        // console.log(filtagem);
        /* Adicionando na tabela */
        filtagem.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (tagTipo === 'ATIVIDADE' && tagCategoria === 'RESPONSAVEL') {
        document.querySelector('.title-tabela').textContent = `Quantidade de atividade por ${tagName}`;
        
        const objetoJsonApenasAtividade = [];

        for (let tarefa of totalAtividades) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].ATIVIDADE) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'ATIVIDADE': data[index].ATIVIDADE,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,
              }

              objetoJsonApenasAtividade.push(meuObjeto);
              break;
            }
          }
        }

        const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasAtividade.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        // console.log(arrayObjetoJsonApenasAtividade);

        const filtagem = arrayObjetoJsonApenasAtividade.filter(function(array) {
          return array[3][1] === tagName;
        });

        // console.log(filtagem);
        /* Adicionando na tabela */
        filtagem.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (tagTipo === 'ATIVIDADE' && tagCategoria === 'SISTEMA') {
        document.querySelector('.title-tabela').textContent = `Quantidade de atividade por ${tagName}`;
        
        const objetoJsonApenasAtividade = [];

        for (let tarefa of totalAtividades) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].ATIVIDADE) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'ATIVIDADE': data[index].ATIVIDADE,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,
              }

              objetoJsonApenasAtividade.push(meuObjeto);
              break;
            }
          }
        }

        const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasAtividade.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        // console.log(arrayObjetoJsonApenasAtividade);

        const filtagem = arrayObjetoJsonApenasAtividade.filter(function(array) {
          return array[6][1] === tagName;
        });
        // console.log(filtagem);

        /* Adicionando na tabela */
        filtagem.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      } else if (tagTipo === 'ATIVIDADE' && tagCategoria === 'SUPERVISOR') {
        document.querySelector('.title-tabela').textContent = `Quantidade de atividade por ${tagName}`;
        
        const objetoJsonApenasAtividade = [];

        for (let tarefa of totalAtividades) {
          let contador = 0;
            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                contador += 1;
              }
            }

          for (let index in data) {
            if (tarefa === data[index].ATIVIDADE) {
              const meuObjeto = {
                'QUANTIDADE': contador,
                'ATIVIDADE': data[index].ATIVIDADE,
                'TITULO': data[index].TITULO,
                'RESPONSAVEL': data[index].RESPONSAVEL,
                'SUPERVISOR': data[index].SUPERVISOR,
                'RECURSO': data[index].RECURSO,
                'SISTEMA': data[index].SISTEMA,
                'MODULO': data[index].MODULO,
              }

              objetoJsonApenasAtividade.push(meuObjeto);
              break;
            }
          }
        }

        const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

        arrayObjetoJsonApenasAtividade.sort((a, b) => {
          const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
          const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
          return valorB - valorA;
        });

        // console.log(arrayObjetoJsonApenasAtividade);

        const filtagem = arrayObjetoJsonApenasAtividade.filter(function(array) {
          return array[4][1] === tagName;
        });
        // console.log(filtagem);

        /* Adicionando na tabela */
        filtagem.forEach(function(array, index) {
          if (index === 0) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('th');
              novoTh.textContent = subArray[0];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('thead').appendChild(novoTr);
          }

          if (array) {
            let novoTr = document.createElement('tr');

            for (let subArray of array) {
              const novoTh = document.createElement('td');
              novoTh.textContent = subArray[1];

              novoTr.appendChild(novoTh);
            }

            document.querySelector('tbody').appendChild(novoTr);
          }
        });
      }
    });
  });


  // DOM - DIV BARRAS VALORES - GRAFICO COMPLETO
const allBtnGraficoCompletoActive = document.querySelectorAll('.btn-grafico-completo');
const btnFecharTabela2 = document.querySelector('.fechar-nivel2');
const btnFecharGraficoCompleto = document.querySelector('#icon-fechar-grafico');
const divContainerGraficoCompleto = document.querySelector('.container-dados-graficos');

allBtnGraficoCompletoActive.forEach(function(element) {
  element.addEventListener('click', function(event) {
    const allDivMiniBarra = document.querySelectorAll('div.mini-barra');

    const allBarraPorcentagem = document.querySelectorAll('.barra-porcentagem');
    allBarraPorcentagem.forEach(element => {
      element.classList.add('teste-barra-pocentagem');
    });

    setTimeout(function() {
      allBarraPorcentagem.forEach(element => {
        element.classList.remove('teste-barra-pocentagem');
      });
    }, 2000);

    btnFecharTabela2.addEventListener('click', function() {
      document.body.style.overflow = "hidden";
    });

    btnFecharGraficoCompleto.addEventListener('click', function() {
      while (divContainerGraficoCompleto.firstChild) {
        divContainerGraficoCompleto.removeChild(divContainerGraficoCompleto.firstChild);
      }
    });

    allDivMiniBarra.forEach(function(element) {
      element.addEventListener('click', function(event) {
        event.stopPropagation();
        divGeralTabelaCompleto.style.display = 'flex';
        document.body.style.overflow = "hidden";
        divGeralTabelaCompleto.style.top = `${window.scrollY}px`;

        const tagName = element.getAttribute('name');
        const tagTipo = element.getAttribute('tipo');
        const tagCategoria = element.getAttribute('categoria');

        if (tagTipo === 'ATIVIDADE' && tagCategoria === 'SISTEMA') {
          document.querySelector('.title-tabela').textContent = `Quantidade de atividade por ${tagName}`;
          
          const objetoJsonApenasAtividade = [];

          for (let tarefa of totalAtividades) {
            let contador = 0;
              for (let index in data) {
                if (tarefa === data[index].ATIVIDADE) {
                  contador += 1;
                }
              }

            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                const meuObjeto = {
                  'QUANTIDADE': contador,
                  'ATIVIDADE': data[index].ATIVIDADE,
                  'TITULO': data[index].TITULO,
                  'RESPONSAVEL': data[index].RESPONSAVEL,
                  'SUPERVISOR': data[index].SUPERVISOR,
                  'RECURSO': data[index].RECURSO,
                  'SISTEMA': data[index].SISTEMA,
                  'MODULO': data[index].MODULO,
                }

                objetoJsonApenasAtividade.push(meuObjeto);
                break;
              }
            }
          }

          const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

          arrayObjetoJsonApenasAtividade.sort((a, b) => {
            const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
            const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
            return valorB - valorA;
          });

          // console.log(arrayObjetoJsonApenasAtividade);

          const filtagem = arrayObjetoJsonApenasAtividade.filter(function(array) {
            return array[6][1] === tagName;
          });
          // console.log(filtagem);

          /* Adicionando na tabela */
          filtagem.forEach(function(array, index) {
            if (index === 0) {
              let novoTr = document.createElement('tr');

              for (let subArray of array) {
                const novoTh = document.createElement('th');
                novoTh.textContent = subArray[0];
  
                novoTr.appendChild(novoTh);
              }

              document.querySelector('thead').appendChild(novoTr);
            }

            if (array) {
              let novoTr = document.createElement('tr');

              for (let subArray of array) {
                const novoTh = document.createElement('td');
                novoTh.textContent = subArray[1];

                novoTr.appendChild(novoTh);
              }

              document.querySelector('tbody').appendChild(novoTr);
            }
          });
        } else if (tagTipo === 'ATIVIDADE' && tagCategoria === 'SUPERVISOR') {
          document.querySelector('.title-tabela').textContent = `Quantidade de atividade por ${tagName}`;
          
          const objetoJsonApenasAtividade = [];

          for (let tarefa of totalAtividades) {
            let contador = 0;
              for (let index in data) {
                if (tarefa === data[index].ATIVIDADE) {
                  contador += 1;
                }
              }

            for (let index in data) {
              if (tarefa === data[index].ATIVIDADE) {
                const meuObjeto = {
                  'QUANTIDADE': contador,
                  'ATIVIDADE': data[index].ATIVIDADE,
                  'TITULO': data[index].TITULO,
                  'RESPONSAVEL': data[index].RESPONSAVEL,
                  'SUPERVISOR': data[index].SUPERVISOR,
                  'RECURSO': data[index].RECURSO,
                  'SISTEMA': data[index].SISTEMA,
                  'MODULO': data[index].MODULO,
                }

                objetoJsonApenasAtividade.push(meuObjeto);
                break;
              }
            }
          }

          const arrayObjetoJsonApenasAtividade = objetoJsonApenasAtividade.map(objeto => Object.entries(objeto));

          arrayObjetoJsonApenasAtividade.sort((a, b) => {
            const valorA = a.find(pair => pair[0] === 'QUANTIDADE')[1];
            const valorB = b.find(pair => pair[0] === 'QUANTIDADE')[1];
            return valorB - valorA;
          });

          // console.log(arrayObjetoJsonApenasAtividade);

          const filtagem = arrayObjetoJsonApenasAtividade.filter(function(array) {
            return array[4][1] === tagName;
          });
          // console.log(filtagem);

          /* Adicionando na tabela */
          filtagem.forEach(function(array, index) {
            if (index === 0) {
              let novoTr = document.createElement('tr');

              for (let subArray of array) {
                const novoTh = document.createElement('th');
                novoTh.textContent = subArray[0];
  
                novoTr.appendChild(novoTh);
              }

              document.querySelector('thead').appendChild(novoTr);
            }

            if (array) {
              let novoTr = document.createElement('tr');

              for (let subArray of array) {
                const novoTh = document.createElement('td');
                novoTh.textContent = subArray[1];

                novoTr.appendChild(novoTh);
              }

              document.querySelector('tbody').appendChild(novoTr);
            }
          });
        }
      });
    });
  });
});
}

// const data = sessionStorage.getItem('incode2099');
// const jsonData = JSON.parse(data);
// aplicandoDadosSite(jsonData);


// JANELA FILTRO *************************************************************************
const verificaBtnAno = sessionStorage.getItem('btnAno');
if (!verificaBtnAno) {
  sessionStorage.setItem('btnAno', '');
}

const verificaBtnMes = sessionStorage.getItem('btnMes');
if (!verificaBtnMes) {
  sessionStorage.setItem('btnMes', '');
}

const verificaBtnTatefa = sessionStorage.getItem('btnTarefa');
if (!verificaBtnTatefa) {
  sessionStorage.setItem('btnTarefa', '');
}

const verificaBtnAtividade = sessionStorage.getItem('btnAtividade');
if (!verificaBtnAtividade) {
  sessionStorage.setItem('btnAtividade', '');
}

const boxFiltro = document.querySelector('.container-filtro-cabecalho');
boxFiltro.style.cursor = 'pointer';

boxFiltro.addEventListener('mouseover', function(event) {
  document.querySelector('.container-filtro-cabecalho p').style.color = '#2F419B';
  document.querySelector('.container-filtro-cabecalho img').src = 'icons/icon-filtro-focus.png';
});

boxFiltro.addEventListener('mouseout', function(event) {
  document.querySelector('.container-filtro-cabecalho p').style.color = '#979DB7';
  document.querySelector('.container-filtro-cabecalho img').src = 'icons/icon-filtro-padrao.png';
});

boxFiltro.addEventListener('click', function(event) {
  sessionStorage.setItem('btnAno', '');
  sessionStorage.setItem('btnMes', '');
  sessionStorage.setItem('btnTarefa', '');
  sessionStorage.setItem('btnAtividade', '');

  const divGeralFiltroCompleto = document.querySelector('.container-filtro-efeito-fundo');
  const btnFecharFiltro = document.querySelector('#icon-fechar-filtro');
  const divContainerAno = document.querySelector('.container-ano')

  divGeralFiltroCompleto.style.display = 'flex';
  document.body.style.overflow = "hidden";
  divGeralFiltroCompleto.style.top = `${window.scrollY}px`;

  btnFecharFiltro.addEventListener('click', function() {
    divGeralFiltroCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    while (divContainerAno.firstChild) {
      divContainerAno.removeChild(divContainerAno.firstChild);
    }

    const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
    testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
    const testeMesSelecionado = document.querySelector('.mes-selecionado');
    if (testeMesSelecionado) {
      testeMesSelecionado.classList.remove('mes-selecionado');
    }

    const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
    testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
    const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
    if (testeTarefaSelecionado) {
      testeTarefaSelecionado.classList.remove('tarefa-selecionado');
    }

    const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
    testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
    const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
    if (testeAtividadeSelecionado) {
      testeAtividadeSelecionado.classList.remove('atividade-selecionado');
    }
  });

  const data = sessionStorage.getItem('incode2099');
  const jsonData = JSON.parse(data);
  const dataJsonParaFiltro = jsonData;

  const todosOsAnos = Array.from(new Set(dataJsonParaFiltro.map(objeto => objeto.DTA_FIM.slice(0, 4)))).sort();

  const divAno = document.querySelector('.container-ano');

  const novoH2 = document.createElement('h2');
  novoH2.textContent = 'Ano:';

  divAno.appendChild(novoH2);

  for (let ano of todosOsAnos) {
    if (ano === '') continue;

    const novoButton = document.createElement('button');
    novoButton.textContent = ano;
    novoButton.classList.add('btn-ano');
    novoButton.classList.add('ano-selecionavel');
    novoButton.setAttribute('ano', ano);

    divAno.appendChild(novoButton);
  }

  const allBtnAno = document.querySelectorAll('.btn-ano');

  allBtnAno.forEach(function(element) {
    element.addEventListener('click', function(event) {
      allBtnAno.forEach(element => element.classList.remove('ano-selecionado'));

      sessionStorage.setItem('btnAno', '');
      sessionStorage.setItem('btnMes', '');
      sessionStorage.setItem('btnTarefa', '');
      sessionStorage.setItem('btnAtividade', '');
      sessionStorage.setItem('btnAno', event.target.getAttribute('ano'));

      const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
      testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
      const testeMesSelecionado = document.querySelector('.mes-selecionado');
      if (testeMesSelecionado) {
        testeMesSelecionado.classList.remove('mes-selecionado');
      }

      const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
      testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
      const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
      if (testeTarefaSelecionado) {
        testeTarefaSelecionado.classList.remove('tarefa-selecionado');
      }

      const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
      testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
      const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
      if (testeAtividadeSelecionado) {
        testeAtividadeSelecionado.classList.remove('atividade-selecionado');
      }

      const anoReferente = event.target.getAttribute('ano');
      event.target.classList.add('ano-selecionado');

      const dataJsonFiltradoPeloAno = dataJsonParaFiltro.filter(objeto => objeto.DTA_FIM.match(anoReferente));
      const mesesDoDataJsonFiltradoPeloAno = Array.from(new Set(dataJsonFiltradoPeloAno.filter(objeto => objeto.DTA_FIM.match(anoReferente)).map(objeto => objeto.DTA_FIM.slice(5, 7)))).sort();
      
      const allBtnMes = document.querySelectorAll('.btn-mes');
      
      allBtnMes.forEach(function(element) {
        for (let mes of mesesDoDataJsonFiltradoPeloAno) {
          const btnMesNumero = element.getAttribute('numero');

          if (mes === btnMesNumero) {
            element.classList.add('mes-selecionavel');
            break;
          }
        }
      });

      // console.log(dataJsonFiltradoPeloAno);
      
      const allBtnMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
        
      allBtnMesSelecionavel.forEach(function(element) {
        element.addEventListener('click', function(event) {
          allBtnMesSelecionavel.forEach(element => element.classList.remove('mes-selecionado'));

          // sessionStorage.setItem('btnAno', '');
          sessionStorage.setItem('btnMes', '');
          sessionStorage.setItem('btnTarefa', '');
          sessionStorage.setItem('btnAtividade', '');
          // sessionStorage.setItem('btnAno', event.target.getAttribute('ano'));
          sessionStorage.setItem('btnMes', event.target.getAttribute('numero'));

          const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
          testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
          const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
          if (testeTarefaSelecionado) {
            testeTarefaSelecionado.classList.remove('tarefa-selecionado');
          }
        
          const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
          testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
          const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
          if (testeAtividadeSelecionado) {
            testeAtividadeSelecionado.classList.remove('atividade-selecionado');
          }

          const mesReferente = event.target.getAttribute('numero');
          event.target.classList.add('mes-selecionado');

          const dataJsonFiltradoPeloMes = dataJsonFiltradoPeloAno.filter(objeto => objeto.DTA_FIM.match(`${anoReferente}-${mesReferente}`));
          const tiposSituacoesTarefas = Array.from(new Set(dataJsonFiltradoPeloMes.map(objeto => objeto.SITUCAO_TAREFA)));

          const allBtnTarefa = document.querySelectorAll('.btn-tarefa');

          allBtnTarefa.forEach(function(element) {
            for (let tarefa of tiposSituacoesTarefas) {
              const btnTarefaSituacao = element.getAttribute('name');
  
              if (tarefa === btnTarefaSituacao) {
                element.classList.add('tarefa-selecionavel');
                break;
              }
            }
          });

          // console.log(dataJsonFiltradoPeloMes);

          const allBtnTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');

          allBtnTarefaSelecionavel.forEach(function(element) {
            element.addEventListener('click', function(event) {
              allBtnTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionado'));

              // sessionStorage.setItem('btnAno', '');
              // sessionStorage.setItem('btnMes', '');
              sessionStorage.setItem('btnTarefa', '');
              sessionStorage.setItem('btnAtividade', '');
              // sessionStorage.setItem('btnAno', event.target.getAttribute('ano'));
              // sessionStorage.setItem('btnMes', event.target.getAttribute('numero'));
              sessionStorage.setItem('btnTarefa', event.target.getAttribute('name'));

              const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
              testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
              const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
              if (testeAtividadeSelecionado) {
                testeAtividadeSelecionado.classList.remove('atividade-selecionado');
              }

              const tarefaReferente = event.target.getAttribute('name');
              event.target.classList.add('tarefa-selecionado');

              const dataJsonFiltradoPelaTarefa = dataJsonFiltradoPeloMes.filter(objeto => objeto.SITUCAO_TAREFA.match(tarefaReferente));
              const tiposSituacoesAtividade = Array.from(new Set(dataJsonFiltradoPelaTarefa.map(objeto => objeto.SITUACAO_ATIVIDADE)));
              
              // console.log(dataJsonFiltradoPelaTarefa);

              const allBtnAtividade = document.querySelectorAll('.btn-atividade');

              allBtnAtividade.forEach(function(element) {
                for (let atividade of tiposSituacoesAtividade) {
                  const btnTarefaSituacao = element.getAttribute('name');
      
                  if (atividade === btnTarefaSituacao) {
                    element.classList.add('atividade-selecionavel');
                    break;
                  }
                }
              });

              const allBtnAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
            
              allBtnAtividadeSelecionavel.forEach(function(element) {
                element.addEventListener('click', function(event) {
                  allBtnAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionado'));

                  // sessionStorage.setItem('btnAno', '');
                  // sessionStorage.setItem('btnMes', '');
                  // sessionStorage.setItem('btnTarefa', '');
                  sessionStorage.setItem('btnAtividade', '');
                  // sessionStorage.setItem('btnAno', event.target.getAttribute('ano'));
                  // sessionStorage.setItem('btnMes', event.target.getAttribute('numero'));
                  // sessionStorage.setItem('btnTarefa', event.target.getAttribute('name'));
                  sessionStorage.setItem('btnAtividade', event.target.getAttribute('name'));

                  const atividadeReferente = event.target.getAttribute('name');
                  event.target.classList.add('atividade-selecionado');

                  const dataJsonFiltradoPelaAtividade = dataJsonFiltradoPelaTarefa.filter(objeto => objeto.SITUACAO_ATIVIDADE.match(atividadeReferente));
                  
                  // console.log(dataJsonFiltradoPelaAtividade);
                });
              });
            });
          });
        });
      });
    });
  });
});


// BTN APLICAR *************************************************************************
const btnAplicar = document.querySelector('#aplicar');
const divGeralFiltroCompleto = document.querySelector('.container-filtro-efeito-fundo');
const divContainerAno = document.querySelector('.container-ano');
const graficoTarefaLider = document.querySelector('.grafico-tarefa-lider');
const graficoResponsavel = document.querySelector('.grafico-atividade-responsavel');
const graficoSistema = document.querySelector('.grafico-atividade-sistema');
const graficoSupervisor = document.querySelector('.grafico-atividade-supervisor');
const graficoCompleto = document.querySelector('.container-dados-graficos');
const tagTHeader = document.querySelector('thead');
const tagTBody = document.querySelector('tbody');


btnAplicar.addEventListener('click', function() {
  let btnAno = sessionStorage.getItem('btnAno');
  let btnMes = sessionStorage.getItem('btnMes');
  let btnTarefa = sessionStorage.getItem('btnTarefa');
  let btnAtividade = sessionStorage.getItem('btnAtividade');

  /* REAPLICANDO FILTRO POR SELEÇÃO TESTE */
  if (btnAno !== '' && btnMes !== '' && btnTarefa !== '' && btnAtividade !== '') {
    divGeralFiltroCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    while (divContainerAno.firstChild) {
      divContainerAno.removeChild(divContainerAno.firstChild);
    }

    while (graficoTarefaLider.firstChild) {
      graficoTarefaLider.removeChild(graficoTarefaLider.firstChild);
    }

    while (graficoResponsavel.firstChild) {
      graficoResponsavel.removeChild(graficoResponsavel.firstChild);
    }

    while (graficoSistema.firstChild) {
      graficoSistema.removeChild(graficoSistema.firstChild);
    }

    while (graficoSupervisor.firstChild) {
      graficoSupervisor.removeChild(graficoSupervisor.firstChild);
    }

    while (graficoCompleto.firstChild) {
      graficoCompleto.removeChild(graficoCompleto.firstChild);
    }

    while (tagTHeader.firstChild) {
      tagTHeader.removeChild(tagTHeader.firstChild);
    }

    while (tagTBody.firstChild) {
      tagTBody.removeChild(tagTBody.firstChild);
    }

    const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
    testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
    const testeMesSelecionado = document.querySelector('.mes-selecionado');
    if (testeMesSelecionado) {
      testeMesSelecionado.classList.remove('mes-selecionado');
    }

    const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
    testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
    const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
    if (testeTarefaSelecionado) {
      testeTarefaSelecionado.classList.remove('tarefa-selecionado');
    }

    const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
    testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
    const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
    if (testeAtividadeSelecionado) {
      testeAtividadeSelecionado.classList.remove('atividade-selecionado');
    }
    
    const data = sessionStorage.getItem('incode2099');
    const jsonData = JSON.parse(data);
    const jsonDataFiltroPorAnoAndMesAndTarefaAndAtividade = jsonData.filter(objeto => objeto.DTA_CADASTRAMENTO.match(`${btnAno}-${btnMes}`)).filter(objeto => objeto.SITUCAO_TAREFA === btnTarefa).filter(objeto => objeto.SITUACAO_ATIVIDADE === btnAtividade);
    aplicandoDadosSite(jsonDataFiltroPorAnoAndMesAndTarefaAndAtividade);
  } else if (btnAno !== '' && btnMes !== '' && btnTarefa !== '') {
    divGeralFiltroCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    while (divContainerAno.firstChild) {
      divContainerAno.removeChild(divContainerAno.firstChild);
    }

    while (graficoTarefaLider.firstChild) {
      graficoTarefaLider.removeChild(graficoTarefaLider.firstChild);
    }

    while (graficoResponsavel.firstChild) {
      graficoResponsavel.removeChild(graficoResponsavel.firstChild);
    }

    while (graficoSistema.firstChild) {
      graficoSistema.removeChild(graficoSistema.firstChild);
    }

    while (graficoSupervisor.firstChild) {
      graficoSupervisor.removeChild(graficoSupervisor.firstChild);
    }

    while (graficoCompleto.firstChild) {
      graficoCompleto.removeChild(graficoCompleto.firstChild);
    }

    while (tagTHeader.firstChild) {
      tagTHeader.removeChild(tagTHeader.firstChild);
    }

    while (tagTBody.firstChild) {
      tagTBody.removeChild(tagTBody.firstChild);
    }

    const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
    testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
    const testeMesSelecionado = document.querySelector('.mes-selecionado');
    if (testeMesSelecionado) {
      testeMesSelecionado.classList.remove('mes-selecionado');
    }

    const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
    testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
    const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
    if (testeTarefaSelecionado) {
      testeTarefaSelecionado.classList.remove('tarefa-selecionado');
    }

    const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
    testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
    const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
    if (testeAtividadeSelecionado) {
      testeAtividadeSelecionado.classList.remove('atividade-selecionado');
    }

    const data = sessionStorage.getItem('incode2099');
    const jsonData = JSON.parse(data);
    const jsonDataFiltroPorAnoAndMesAndTarefa = jsonData.filter(objeto => objeto.DTA_CADASTRAMENTO.match(`${btnAno}-${btnMes}`)).filter(objeto => objeto.SITUCAO_TAREFA === btnTarefa);
    aplicandoDadosSite(jsonDataFiltroPorAnoAndMesAndTarefa);
  } else if (btnAno !== '' && btnMes !== '') {
    divGeralFiltroCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    while (divContainerAno.firstChild) {
      divContainerAno.removeChild(divContainerAno.firstChild);
    }

    while (graficoTarefaLider.firstChild) {
      graficoTarefaLider.removeChild(graficoTarefaLider.firstChild);
    }

    while (graficoResponsavel.firstChild) {
      graficoResponsavel.removeChild(graficoResponsavel.firstChild);
    }

    while (graficoSistema.firstChild) {
      graficoSistema.removeChild(graficoSistema.firstChild);
    }

    while (graficoSupervisor.firstChild) {
      graficoSupervisor.removeChild(graficoSupervisor.firstChild);
    }

    while (graficoCompleto.firstChild) {
      graficoCompleto.removeChild(graficoCompleto.firstChild);
    }

    while (tagTHeader.firstChild) {
      tagTHeader.removeChild(tagTHeader.firstChild);
    }

    while (tagTBody.firstChild) {
      tagTBody.removeChild(tagTBody.firstChild);
    }

    const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
    testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
    const testeMesSelecionado = document.querySelector('.mes-selecionado');
    if (testeMesSelecionado) {
      testeMesSelecionado.classList.remove('mes-selecionado');
    }

    const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
    testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
    const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
    if (testeTarefaSelecionado) {
      testeTarefaSelecionado.classList.remove('tarefa-selecionado');
    }

    const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
    testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
    const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
    if (testeAtividadeSelecionado) {
      testeAtividadeSelecionado.classList.remove('atividade-selecionado');
    }


    const data = sessionStorage.getItem('incode2099');
    const jsonData = JSON.parse(data);
    const jsonDataFiltroPorAnoAndMes = jsonData.filter(objeto => objeto.DTA_CADASTRAMENTO.match(`${btnAno}-${btnMes}`));
    aplicandoDadosSite(jsonDataFiltroPorAnoAndMes);
  } else if (btnAno !== '') {
    divGeralFiltroCompleto.style.display = 'none';
    document.body.style.overflow = "auto";

    while (divContainerAno.firstChild) {
      divContainerAno.removeChild(divContainerAno.firstChild);
    }

    while (graficoTarefaLider.firstChild) {
      graficoTarefaLider.removeChild(graficoTarefaLider.firstChild);
    }

    while (graficoResponsavel.firstChild) {
      graficoResponsavel.removeChild(graficoResponsavel.firstChild);
    }

    while (graficoSistema.firstChild) {
      graficoSistema.removeChild(graficoSistema.firstChild);
    }

    while (graficoSupervisor.firstChild) {
      graficoSupervisor.removeChild(graficoSupervisor.firstChild);
    }

    while (graficoCompleto.firstChild) {
      graficoCompleto.removeChild(graficoCompleto.firstChild);
    }

    while (tagTHeader.firstChild) {
      tagTHeader.removeChild(tagTHeader.firstChild);
    }

    while (tagTBody.firstChild) {
      tagTBody.removeChild(tagTBody.firstChild);
    }

    const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
    testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
    const testeMesSelecionado = document.querySelector('.mes-selecionado');
    if (testeMesSelecionado) {
      testeMesSelecionado.classList.remove('mes-selecionado');
    }

    const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
    testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
    const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
    if (testeTarefaSelecionado) {
      testeTarefaSelecionado.classList.remove('tarefa-selecionado');
    }

    const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
    testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
    const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
    if (testeAtividadeSelecionado) {
      testeAtividadeSelecionado.classList.remove('atividade-selecionado');
    }

    const data = sessionStorage.getItem('incode2099');
    const jsonData = JSON.parse(data);
    const jsonDataFiltroPorAno = jsonData.filter(objeto => objeto.DTA_CADASTRAMENTO.match(btnAno));
    aplicandoDadosSite(jsonDataFiltroPorAno);
  }
  /* REAPLICANDO FILTRO POR SELEÇÃO TESTE */
});

// BTN PADRÃO *************************************************************************
const btnPadrao = document.querySelector('#padrao');

btnPadrao.addEventListener('click', function() {
  divGeralFiltroCompleto.style.display = 'none';
  document.body.style.overflow = "auto";

  while (divContainerAno.firstChild) {
    divContainerAno.removeChild(divContainerAno.firstChild);
  }

  while (graficoTarefaLider.firstChild) {
    graficoTarefaLider.removeChild(graficoTarefaLider.firstChild);
  }

  while (graficoResponsavel.firstChild) {
    graficoResponsavel.removeChild(graficoResponsavel.firstChild);
  }

  while (graficoSistema.firstChild) {
    graficoSistema.removeChild(graficoSistema.firstChild);
  }

  while (graficoSupervisor.firstChild) {
    graficoSupervisor.removeChild(graficoSupervisor.firstChild);
  }

  while (graficoCompleto.firstChild) {
    graficoCompleto.removeChild(graficoCompleto.firstChild);
  }

  while (tagTHeader.firstChild) {
    tagTHeader.removeChild(tagTHeader.firstChild);
  }

  while (tagTBody.firstChild) {
    tagTBody.removeChild(tagTBody.firstChild);
  }

  const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
  testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
  const testeMesSelecionado = document.querySelector('.mes-selecionado');
  if (testeMesSelecionado) {
    testeMesSelecionado.classList.remove('mes-selecionado');
  }

  const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
  testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
  const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
  if (testeTarefaSelecionado) {
    testeTarefaSelecionado.classList.remove('tarefa-selecionado');
  }

  const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
  testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
  const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
  if (testeAtividadeSelecionado) {
    testeAtividadeSelecionado.classList.remove('atividade-selecionado');
  }

  const data = sessionStorage.getItem('incode2099');
  const jsonData = JSON.parse(data);
  aplicandoDadosSite(jsonData);
});

// BTN CANCELAR *************************************************************************
const btnCancelar = document.querySelector('#cancelar');

btnCancelar.addEventListener('click', function() {
  divGeralFiltroCompleto.style.display = 'none';
  document.body.style.overflow = "auto";

  while (divContainerAno.firstChild) {
    divContainerAno.removeChild(divContainerAno.firstChild);
  }

  const testeAllMesSelecionavel = document.querySelectorAll('.mes-selecionavel');
  testeAllMesSelecionavel.forEach(element => element.classList.remove('mes-selecionavel'));
  const testeMesSelecionado = document.querySelector('.mes-selecionado');
  if (testeMesSelecionado) {
    testeMesSelecionado.classList.remove('mes-selecionado');
  }

  const testeAllTarefaSelecionavel = document.querySelectorAll('.tarefa-selecionavel');
  testeAllTarefaSelecionavel.forEach(element => element.classList.remove('tarefa-selecionavel'));
  const testeTarefaSelecionado = document.querySelector('.tarefa-selecionado');
  if (testeTarefaSelecionado) {
    testeTarefaSelecionado.classList.remove('tarefa-selecionado');
  }

  const testeAllAtividadeSelecionavel = document.querySelectorAll('.atividade-selecionavel');
  testeAllAtividadeSelecionavel.forEach(element => element.classList.remove('atividade-selecionavel'));
  const testeAtividadeSelecionado = document.querySelector('.atividade-selecionado');
  if (testeAtividadeSelecionado) {
    testeAtividadeSelecionado.classList.remove('atividade-selecionado');
  }
});

const data = sessionStorage.getItem('incode2099');
const jsonData = JSON.parse(data);
aplicandoDadosSite(jsonData);