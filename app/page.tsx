'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Brain,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Instagram,
  ArrowRight,
  Shield,
  Award,
  ChevronDown,
  GraduationCap,
  Baby,
  Puzzle,
  CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f3e8ff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(168,85,247,0.3)'
              }}>
                <Brain style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '16px' }}>Gabriela Lacerda</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Psicóloga • CRP 09/19262</p>
              </div>
            </Link>

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <button onClick={() => scrollToSection('sobre')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '15px' }}>
                Sobre
              </button>
              <button onClick={() => scrollToSection('servicos')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '15px' }}>
                Serviços
              </button>
              <button onClick={() => scrollToSection('formacao')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '15px' }}>
                Formação
              </button>
              <button onClick={() => scrollToSection('contato')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '15px' }}>
                Contato
              </button>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/login" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>
                Portal
              </Link>
              <Link
                href="https://wa.me/5564999380033"
                target="_blank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(168,85,247,0.3)'
                }}
              >
                <Calendar style={{ width: '16px', height: '16px' }} />
                Agendar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Content */}
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '24px'
              }}>
                <Puzzle style={{ width: '16px', height: '16px' }} />
                Especialista em TEA e Neurodesenvolvimento
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: '56px',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.1,
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                Cuidado especializado para o{' '}
                <span style={{ color: '#a855f7' }}>desenvolvimento</span>{' '}
                do seu filho
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '20px',
                color: '#64748b',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '500px'
              }}>
                Psicóloga especializada em <strong style={{ color: '#1e293b' }}>Análise do Comportamento Aplicada (ABA)</strong> para crianças e adolescentes com TEA e outros transtornos do neurodesenvolvimento.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
                <Link
                  href="https://wa.me/5564999380033"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '18px',
                    boxShadow: '0 8px 24px rgba(168,85,247,0.35)'
                  }}
                >
                  <Calendar style={{ width: '20px', height: '20px' }} />
                  Agendar Avaliação
                </Link>
                <button
                  onClick={() => scrollToSection('sobre')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px',
                    backgroundColor: 'white',
                    color: '#475569',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  Conhecer mais
                  <ArrowRight style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', gap: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield style={{ width: '24px', height: '24px', color: '#10b981' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>CRP 09/19262</p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Regulamentada</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#f3e8ff',
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent: 'center'
                  }}>
                    <Baby style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Crianças e Adolescentes</p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Especializada</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #c084fc, #a855f7)',
                borderRadius: '24px',
                transform: 'rotate(3deg) scale(0.95)',
                opacity: 0.2
              }} />
              <div style={{
                position: 'relative',
                aspectRatio: '4/5',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                border: '4px solid white'
              }}>
                <Image
                  src="/foto-perfil.jpg"
                  alt="Gabriela Fernandes Lacerda - Psicóloga"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          <button
            onClick={() => scrollToSection('sobre')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Role para ver mais</span>
            <ChevronDown style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-16px',
                background: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)',
                borderRadius: '20px',
                transform: 'rotate(-2deg)'
              }} />
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)'
              }}>
                <Image
                  src="/foto-palestra.jpg"
                  alt="Gabriela Lacerda palestrando"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p style={{ color: '#a855f7', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
                Sobre Mim
              </p>
              <h2 style={{ fontSize: '44px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginBottom: '24px' }}>
                Gabriela Fernandes Lacerda
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '18px', color: '#64748b', lineHeight: 1.7 }}>
                <p style={{ margin: 0 }}>
                  Sou psicóloga clínica com formação pela <strong style={{ color: '#1e293b' }}>UNITRI Uberlândia</strong>, especializada em
                  <strong style={{ color: '#1e293b' }}> Análise do Comportamento Aplicada (ABA)</strong> e <strong style={{ color: '#1e293b' }}>Neuropsicologia</strong>.
                </p>
                <p style={{ margin: 0 }}>
                  Atualmente atuo como <strong style={{ color: '#1e293b' }}>Coordenadora ABA</strong> da equipe de Psicologia no
                  Espaço Beija-Flor UNIMED, onde sou responsável pelo atendimento de crianças e
                  adolescentes com <strong style={{ color: '#1e293b' }}>TEA</strong> e outros transtornos do neurodesenvolvimento.
                </p>
                <p style={{ margin: 0 }}>
                  Minha abordagem é baseada em evidências científicas, com foco no desenvolvimento
                  de habilidades e na melhoria da qualidade de vida dos meus pacientes e suas famílias.
                </p>
              </div>

              {/* Credentials */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#faf5ff', borderRadius: '12px' }}>
                  <Award style={{ width: '32px', height: '32px', color: '#a855f7' }} />
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>CRP 09/19262</p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Conselho Regional de Psicologia</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#faf5ff', borderRadius: '12px' }}>
                  <GraduationCap style={{ width: '32px', height: '32px', color: '#a855f7' }} />
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>3 Pós-Graduações</p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>ABA e Neuropsicologia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" style={{ padding: '100px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
            <p style={{ color: '#a855f7', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
              Serviços
            </p>
            <h2 style={{ fontSize: '44px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginBottom: '16px' }}>
              Atendimento especializado
            </h2>
            <p style={{ fontSize: '18px', color: '#64748b' }}>
              Intervenções baseadas em evidências para crianças e adolescentes com transtornos do neurodesenvolvimento
            </p>
          </div>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              {
                icon: Puzzle,
                title: 'Intervenção ABA',
                description: 'Análise do Comportamento Aplicada para desenvolvimento de habilidades e redução de comportamentos desafiadores.',
                features: ['Baseada em evidências', 'Plano individualizado', 'Acompanhamento contínuo']
              },
              {
                icon: Brain,
                title: 'Avaliação Neuropsicológica',
                description: 'Avaliação completa das funções cognitivas e comportamentais para diagnóstico e planejamento.',
                features: ['Protocolos validados', 'VB-MAPP', 'Relatório detalhado']
              },
              {
                icon: Users,
                title: 'Orientação Parental',
                description: 'Capacitação para famílias aplicarem estratégias terapêuticas no dia a dia.',
                features: ['Treinamento prático', 'Suporte contínuo', 'Estratégias para casa']
              }
            ].map((service, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <service.icon style={{ width: '32px', height: '32px', color: '#a855f7' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>{service.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {service.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                      <CheckCircle style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAÇÃO */}
      <section id="formacao" style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
            <p style={{ color: '#a855f7', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
              Formação
            </p>
            <h2 style={{ fontSize: '44px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
              Qualificação profissional
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Formação Acadêmica */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GraduationCap style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                Formação Acadêmica
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { year: '2023', title: 'Graduação em Psicologia', institution: 'UNITRI Uberlândia' },
                  { year: '2024', title: 'Pós em Análise do Comportamento Aplicada', institution: 'Instituto Líbano' },
                  { year: '2025', title: 'Pós em Neuropsicologia', institution: 'Instituto Líbano' },
                  { year: '2026', title: 'Pós em ABA aplicada ao TEA', institution: 'PUC/Artmed (em andamento)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ width: '56px', fontSize: '14px', fontWeight: 700, color: '#a855f7', textAlign: 'center' }}>{item.year}</div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>{item.title}</p>
                      <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{item.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cursos */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                Cursos Complementares
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'ABA e autismo para profissionais', hours: '180h', instructor: 'Regina Bérgamo' },
                  { title: 'Protocolo VB-MAPP', hours: '80h', instructor: 'Regina Bérgamo' },
                  { title: 'Laboratório de intervenções ABA', hours: '240h', instructor: 'Ellen Tomaz' },
                  { title: 'Intensivo ABA', hours: '24h', instructor: 'Instituto Lorena Prudente' },
                  { title: 'Orientação parental no contexto TEA', hours: '30h', instructor: '' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 500, color: '#1e293b', margin: 0 }}>{item.title}</p>
                      {item.instructor && <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{item.instructor}</p>}
                    </div>
                    <span style={{ padding: '4px 12px', backgroundColor: '#f3e8ff', color: '#7c3aed', fontSize: '14px', fontWeight: 600, borderRadius: '9999px' }}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Galeria */}
          <div style={{ marginTop: '64px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '24px', textAlign: 'center' }}>Atuação Profissional</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Image src="/foto-grupo.jpg" alt="Equipe profissional" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Image src="/foto-certificados.jpg" alt="Certificação" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Image src="/foto-perfil-2.jpg" alt="Gabriela Lacerda" fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '44px', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '24px' }}>
            Vamos cuidar do desenvolvimento do seu filho?
          </h2>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 40px' }}>
            Entre em contato e agende uma avaliação. O primeiro passo para o desenvolvimento é o mais importante.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="https://wa.me/5564999380033"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                backgroundColor: 'white',
                color: '#7c3aed',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '18px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              <Phone style={{ width: '20px', height: '20px' }} />
              (64) 99938-0033
            </Link>
            <Link
              href="mailto:gabiflacerda.flg@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '18px',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Mail style={{ width: '20px', height: '20px' }} />
              Enviar E-mail
            </Link>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
            {/* Info */}
            <div>
              <p style={{ color: '#a855f7', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
                Contato
              </p>
              <h2 style={{ fontSize: '44px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2, marginBottom: '24px' }}>
                Vamos conversar?
              </h2>
              <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, marginBottom: '40px' }}>
                Entre em contato para agendar uma avaliação ou tirar dúvidas sobre o atendimento.
              </p>

              {/* Contact Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <a href="https://wa.me/5564999380033" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '12px', textDecoration: 'none', transition: 'background 0.2s' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>WhatsApp</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>(64) 99938-0033</p>
                  </div>
                </a>

                <a href="mailto:gabiflacerda.flg@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '12px', textDecoration: 'none' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>E-mail</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>gabiflacerda.flg@gmail.com</p>
                  </div>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin style={{ width: '24px', height: '24px', color: '#a855f7' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Localização</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Espaço Beija-Flor UNIMED</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div style={{ marginTop: '40px' }}>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Siga nas redes sociais</p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff' }}
                >
                  <Instagram style={{ width: '20px', height: '20px', color: '#a855f7' }} />
                </a>
              </div>
            </div>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'sticky', top: '100px', aspectRatio: '1', maxWidth: '400px', margin: '0 auto', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <Image
                  src="/foto-perfil-2.jpg"
                  alt="Gabriela Lacerda"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Gabriela Fernandes Lacerda</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Psicóloga • CRP 09/19262</p>
              </div>
            </div>

            {/* Copyright */}
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              © {new Date().getFullYear()} Todos os direitos reservados
            </p>

            {/* Links */}
            <Link href="/login" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
              Portal do Paciente
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
