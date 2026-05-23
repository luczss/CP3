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