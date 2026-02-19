import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { Voucher } from './types';

type View = 'home' | 'gastronomia' | 'motoristas' | 'lazer' | 'comercio' | 'cupons';

// Default images configuration
const DEFAULT_IMAGES = {
  home_hero: "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=1920&auto=format&fit=crop",
  xangai_promo: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=800",
  kart_promo: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800",
  mestre_promo: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800",
  chefao_promo: "https://images.unsplash.com/photo-1541510912111-8db35b0ca13a?q=80&w=800",
  divinas_promo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
  schutzen_promo: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
  cassio_photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&auto=format&fit=crop"
};

const DEFAULT_RULES = {
  xangai: "Válido para compras acima de R$100 em itens de decoração.",
  kart: "Válido de segunda a quinta-feira na bateria de 20 min.",
  mestre: "Consumo mínimo de R$40 no local ou delivery.",
  chefao: "Consumo mínimo de R$25 em salgados.",
  divinas: "Válido para a segunda pizza de menor valor.",
  schutzen: "Válido apenas na compra de ingresso antecipado.",
  kayros: "Reservas pelo site oficial ou WhatsApp direto.",
  barra: "Válido para hospedagens em dias de semana.",
  moda: "Apenas para peças de coleção selecionada.",
  tech: "Em compras acima de R$500.",
  pet: "Na compra de saco de ração de 15kg."
};

