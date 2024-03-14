class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if (this[i] === undefined || this[i] === '' || this[i] === null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        let despesas = [];

        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));
            if (despesa) {
                despesa.id = i; // Corrigido para garantir que o objeto despesa existe
                despesas.push(despesa);
            }
        }

        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = this.recuperarTodosRegistros();

        // Filtrar de acordo com os critérios de pesquisa
        if (despesa.ano) {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        if (despesa.mes) {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }
        if (despesa.dia) {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }
        if (despesa.tipo) {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }
        if (despesa.descricao) {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }
        if (despesa.valor) {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
        calcularTotalDespesas();
    }
}

let bd = new Bd();

function cadastrarDespesa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    if (despesa.validarDados()) {
        bd.gravar(despesa);
        $('#sucessoGravacao').modal('show');
    } else {
        $('#erroGravacao').modal('show');
    }

    // Limpar os campos após o cadastro
    document.getElementById('ano').value = '';
    document.getElementById('mes').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    calcularTotalDespesas();
}

function carregarTodosRegistros() {
    let despesas = bd.recuperarTodosRegistros();
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;

        switch (d.tipo) {
            case '1':
                d.tipo = 'Comida';
                break;
            case '2':
                d.tipo = 'Bebida';
                break;
            case '3':
                d.tipo = 'Decoração';
                break;
            case '4':
                d.tipo = 'Pagos';
                break;
            case '5':
                d.tipo = 'Externos';
                break;
            default:
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criar o botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.onclick = function () {
            bd.remover(d.id); // Remover a despesa associada ao botão
            linha.remove(); // Remover a linha da tabela
        };

        // Adicionar o botão à célula da tabela
        let cell = linha.insertCell(4);
        cell.appendChild(btn);
    });
    calcularTotalDespesas();
}

function recarregarPagina() {
    window.location.reload();
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value.toString();
    let mes = document.getElementById('mes').value.toString();
    let dia = document.getElementById('dia').value.toString();
    let tipo = document.getElementById('tipo').value.toString();
    let descricao = document.getElementById('descricao').value.toString();
    let valor = document.getElementById('valor').value.toString();

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    let despesas = bd.pesquisar(despesa);
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;

        switch (d.tipo) {
            case '1':
                d.tipo = 'Comida';
                break;
            case '2':
                d.tipo = 'Bebida';
                break;
            case '3':
                d.tipo = 'Decoração';
                break;
            case '4':
                d.tipo = 'Pagos';
                break;
            case '5':
                d.tipo = 'Externos';
                break;
            default:
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criar o botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.onclick = function () {
            bd.remover(d.id); // Remover a despesa associada ao botão
            linha.remove(); // Remover a linha da tabela

        };

        // Adicionar o botão à célula da tabela
        let cell = linha.insertCell(4);
        cell.appendChild(btn);
    });
    calcularTotalDespesas();
}

function calcularTotalDespesas() {
    let despesas = bd.recuperarTodosRegistros();
    let total = 0;

    despesas.forEach(function (d) {
        total += parseFloat(d.valor);
    });

    // Exibir o total na tela
    let totalDespesasElement = document.getElementById('totalDespesas');
    if (totalDespesasElement) {
        totalDespesasElement.innerHTML = '<div class="col"><strong>Total: R$ ' + total.toFixed(2) + '</strong></div>';
    } else {
        // Caso o elemento onde você deseja mostrar o total não exista, você pode criá-lo
        let divTotal = document.createElement('div');
        divTotal.id = 'totalDespesas';
        divTotal.className = 'row mb-3';
        divTotal.innerHTML = '<div class="col"><strong>Total: R$ ' + total.toFixed(2) + '</strong></div>';

        let container = document.querySelector('.container');
        container.insertBefore(divTotal, container.children[3]); // Insere o total entre a lista de despesas e os filtros
    }
}


