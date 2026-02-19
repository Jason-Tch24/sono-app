'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Service } from '@/lib/supabase'

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/')
        return
      }
      setUser(currentUser)
      await loadServices(currentUser.id)
    }
    init()
  }, [])

  const loadServices = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(50)

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      console.error('Erreur chargement services:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewService = async () => {
    if (!user) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('services')
        .insert({ date: today, user_id: user.id, status: 'en_cours' })
        .select()
        .single()

      if (error) throw error
      if (data) router.push(`/service/${data.id}`)
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const activeServices = services.filter(s => s.status === 'en_cours')
  const completedServices = services.filter(s => s.status === 'termine')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</span>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Header */}
      <header className="glass-strong" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>
              🎵
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Sono Église
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Total services</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>{services.length}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>En cours</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fbbf24' }}>{activeServices.length}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Terminés</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#34d399' }}>{completedServices.length}</div>
          </div>
        </div>

        {/* New service button */}
        <button
          onClick={createNewService}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '14px',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span>
          Nouveau Service
        </button>

        {/* Services list */}
        <div>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Mon historique
          </h2>

          {services.length === 0 ? (
            <div className="card" style={{
              padding: '48px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎤</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Aucun service enregistré</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Appuyez sur "Nouveau Service" pour commencer</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="card animate-slide-up"
                  style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                  }}
                  onClick={() => router.push(`/service/${service.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        textTransform: 'capitalize',
                      }}>
                        {new Date(service.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Créé le {new Date(service.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span className={`badge ${service.status === 'termine' ? 'badge-success' : 'badge-warning'}`}>
                        {service.status === 'termine' ? '✓ Terminé' : '● En cours'}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