const DEFAULT_DISCOUNTS = {
  xangai: "10% OFF",
  kart: "15% OFF",
  mestre: "10% OFF",
  chefao: "BEBIDA GRÁTIS",
  divinas: "20% OFF",
  schutzen: "VALE CHOPP",
  kayros: "15% OFF",
  barra: "10% OFF",
  moda: "15% OFF",
  tech: "R$ 50 OFF",
  pet: "BANHO GRÁTIS"
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<{title: string, discount: string, code: string, color: string, rules: string} | null>(null);
  const [cpfInput, setCpfInput] = useState('');
  const [generatedVoucher, setGeneratedVoucher] = useState<Voucher | null>(null);
  const [error, setError] = useState('');
  
  // Admin States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [ruleOverrides, setRuleOverrides] = useState<Record<string, string>>({});
  const [discountOverrides, setDiscountOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedImg = localStorage.getItem('jaragua_img_overrides');
    if (savedImg) setImageOverrides(JSON.parse(savedImg));
    const savedRules = localStorage.getItem('jaragua_rule_overrides');
    if (savedRules) setRuleOverrides(JSON.parse(savedRules));
    const savedDiscounts = localStorage.getItem('jaragua_discount_overrides');
    if (savedDiscounts) setDiscountOverrides(JSON.parse(savedDiscounts));
  }, [activeView]);

  const getImg = (key: keyof typeof DEFAULT_IMAGES) => imageOverrides[key] || DEFAULT_IMAGES[key];
  const getRule = (key: keyof typeof DEFAULT_RULES) => ruleOverrides[key] || DEFAULT_RULES[key];
  const getDiscount = (key: keyof typeof DEFAULT_DISCOUNTS) => discountOverrides[key] || DEFAULT_DISCOUNTS[key];

  const colorMap: Record<string, { bg: string, text: string, border: string, lightBg: string, lightText: string, lightBorder: string, darkBg: string }> = {
    rose: { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', lightBg: 'bg-rose-50', lightText: 'text-rose-700', lightBorder: 'border-rose-100', darkBg: 'bg-rose-900' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', lightBg: 'bg-purple-50', lightText: 'text-purple-700', lightBorder: 'border-purple-100', darkBg: 'bg-purple-900' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700', lightBorder: 'border-emerald-100', darkBg: 'bg-emerald-900' },
    amber: { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', lightBg: 'bg-amber-50', lightText: 'text-amber-700', lightBorder: 'border-amber-100', darkBg: 'bg-amber-900' },
    orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600', lightBg: 'bg-orange-50', lightText: 'text-orange-700', lightBorder: 'border-orange-100', darkBg: 'bg-orange-900' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', lightBg: 'bg-blue-50', lightText: 'text-blue-700', lightBorder: 'border-blue-100', darkBg: 'bg-blue-900' },
    slate: { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-600', lightBg: 'bg-slate-50', lightText: 'text-slate-700', lightBorder: 'border-slate-100', darkBg: 'bg-slate-900' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', lightBg: 'bg-indigo-50', lightText: 'text-indigo-700', lightBorder: 'border-indigo-100', darkBg: 'bg-indigo-900' },
  };

  const getColor = (color: string = 'emerald') => colorMap[color] || colorMap.emerald;

  const handleUpdateImage = (key: string, url: string) => {
    const newOverrides = { ...imageOverrides, [key]: url };
    setImageOverrides(newOverrides);
    localStorage.setItem('jaragua_img_overrides', JSON.stringify(newOverrides));
  };

  const handleUpdateRule = (key: string, rule: string) => {
    const newOverrides = { ...ruleOverrides, [key]: rule };
    setRuleOverrides(newOverrides);
    localStorage.setItem('jaragua_rule_overrides', JSON.stringify(newOverrides));
  };

  const handleUpdateDiscount = (key: string, discount: string) => {
    const newOverrides = { ...discountOverrides, [key]: discount };
    setDiscountOverrides(newOverrides);
    localStorage.setItem('jaragua_discount_overrides', JSON.stringify(newOverrides));
  };

  const handleAdminLogin = () => {
    if (adminLogin === 'adm' && adminPass === 'caralho87') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const validateCpf = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (!!cpf.match(/(\d)\1{10}/)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleOpenPromo = (promo: any) => {
    setSelectedPromo(promo);
    setShowCpfModal(true);
    setError('');
    setCpfInput('');
  };

  const checkAlreadyClaimed = (cpf: string, storeTitle: string) => {
    const claims = JSON.parse(localStorage.getItem('jaragua_claims') || '[]');
    return claims.some((c: any) => c.cpf === cpf && c.store === storeTitle);
  };

  const saveClaim = (cpf: string, storeTitle: string) => {
    const claims = JSON.parse(localStorage.getItem('jaragua_claims') || '[]');
    claims.push({ cpf, store: storeTitle, date: new Date().toISOString() });
    localStorage.setItem('jaragua_claims', JSON.stringify(claims));
  };

  const handleGenerateVoucher = () => {
    const rawCpf = cpfInput.replace(/\D/g, '');
    if (!validateCpf(rawCpf)) {
      setError('CPF inválido. Verifique os números.');
      return;
    }
    if (checkAlreadyClaimed(rawCpf, selectedPromo!.title)) {
      setError('Este CPF já resgatou um voucher para este estabelecimento.');
      return;
    }
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newVoucher: Voucher = {
      storeName: selectedPromo!.title,
      discount: selectedPromo!.discount,
      code: `${selectedPromo!.code}-${suffix}`,
      cpf: formatCpf(rawCpf),
      date: new Date().toLocaleDateString('pt-BR'),
      color: selectedPromo!.color,
      rules: selectedPromo!.rules
    };
    saveClaim(rawCpf, selectedPromo!.title);
    setGeneratedVoucher(newVoucher);
    setShowCpfModal(false);
  };

  const renderHome = () => (
    <>
      <header className="relative h-[450px] flex items-end pb-16 text-white overflow-hidden">
        <img src={getImg('home_hero')} alt="Jaraguá do Sul" className="absolute inset-0 w-full h-full object-cover brightness-[0.5] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 max-w-5xl">
          <span className="bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-lg">Oferta do Dia</span>
          <h1 className="text-4xl md:text-7xl font-black mb-4 drop-shadow-2xl leading-tight">Sabores & <br/> Oportunidades.</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 font-medium max-w-xl">A maior plataforma de descontos exclusivos de Jaraguá do Sul. Explore as melhores ofertas da cidade em um só lugar.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveView('comercio')} className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-black shadow-2xl active:scale-95 transition-all">EXPLORAR OFERTAS</button>
            <button onClick={() => setActiveView('cupons')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-2xl active:scale-95 transition-all">CUPONS MAIS LIDOS</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-8 relative z-20 mb-24 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <CategoryQuickLink icon="fas fa-utensils" label="Gastronomia" color="bg-rose-500" onClick={() => setActiveView('gastronomia')} />
          <CategoryQuickLink icon="fas fa-shopping-bag" label="Comércio" color="bg-amber-500" onClick={() => setActiveView('comercio')} />
          <CategoryQuickLink icon="fas fa-smile" label="Lazer" color="bg-purple-500" onClick={() => setActiveView('lazer')} />
          <CategoryQuickLink icon="fas fa-car" label="Motoristas" color="bg-indigo-500" onClick={() => setActiveView('motoristas')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <h2 className="text-2xl font-black flex items-center gap-3"><span className="w-2 h-8 bg-emerald-600 rounded-full"></span>Ofertas em Destaque</h2>
            <PromoBanner title="Lojas Xangai" location="Barra do Rio Cerro" discount={getDiscount('xangai')} rules={getRule('xangai')} badge="TUDO PARA SUA CASA" code="XANGAI10" color="rose" img={getImg('xangai_promo')} onRedeem={() => handleOpenPromo({title: 'Lojas Xangai', discount: getDiscount('xangai'), code: 'XANGAI10', color: 'rose', rules: getRule('xangai')})} />
            <PromoBanner title="Kart Indoor" location="Shopping Partage" discount={getDiscount('kart')} rules={getRule('kart')} badge="ADRENALINA" code="KARTJGS" color="purple" img={getImg('kart_promo')} onRedeem={() => handleOpenPromo({title: 'Kart Indoor', discount: getDiscount('kart'), code: 'KARTJGS', color: 'purple', rules: getRule('kart')})} />
            <PromoBanner title="Mestre do Frango" location="Nova Brasília" discount={getDiscount('mestre')} rules={getRule('mestre')} badge="O MAIS PEDIDO" code="MESTRE10" color="emerald" img={getImg('mestre_promo')} onRedeem={() => handleOpenPromo({title: 'Mestre do Frango', discount: getDiscount('mestre'), code: 'MESTRE10', color: 'emerald', rules: getRule('mestre')})} />
          </div>
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl">
                <h3 className="font-black text-xl mb-2">Precisa de Ajuda?</h3>
                <p className="text-slate-400 text-sm mb-4">Nosso assistente conhece tudo de Jaraguá do Sul e pode te recomendar os melhores lugares.</p>
                <div className="h-[400px]"><ChatInterface /></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );

  const renderView = () => {
    switch(activeView) {
      case 'gastronomia': return (
        <section className="py-12 px-6 min-h-screen bg-white mb-20">
          <div className="container mx-auto max-w-4xl">
            <button onClick={() => setActiveView('home')} className="mb-6 font-black text-rose-600 flex items-center gap-2"><i className="fas fa-arrow-left"></i> VOLTAR</button>
            <h2 className="text-4xl font-black mb-2 text-slate-900">Gastronomia Jaraguá</h2>
            <p className="text-slate-500 font-medium mb-12">Os melhores sabores de Jaraguá com descontos que cabem no bolso.</p>
            <div className="space-y-8">
              <PromoBanner title="Mestre do Frango" location="Nova Brasília" discount={getDiscount('mestre')} rules={getRule('mestre')} code="MESTRE10" color="rose" badge="SUGESTÃO DA CASA" img={getImg('mestre_promo')} onRedeem={() => handleOpenPromo({title: 'Mestre do Frango', discount: getDiscount('mestre'), code: 'MESTRE10', color: 'rose', rules: getRule('mestre')})} />
              <PromoBanner title="Sr Chefão Salgados" location="Barra do Rio Cerro" discount={getDiscount('chefao')} rules={getRule('chefao')} code="CHEFAOJS" color="amber" badge="O MELHOR SALGADO" img={getImg('chefao_promo')} onRedeem={() => handleOpenPromo({title: 'Sr Chefão Salgados', discount: getDiscount('chefao'), code: 'CHEFAOJS', color: 'amber', rules: getRule('chefao')})} />
              <PromoBanner title="Divina´s Pizzaria" location="Vila Nova" discount={getDiscount('divinas')} rules={getRule('divinas')} code="DIVINA20" color="orange" badge="PIZZA ARTESANAL" img={getImg('divinas_promo')} onRedeem={() => handleOpenPromo({title: 'Divina´s Pizzaria', discount: getDiscount('divinas'), code: 'DIVINA20', color: 'orange', rules: getRule('divinas')})} />
            </div>
          </div>
        </section>
      );
      case 'motoristas': return (
        <section className="py-12 px-6 min-h-screen bg-slate-50 mb-20">
          <div className="container mx-auto max-w-5xl">
            <button onClick={() => setActiveView('home')} className="mb-6 font-black text-indigo-600 flex items-center gap-2"><i className="fas fa-arrow-left"></i> VOLTAR</button>
            <h2 className="text-4xl font-black mb-2 text-slate-900">Motoristas Premium</h2>
            <p className="text-slate-500 font-medium mb-12">Segurança e conforto para suas viagens em Jaraguá e aeroportos regionais.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DriverCard name="Cássio Kenji" specialty="Viagens Regionais / Aeroportos" vehicle="BYD Dolphin Mini 2026 (Elétrico)" rating="5.0" phone="5547992764350" verified img={getImg('cassio_photo')} />
              <DriverCard name="Jaraguá Executive" specialty="Transporte Executivo / Luxo" vehicle="Sedan Luxo Preto" rating="5.0" phone="5547999999999" verified promo="Cupom EXEC5 Ativo!" />
              <DriverCard name="VIP Drivers JGS" specialty="Eventos e Noturno" vehicle="SUV Premium" rating="4.9" phone="5547888888888" verified />
              <DriverCard name="Moove Jaraguá" specialty="Viagens de Curta Distância" vehicle="Compacto Confort" rating="4.8" phone="5547777777777" verified />
            </div>
          </div>
        </section>
      );
      case 'lazer': return (
        <section className="py-12 px-6 min-h-screen bg-white mb-20">
          <div className="container mx-auto max-w-4xl">
            <button onClick={() => setActiveView('home')} className="mb-6 font-black text-purple-600 flex items-center gap-2"><i className="fas fa-arrow-left"></i> VOLTAR</button>
            <h2 className="text-4xl font-black mb-2 text-center">Lazer & Entretenimento</h2>
            <p className="text-slate-500 font-medium mb-12 text-center">Aproveite o melhor de Jaraguá com diversão garantida e benefícios exclusivos.</p>
            <div className="grid grid-cols-1 gap-8">
              <PromoBanner title="Kart Indoor" location="Shopping Partage" discount={getDiscount('kart')} rules={getRule('kart')} code="KARTJGS" color="purple" badge="MAIS ADRENALINA" img={getImg('kart_promo')} onRedeem={() => handleOpenPromo({title: 'Kart Indoor', discount: getDiscount('kart'), code: 'KARTJGS', color: 'purple', rules: getRule('kart')})} />
              <PromoBanner title="Schützenfest 2026" location="Parque de Eventos" discount={getDiscount('schutzen')} rules={getRule('schutzen')} code="SCHUTZEN" color="slate" badge="EM BREVE" img={getImg('schutzen_promo')} onRedeem={() => {}} />
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-center"><i className="fas fa-calendar-plus text-4xl text-slate-300 mb-4"></i><p className="text-slate-400 font-bold">Novas opções de lazer sendo cadastradas!</p></div>
            </div>
          </div>
        </section>
      );
      case 'comercio': return (
        <section className="py-12 px-6 min-h-screen bg-slate-50 mb-20">
          <div className="container mx-auto max-w-6xl">
            <button onClick={() => setActiveView('home')} className="mb-6 font-black text-amber-600 flex items-center gap-2"><i className="fas fa-arrow-left"></i> VOLTAR</button>
            <h2 className="text-4xl font-black mb-2 text-slate-900">Comércio Local</h2>
            <p className="text-slate-500 font-medium mb-12">Apoie as lojas da nossa cidade e economize em suas compras.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PromoCard title="Lojas Xangai" location="Barra do Rio Cerro" discount={getDiscount('xangai')} rules={getRule('xangai')} code="XANGAI10" color="rose" onRedeem={() => handleOpenPromo({title: 'Lojas Xangai', discount: getDiscount('xangai'), code: 'XANGAI10', color: 'rose', rules: getRule('xangai')})} />
              <PromoCard title="Moda Jaraguá" discount={getDiscount('moda')} rules={getRule('moda')} code="MODA15" color="amber" onRedeem={() => handleOpenPromo({title: 'Moda Jaraguá', discount: getDiscount('moda'), code: 'MODA15', color: 'amber', rules: getRule('moda')})} />
              <PromoCard title="Eletrônicos JGS" discount={getDiscount('tech')} rules={getRule('tech')} code="TECH50" color="blue" onRedeem={() => handleOpenPromo({title: 'Eletrônicos JGS', discount: getDiscount('tech'), code: 'TECH50', color: 'blue', rules: getRule('tech')})} />
              <PromoCard title="Pet Shop Amigão" discount={getDiscount('pet')} rules={getRule('pet')} code="PETVIP" color="emerald" onRedeem={() => handleOpenPromo({title: 'Pet Shop Amigão', discount: getDiscount('pet'), code: 'PETVIP', color: 'emerald', rules: getRule('pet')})} />
            </div>
          </div>
        </section>
      );
      case 'cupons': return (
        <section className="py-12 px-6 min-h-screen bg-white mb-20">
          <div className="container mx-auto max-w-5xl">
            <button onClick={() => setActiveView('home')} className="mb-6 font-black text-emerald-600 flex items-center gap-2"><i className="fas fa-arrow-left"></i> VOLTAR</button>
            <h2 className="text-4xl font-black mb-8">Todos os Cupons Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PromoCard title="Kart Indoor" location="Shopping Partage" discount={getDiscount('kart')} rules={getRule('kart')} code="KARTJGS" color="purple" onRedeem={() => handleOpenPromo({title: 'Kart Indoor', discount: getDiscount('kart'), code: 'KARTJGS', color: 'purple', rules: getRule('kart')})} />
              <PromoCard title="Lojas Xangai" location="Barra do Rio Cerro" discount={getDiscount('xangai')} rules={getRule('xangai')} code="XANGAI10" color="rose" onRedeem={() => handleOpenPromo({title: 'Lojas Xangai', discount: getDiscount('xangai'), code: 'XANGAI10', color: 'rose', rules: getRule('xangai')})} />
              <PromoCard title="Hotel Kayros" discount={getDiscount('kayros')} rules={getRule('kayros')} code="KAYROSVIP" color="blue" onRedeem={() => handleOpenPromo({title: 'Hotel Kayros', discount: getDiscount('kayros'), code: 'KAYROSVIP', color: 'blue', rules: getRule('kayros')})} />
              <PromoCard title="Mestre do Frango" discount={getDiscount('mestre')} rules={getRule('mestre')} code="MESTRE10" color="rose" onRedeem={() => handleOpenPromo({title: 'Mestre do Frango', discount: getDiscount('mestre'), code: 'MESTRE10', color: 'rose', rules: getRule('mestre')})} />
              <PromoCard title="Barra Parque Hotel" discount={getDiscount('barra')} rules={getRule('barra')} code="BARRA10" color="slate" onRedeem={() => handleOpenPromo({title: 'Barra Parque Hotel', discount: getDiscount('barra'), code: 'BARRA10', color: 'slate', rules: getRule('barra')})} />
            </div>
          </div>
        </section>
      );
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-slate-100 py-4 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2 font-black text-2xl cursor-pointer tracking-tighter" onClick={() => setActiveView('home')}><span className="text-emerald-600">JARAGUÁ</span>DESCONTOS</div>
          <div className="flex gap-8 text-sm font-black text-slate-600 uppercase tracking-widest">
            <button onClick={() => setActiveView('home')} className={`hover:text-emerald-600 transition-colors ${activeView === 'home' ? 'text-emerald-600' : ''}`}>Início</button>
            <button onClick={() => setActiveView('gastronomia')} className={`hover:text-emerald-600 transition-colors ${activeView === 'gastronomia' ? 'text-emerald-600' : ''}`}>Gastronomia</button>
            <button onClick={() => setActiveView('comercio')} className={`hover:text-emerald-600 transition-colors ${activeView === 'comercio' ? 'text-emerald-600' : ''}`}>Comércio</button>
            <button onClick={() => setActiveView('lazer')} className={`hover:text-emerald-600 transition-colors ${activeView === 'lazer' ? 'text-emerald-600' : ''}`}>Lazer</button>
            <button onClick={() => setActiveView('motoristas')} className={`hover:text-emerald-600 transition-colors ${activeView === 'motoristas' ? 'text-emerald-600' : ''}`}>Motoristas</button>
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Anunciar</button>
        </div>
      </nav>

      <div className="flex-1">{renderView()}</div>

      {/* Footer Desktop */}
      <footer className="hidden lg:block py-16 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 Jaraguá Descontos - O Guia Oficial da Economia</div>
            <div className="flex flex-col gap-1 items-start">
              <div className="text-[8px] font-bold text-slate-400 uppercase">Desenvolvido para fortalecer o comércio de Jaraguá do Sul.</div>
              {/* CADEADO ADMINISTRATIVO DESKTOP - Posicionado discretamente abaixo da frase acima */}
              <button 
                onClick={() => setShowAdminLogin(true)} 
                className="opacity-[0.03] hover:opacity-100 transition-all p-1"
                title="Acesso Administrativo"
              >
                <i className="fas fa-lock text-slate-900 text-[8px]"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button for Mobile */}
      <div className="lg:hidden fixed bottom-24 right-6 z-[60]">
        <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-90 border-4 border-white transition-all"><i className="fas fa-robot"></i></button>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b flex items-center justify-between bg-slate-900 text-white"><span className="font-bold uppercase tracking-widest text-xs">Guia Inteligente Jaraguá</span><button onClick={() => setIsChatOpen(false)} className="w-10 h-10"><i className="fas fa-times"></i></button></div>
          <div className="flex-1 overflow-hidden"><ChatInterface /></div>
        </div>
      )}

      {/* Admin Modals */}
      {showAdminLogin && !isAdminLoggedIn && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-black mb-6 text-center text-slate-900">Acesso ADM</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Login" value={adminLogin} onChange={e => setAdminLogin(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl focus:outline-none border-2 border-transparent focus:border-slate-300" />
              <input type="password" placeholder="Senha" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl focus:outline-none border-2 border-transparent focus:border-slate-300" />
              <button onClick={handleAdminLogin} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl">ENTRAR</button>
              <button onClick={() => setShowAdminLogin(false)} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isAdminLoggedIn && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black">Painel Administrativo</h3><button onClick={() => setIsAdminLoggedIn(false)} className="text-slate-400 hover:text-slate-900"><i className="fas fa-times text-xl"></i></button></div>
            <div className="space-y-12 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide">
              <section><h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2">Configurações de Parceiros (Valores & Regras)</h4><div className="space-y-10">{Object.keys(DEFAULT_DISCOUNTS).map((key) => (<div key={key} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4"><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{key}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor do Desconto / Porcentagem</label><input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" value={discountOverrides[key] || DEFAULT_DISCOUNTS[key as keyof typeof DEFAULT_DISCOUNTS]} onChange={(e) => handleUpdateDiscount(key, e.target.value)} /></div><div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regra de Uso do Voucher</label><input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" value={ruleOverrides[key] || DEFAULT_RULES[key as keyof typeof DEFAULT_RULES]} onChange={(e) => handleUpdateRule(key, e.target.value)} /></div></div></div>))}</div></section>
              <section><h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2">Gerenciamento de Imagens</h4><div className="space-y-6">{Object.keys(DEFAULT_IMAGES).map((key) => (<div key={key} className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.replace('_', ' ')}</label><div className="flex gap-4 items-center"><img src={getImg(key as any)} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt="Preview" /><input type="text" placeholder="URL da Imagem..." className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500" value={imageOverrides[key] || ''} onChange={(e) => handleUpdateImage(key, e.target.value)} /></div></div>))}</div></section>
            </div>
            <button onClick={() => setIsAdminLoggedIn(false)} className="w-full mt-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl">SALVAR E FINALIZAR</button>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-[50] py-3 px-6 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-bottom lg:hidden">
        <BottomNavItem icon="fas fa-home" label="Início" active={activeView === 'home'} onClick={() => setActiveView('home')} />
        <BottomNavItem icon="fas fa-utensils" label="Gastronomia" active={activeView === 'gastronomia'} onClick={() => setActiveView('gastronomia')} />
        <BottomNavItem icon="fas fa-shopping-bag" label="Comércio" active={activeView === 'comercio'} onClick={() => setActiveView('comercio')} adminTrigger={() => setShowAdminLogin(true)} />
        <BottomNavItem icon="fas fa-smile" label="Lazer" active={activeView === 'lazer'} onClick={() => setActiveView('lazer')} />
        <BottomNavItem icon="fas fa-car" label="Motoristas" active={activeView === 'motoristas'} onClick={() => setActiveView('motoristas')} />
      </nav>

      {/* Voucher Generation Modal */}
      {showCpfModal && selectedPromo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className={`p-10 ${getColor(selectedPromo.color).bg} text-white text-center`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"><i className="fas fa-id-card text-2xl"></i></div>
              <h3 className="text-2xl font-black mb-1">Resgate Imediato</h3>
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest">Apenas 1 voucher por CPF</p>
            </div>
            <div className="p-10">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Confirme seu CPF para validar</label>
              <input type="tel" value={cpfInput} onChange={(e) => setCpfInput(formatCpf(e.target.value))} placeholder="000.000.000-00" className={`w-full text-3xl font-mono text-center border-b-4 py-3 focus:outline-none ${error ? 'border-rose-500 text-rose-500' : 'border-slate-100 focus:border-emerald-500 text-slate-800'}`} />
              {error && <p className="text-rose-500 text-[10px] mt-4 font-black text-center">{error}</p>}
              <button onClick={handleGenerateVoucher} className={`w-full mt-10 py-5 rounded-3xl font-black text-white shadow-xl ${getColor(selectedPromo.color).bg}`}>GERAR MEU VOUCHER AGORA</button>
              <button onClick={() => setShowCpfModal(false)} className="w-full mt-6 py-2 text-slate-400 font-black text-[10px] uppercase">Talvez mais tarde</button>
            </div>
          </div>
        </div>
      )}

      {/* Final Voucher Display */}
      {generatedVoucher && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/95 animate-in zoom-in duration-300">
          <div className="w-full max-sm flex flex-col gap-6">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className={`h-6 ${getColor(generatedVoucher.color).bg}`}></div>
              <div className="p-10 pb-6 text-center border-b-2 border-dashed border-slate-100 relative">
                <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-slate-900 rounded-full"></div>
                <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-slate-900 rounded-full"></div>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">Voucher Oficial Jaraguá</h4>
                <p className="text-slate-400 text-xs font-black uppercase mb-1">{generatedVoucher.storeName}</p>
                <div className="text-5xl font-black text-slate-900 mb-4">{generatedVoucher.discount}</div>
                <div className={`inline-block px-5 py-2 rounded-full text-[10px] font-black ${getColor(generatedVoucher.color).lightBg} ${getColor(generatedVoucher.color).lightText} uppercase tracking-widest`}>Apresente na Loja</div>
              </div>
              <div className="p-10 pt-8 space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CÓDIGO DE SEGURANÇA</span><span className="text-3xl font-mono font-black text-slate-800 tracking-widest">{generatedVoucher.code}</span></div>
                {generatedVoucher.rules && (<div className="text-center bg-amber-50 p-4 rounded-2xl border border-amber-100"><p className="text-[11px] text-amber-900 font-bold italic leading-relaxed">{generatedVoucher.rules}</p></div>)}
                <div className="flex justify-between items-center px-2 border-b border-slate-100 pb-6"><div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">CPF PORTADOR</span><span className="text-sm font-bold text-slate-700">{generatedVoucher.cpf}</span></div><div className="text-right"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">EMISSÃO</span><span className="text-sm font-bold text-slate-700">{generatedVoucher.date}</span></div></div>
                <div className="space-y-4"><p className="text-[9px] text-slate-400 text-center leading-relaxed font-bold uppercase tracking-tight">*Válido apenas com documento original com CPF.</p><div className="bg-rose-50 p-3 rounded-xl border border-rose-100"><p className="text-[8px] text-rose-800 text-center font-black uppercase tracking-tighter leading-tight">O voucher é limitado, pois a loja decide sem avisar quando acaba o desconto.</p></div></div>
                <div className="pt-2 flex justify-center opacity-10"><i className="fas fa-qrcode text-6xl"></i></div>
              </div>
            </div>
            <button onClick={() => setGeneratedVoucher(null)} className="w-full bg-white text-slate-900 py-5 rounded-[2rem] font-black shadow-xl text-sm uppercase tracking-widest">SALVAR E FECHAR</button>
            <p className="text-center text-white/40 text-[10px] font-black uppercase tracking-widest">Tire um print desta tela agora!</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryQuickLink: React.FC<{ icon: string, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50 flex flex-col items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group w-full"><div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}><i className={icon}></i></div><span className="text-xs font-black text-slate-700 uppercase tracking-widest">{label}</span></button>
);

const DriverCard: React.FC<{ name: string, specialty: string, vehicle: string, rating: string, phone: string, verified?: boolean, promo?: string, img?: string }> = ({ name, specialty, vehicle, rating, phone, verified, promo, img }) => (
  <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-50 flex flex-col gap-6 relative group overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-all"></div>{verified && <div className="absolute top-6 right-6 bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2"><i className="fas fa-check-circle"></i> VERIFICADO</div>}<div className="flex items-center gap-6 relative z-10"><div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl text-slate-300 overflow-hidden shadow-inner">{img ? <img src={img} className="w-full h-full object-cover" alt={name} /> : <i className="fas fa-user-tie"></i>}</div><div><h3 className="text-xl font-black text-slate-900 leading-tight">{name}</h3><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{specialty}</p><div className="flex items-center gap-1.5 text-amber-500 text-sm font-black mt-2"><i className="fas fa-star"></i> {rating}</div></div></div><div className="bg-slate-50 p-6 rounded-3xl space-y-3 relative z-10 border border-slate-100"><div className="flex justify-between items-center text-[11px]"><span className="text-slate-400 font-black uppercase tracking-widest">Veículo</span><span className="text-slate-800 font-black">{vehicle}</span></div>{promo && (<div className="flex justify-between items-center text-[11px] pt-3 border-t border-slate-200/50"><span className="text-indigo-500 font-black uppercase tracking-widest">Oferta</span><span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[9px] font-black">{promo}</span></div>)}</div><a href={`https://wa.me/${phone}?text=Olá! Vi seu perfil premium no Jaraguá Descontos e gostaria de solicitar uma viagem.`} target="_blank" className="w-full bg-slate-900 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-center shadow-xl active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"><i className="fab fa-whatsapp text-lg"></i> Agendar Agora</a></div>
);

const PromoBanner: React.FC<{title: string, location: string, discount: string, rules?: string, badge?: string, code: string, color: string, img: string, onRedeem: () => void}> = ({title, location, discount, rules, badge, color, img, onRedeem}) => {
  const colorMap: Record<string, string> = {
    rose: 'bg-rose-600 text-rose-600',
    purple: 'bg-purple-600 text-purple-600',
    emerald: 'bg-emerald-600 text-emerald-600',
    amber: 'bg-amber-600 text-amber-600',
    orange: 'bg-orange-600 text-orange-600',
    blue: 'bg-blue-600 text-blue-600',
    slate: 'bg-slate-600 text-slate-600',
    indigo: 'bg-indigo-600 text-indigo-600',
  };
  
  const bgClass = colorMap[color]?.split(' ')[0] || 'bg-emerald-600';
  const textClass = colorMap[color]?.split(' ')[1] || 'text-emerald-600';

  return (
    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-50 flex flex-col md:flex-row group transition-all hover:shadow-2xl">
      <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
        {badge && <div className={`absolute top-6 left-6 ${bgClass} text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg`}>{badge}</div>}
      </div>
      <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
        <div>
          <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight">{title}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <i className="fas fa-map-marker-alt text-rose-500"></i> {location}
          </p>
        </div>
        <div className={`text-3xl font-black ${textClass} mb-2`}>{discount}</div>
        {rules && <p className="text-[10px] text-slate-400 font-bold mb-8 italic">{rules}</p>}
        <div className="flex flex-wrap gap-4">
          <button onClick={onRedeem} className={`${bgClass} text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase shadow-xl active:scale-95 transition-all hover:brightness-110`}>
            PEGAR CUPOM GRATUITO
          </button>
        </div>
      </div>
    </div>
  );
};

const PromoCard: React.FC<{title: string, location?: string, discount: string, rules?: string, code: string, color: string, onRedeem: () => void}> = ({title, location, discount, rules, code, color, onRedeem}) => {
  const colorMap: Record<string, string> = {
    rose: 'bg-rose-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    orange: 'bg-orange-600',
    blue: 'bg-blue-600',
    slate: 'bg-slate-600',
    indigo: 'bg-indigo-600',
  };
  
  const bgClass = colorMap[color] || 'bg-emerald-600';

  return (
    <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-lg flex flex-col gap-6 relative overflow-hidden group hover:shadow-2xl transition-all">
      <div className={`absolute top-0 right-0 ${bgClass} text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase`}>{discount}</div>
      <div className="mt-4">
        <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{location ? location : 'Loja Verificada'}</p>
      </div>
      <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
        <span className="text-[10px] font-black text-slate-300 uppercase block mb-2">Base do Voucher</span>
        <span className="text-2xl font-mono font-black text-slate-800">{code}</span>
        {rules && <p className="text-[9px] text-slate-400 mt-2 italic">{rules}</p>}
      </div>
      <button onClick={onRedeem} className={`${bgClass} text-white py-5 rounded-[2rem] font-black text-xs uppercase active:scale-95 transition-all shadow-md`}>
        QUERO DESCONTO
      </button>
    </div>
  );
};

const BottomNavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void; adminTrigger?: () => void }> = ({ icon, label, active, onClick, adminTrigger }) => (
  <div className="relative flex-1 flex flex-col items-center">
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all active:scale-75 ${active ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-transparent text-slate-400'}`}><i className={`${icon} text-lg`}></i></div>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
    {adminTrigger && (<button onClick={(e) => { e.stopPropagation(); adminTrigger(); }} className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 opacity-[0.05] hover:opacity-100 transition-opacity"><i className="fas fa-lock text-[6px]"></i></button>)}
  </div>
);

export default App;