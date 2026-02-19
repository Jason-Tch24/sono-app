'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import type { Service, ChecklistItem, ChecklistProgress, Remark, Incident } from '@/lib/supabase'

type Phase = 'before_service' | 'during_service' | 'after_service'

const PHASE_LABELS: Record<Phase, string> = {
  before_service: 'Avant le Culte',
  during_service: 'Pendant le Culte',
  after_service: 'Après le Culte',
}

const PHASE_ICONS: Record<Phase, string> = {
  before_service: '🎛️',
  during_service: '🎤',
  after_service: '🔌',
}

const INCIDENT_LABELS: Record<string, string> = {
  larsen: '🔊 Larsen',
  micro: '🎙️ Micro',
  hf: '📡 HF',
  autre: '⚠️ Autre',
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [currentPhase, setCurrentPhase] = useState<Phase>('before_service')
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [progress, setProgress] = useState<ChecklistProgress[]>([])
  const [remarks, setRemarks] = useState<Remark[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [newRemark, setNewRemark] = useState('')
  const [newIncident, setNewIncident] = useState({ type: 'autre' as const, description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServiceData()
  }, [serviceId])

  const loadServiceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: serviceData, error: serviceError } = await supabase
        .from('services').select('*').eq('id', serviceId).single()
      if (serviceError) throw serviceError
      if (serviceData.user_id !== user.id) { router.push('/dashboard'); return }
      setService(serviceData)

      const { data: itemsData } = await supabase
        .from('checklist_items').select('*').order('display_order')
      setChecklistItems(itemsData || [])

      const { data: progressData } = await supabase
        .from('checklist_progress').select('*').eq('service_id', serviceId)
      setProgress(progressData || [])

      const { data: remarksData } = await supabase
        .from('remarks').select('*').eq('service_id', serviceId).order('created_at', { ascending: false })
      setRemarks(remarksData || [])

      const { data: incidentsData } = await supabase
        .from('incidents').select('*').eq('service_id', serviceId).order('created_at', { ascending: false })
      setIncidents(incidentsData || [])
    } catch (err) {
      console.error('Erreur chargement:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleChecklistItem = async (itemId: string, currentlyChecked: boolean) => {
    try {
      const existingProgress = progress.find(p => p.checklist_item_id === itemId)
      if (existingProgress) {
        await supabase.from('checklist_progress')
          .update({ checked: !currentlyChecked, checked_at: !currentlyChecked ? new Date().toISOString() : null })
          .eq('id', existingProgress.id)
      } else {
        await supabase.from('checklist_progress')
          .insert({ service_id: serviceId, checklist_item_id: itemId, checked: true, checked_at: new Date().toISOString() })
      }
      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const addRemark = async () => {
    if (!newRemark.trim()) return
    try {
      await supabase.from('remarks').insert({ service_id: serviceId, phase: currentPhase, content: newRemark })
      setNewRemark('')
      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const addIncident = async () => {
    if (!newIncident.description.trim()) return
    try {
      await supabase.from('incidents').insert({ service_id: serviceId, type: newIncident.type, description: newIncident.description })
      setNewIncident({ type: 'autre', description: '' })
      await loadServiceData()
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  const finishService = async () => {
    if (!confirm('Voulez-vous terminer ce service ?')) return
    try {
      await supabase.from('services').update({ status: 'termine' }).eq('id', serviceId)
      router.push('/dashboard')
    } catch (err: any) {
      alert('Erreur: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement du service...</span>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <p style={{ color: 'var(--text-muted)' }}>Service introuvable</p>
        <button onClick={() => router.push('/dashboard')} className="btn-ghost">Retour au dashboard</button>
      </div>
    )
  }

  const currentPhaseItems = checklistItems.filter(item => item.phase === currentPhase)
  const currentPhaseProgress = currentPhaseItems.filter(item => {
    const p = progress.find(pr => pr.checklist_item_id === item.id)
    return p?.checked
  })
  const progressPercent = currentPhaseItems.length > 0
    ? Math.round((currentPhaseProgress.length / currentPhaseItems.length) * 100)
    : 0

  const totalItems = checklistItems.length
  const totalChecked = checklistItems.filter(item => {
    const p = progress.find(pr => pr.checklist_item_id === item.id)
    return p?.checked
  }).length
  const totalPercent = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0

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
          padding: '12px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-light)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                padding: '4px 0',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Dashboard
            </button>
            <span className={`badge ${service.status === 'termine' ? 'badge-success' : 'badge-warning'}`}>
              {service.status === 'termine' ? '✓ Terminé' : '● En cours'}
            </span>
          </div>
          <h1 style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginTop: '6px',
            textTransform: 'capitalize',
          }}>
            {new Date(service.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        {/* Overall progress */}
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Progression totale</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)' }}>{totalPercent}%</span>
          </div>
          <div style={{
            height: '8px',
            background: 'var(--bg-dark)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${totalPercent}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Phase tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px',
        }}>
          {(['before_service', 'during_service', 'after_service'] as Phase[]).map((phase) => (
            <button
              key={phase}
              onClick={() => setCurrentPhase(phase)}
              style={{
                flex: '1 0 auto',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                background: currentPhase === phase
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                  : 'var(--bg-card)',
                color: currentPhase === phase ? 'white' : 'var(--text-muted)',
                boxShadow: currentPhase === phase ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              {PHASE_ICONS[phase]} {PHASE_LABELS[phase]}
            </button>
          ))}
        </div>

        {/* Phase progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          padding: '0 4px',
        }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--bg-card)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: progressPercent === 100 ? 'var(--success)' : 'var(--primary)',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
            {currentPhaseProgress.length}/{currentPhaseItems.length}
          </span>
        </div>

        {/* Content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '16px',
        }}>
          {/* Checklist */}
          <div className="card" style={{ order: 1 }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{PHASE_ICONS[currentPhase]}</span>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {PHASE_LABELS[currentPhase]}
              </h2>
            </div>
            <div style={{ padding: '12px' }}>
              {currentPhaseItems.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Aucun item pour cette phase
                </div>
              ) : (
                currentPhaseItems.map((item) => {
                  const itemProgress = progress.find(p => p.checklist_item_id === item.id)
                  const isChecked = itemProgress?.checked || false
                  return (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        userSelect: 'none',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChecklistItem(item.id, isChecked)}
                        style={{ marginTop: '1px' }}
                      />
                      <span style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        transition: 'all 0.2s ease',
                      }}>
                        {item.label}
                      </span>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          {/* Right column: Remarks + Incidents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', order: 2 }}>
            {/* Remarks */}
            <div className="card">
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '1.1rem' }}>📝</span>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Remarques</h3>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <textarea
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Ajouter une remarque..."
                    className="input-field"
                    rows={3}
                  />
                  <button onClick={addRemark} className="btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }}>
                    Ajouter
                  </button>
                </div>
                <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {remarks.filter(r => r.phase === currentPhase).map((remark) => (
                    <div key={remark.id} style={{
                      padding: '12px 14px',
                      background: 'var(--bg-dark)',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        {new Date(remark.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {remark.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incidents */}
            <div className="card">
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Incidents</h3>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                    className="select-field"
                  >
                    <option value="larsen">🔊 Larsen</option>
                    <option value="micro">🎙️ Problème Micro</option>
                    <option value="hf">📡 Problème HF</option>
                    <option value="autre">⚠️ Autre</option>
                  </select>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    placeholder="Description de l'incident..."
                    className="input-field"
                    rows={2}
                  />
                  <button onClick={addIncident} className="btn-danger" style={{ padding: '10px', fontSize: '0.9rem' }}>
                    Signaler l&apos;incident
                  </button>
                </div>
                <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {incidents.map((incident) => (
                    <div key={incident.id} style={{
                      padding: '12px 14px',
                      background: 'rgba(239, 68, 68, 0.06)',
                      borderRadius: '10px',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                          {INCIDENT_LABELS[incident.type] || incident.type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(incident.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {incident.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Finish button */}
        {service.status === 'en_cours' && (
          <div style={{ marginTop: '32px', textAlign: 'center', paddingBottom: '40px' }}>
            <button onClick={finishService} className="btn-success" style={{
              padding: '16px 48px',
              fontSize: '1rem',
              borderRadius: '14px',
            }}>
              ✓ Terminer le Service
            </button>
          </div>
        )}
      </main>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
