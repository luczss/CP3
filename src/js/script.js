// ── PRODUTOS ─────────────────────────────────────────────────────────────────
const produtos = [
  { 
    id:1, 
    modelo:"Retrô",
    nome:"Maeving RM1",    
    descricao:"Café racer elétrica com design retrô e tecnologia moderna.", 
    preco:60000, 
    img:"" 
},
  { 
    id:2, 
    modelo:"Moto Cross",      
    nome:"Sur-Ron Light Bee",  
    descricao:"Moto off-road leve e potente para trilhas e terrenos difíceis.", 
    preco:35000, 
    img:"" 
},
  { 
    id:3, 
    modelo:"Urbana", 
    nome:"Voltz EV1",  
    descricao:"Scooter elétrica urbana, econômica e perfeita para o dia a dia na cidade.", 
    preco:25000, 
    img:"" 
},
  { 
    id:4, 
    modelo:"Sport",   
    nome:"Zero SR/F", 
    descricao:"Moto elétrica esportiva com aceleração forte e visual moderno.", 
    preco:120000, 
    img:"" 
},
  { 
    id:5, 
    modelo:"Adventure",   
    nome:"Zero DSR/X",  
    descricao:"Modelo adventure ideal para viagens, estradas e trilhas.", 
    preco:150000, 
    img:"" 
}
];


const fmt = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
 
// ── CARRINHO (sessionStorage) ─────────────────────────────────────────────────
function getCarrinho() {
  try { return JSON.parse(sessionStorage.getItem("voltmoto_cart") || "[]"); }
  catch { return []; }
}
function setCarrinho(c) { sessionStorage.setItem("voltmoto_cart", JSON.stringify(c)); }
function totalC(c)  { return c.reduce((a, i) => a + i.preco * i.quantidade, 0); }
function qtdC(c)    { return c.reduce((a, i) => a + i.quantidade, 0); }
 
// ── BADGE ─────────────────────────────────────────────────────────────────────
function atualizarBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  const n = qtdC(getCarrinho());
  badge.textContent = n;
  badge.style.display = n ? "flex" : "none";
}
 
// ── TOAST ─────────────────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}
 
// ── ADICIONAR AO CARRINHO ─────────────────────────────────────────────────────
function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  const carrinho = getCarrinho();
  const exist = carrinho.find(i => i.id === id);
  if (exist) exist.quantidade++;
  else carrinho.push({ ...produto, quantidade: 1 });
  setCarrinho(carrinho);
  atualizarBadge();
  toast(produto.nome + " adicionado!");
 
  const btn = document.querySelector(`[data-id="${id}"]`);
  if (btn) {
    btn.classList.add("adicionado");
    btn.textContent = "Adicionado ✓";
    setTimeout(() => { btn.classList.remove("adicionado"); btn.textContent = "Adicionar"; }, 1400);
  }
}
// ── FILTROS + GRID (index.html) ───────────────────────────────────────────────
let filtroAtivo = "Todos";
 
function renderFiltros() {
  const div = document.getElementById("filtros");
  if (!div) return;
  const badges = ["Todos", ...new Set(produtos.map(p => p.badge))];
  div.innerHTML = "";
  badges.forEach(b => {
    const btn = document.createElement("button");
    btn.className = "filtro-btn" + (b === filtroAtivo ? " ativo" : "");
    btn.textContent = b;
    btn.onclick = () => { filtroAtivo = b; renderFiltros(); renderProdutos(); };
    div.appendChild(btn);
  });
}
 
function renderProdutos() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;
  const lista = filtroAtivo === "Todos" ? produtos : produtos.filter(p => p.badge === filtroAtivo);
  const countEl = document.getElementById("count-label");
  if (countEl) countEl.textContent = lista.length + (lista.length === 1 ? " item" : " itens");
  grid.innerHTML = "";
  lista.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <span class="card-badge">${p.badge}</span>
        <h3 class="card-nome">${p.nome}</h3>
        <p class="card-desc">${p.descricao}</p>
        <div class="card-footer">
          <span class="card-preco">${fmt(p.preco)}</span>
          <button class="card-btn" data-id="${p.id}" onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
 
// ── CARRINHO PAGE (loja.html) ─────────────────────────────────────────────────
let descontoAplicado = false;
 
function renderCarrinhoPage() {
  const lista  = document.getElementById("carrinho-lista");
  const resumo = document.getElementById("resumo-container");
  if (!lista) return;
 
  const carrinho = getCarrinho();
 
  if (!carrinho.length) {
    lista.innerHTML = `
      <div class="carrinho-vazio">
        <span>🏍️</span>
        <p>Seu carrinho está vazio.</p>
        <a href="../index.html">← Ver produtos</a>
      </div>`;
    if (resumo) resumo.style.visibility = "hidden";
    return;
  }
 
  if (resumo) resumo.style.visibility = "visible";
  lista.innerHTML = "";
  carrinho.forEach(item => {
    const li = document.createElement("li");
    li.className = "carrinho-item";
    li.innerHTML = `
      <div class="item-img">${item.emoji}</div>
      <div class="item-info">
        <p class="item-nome">${item.nome}</p>
        <p class="item-qtd">Qtd: ${item.quantidade}</p>
      </div>
      <span class="item-valor">${fmt(item.preco * item.quantidade)}</span>`;
    lista.appendChild(li);
  });
  atualizarResumo(carrinho);
}
 
function atualizarResumo(carrinho) {
  const sub  = totalC(carrinho);
  const desc = descontoAplicado ? sub * 0.1 : 0;
  const tot  = sub - desc;
 
  const subEl  = document.getElementById("subtotal-valor");
  const descEl = document.getElementById("desconto-valor");
  const totEl  = document.getElementById("total-valor");
  const btnD   = document.getElementById("btn-desconto");
 
  if (subEl)  subEl.textContent  = fmt(sub);
  if (descEl) { descEl.textContent = descontoAplicado ? `− ${fmt(desc)}` : "R$ 0,00"; descEl.className = "rv" + (descontoAplicado ? " verde" : ""); }
  if (totEl)  { totEl.textContent = fmt(tot); totEl.className = descontoAplicado ? "com-desconto" : ""; }
  if (btnD)   { btnD.textContent = descontoAplicado ? "✓ Desconto aplicado" : "Aplicar cupom 10% OFF"; btnD.disabled = descontoAplicado; }
}
 
function aplicarDesconto() {
  const carrinho = getCarrinho();
  if (!carrinho.length || descontoAplicado) return;
  descontoAplicado = true;
  atualizarResumo(carrinho);
}
 
function finalizarCompra() {
  const carrinho = getCarrinho();
  if (!carrinho.length) { toast("Carrinho vazio!"); return; }
  const val = document.getElementById("total-valor")?.textContent || "";
  alert(`Compra finalizada! 🎉\n\nTotal: ${val}\n\nObrigado pela compra na VoltMoto!`);
  setCarrinho([]);
  descontoAplicado = false;
  atualizarBadge();
  renderCarrinhoPage();
}
 
// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  atualizarBadge();
  renderFiltros();
  renderProdutos();
  renderCarrinhoPage();
 
  document.getElementById("btn-desconto")?.addEventListener("click", aplicarDesconto);
  document.getElementById("btn-finalizar")?.addEventListener("click", finalizarCompra);
});