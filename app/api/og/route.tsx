import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros da URL
    const title = searchParams.get('title') || 'Relusa - Lavagem Automóvel a Seco';
    const description = searchParams.get('description') || 'O seu carro não recusa';
    const mode = searchParams.get('mode') || 'light';
    
    // Cores baseadas no modo (claro/escuro)
    const bgColor = mode === 'dark' ? '#1f2937' : '#ffffff';
    const textColor = mode === 'dark' ? '#ffffff' : '#111827';
    const accentColor = '#0ea5e9'; // Cor primária do site
    const accentGradient = `linear-gradient(90deg, ${accentColor} 0%, #34d399 100%)`;
    
    // Gerar a imagem OG
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            padding: 50,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fundo com padrão */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: mode === 'dark' 
                ? `radial-gradient(circle at 25% 25%, ${accentColor}20 0%, transparent 50%),
                   radial-gradient(circle at 75% 75%, ${accentColor}15 0%, transparent 50%)`
                : `radial-gradient(circle at 25% 25%, ${accentColor}10 0%, transparent 50%),
                   radial-gradient(circle at 75% 75%, ${accentColor}05 0%, transparent 50%)`,
              zIndex: 0,
            }}
          />
          
          {/* Borda decorativa */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
              border: `2px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: 12,
              zIndex: 0,
            }}
          />
          
          {/* Conteúdo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              height: '100%',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
                padding: '12px 24px',
                borderRadius: 8,
                background: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: accentColor,
                  letterSpacing: '-0.05em',
                }}
              >
                RELUSA
              </div>
            </div>
            
            {/* Título */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: textColor,
                marginBottom: 24,
                maxWidth: '80%',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            
            {/* Linha decorativa */}
            <div
              style={{
                width: '120px',
                height: '4px',
                background: accentGradient,
                marginBottom: 24,
                borderRadius: '2px',
              }}
            />
            
            {/* Descrição */}
            <div
              style={{
                fontSize: 24,
                color: mode === 'dark' ? '#d1d5db' : '#4b5563',
                maxWidth: '70%',
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
            
            {/* Rodapé */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 24px',
                borderRadius: 24,
                background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: accentColor,
                }}
              >
                www.relusa.pt
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new Response('Falha ao gerar a imagem OG', { status: 500 });
  }
}